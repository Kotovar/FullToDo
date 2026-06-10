import type { SyntheticEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  authService,
  handleMutationError,
  resetGuestSession,
} from '@shared/api';
import { useNotifications } from '@shared/lib';
import { Button } from '@shared/ui';
import { ROUTES } from '@sharedCommon';
import { useDeleteAccountDialog } from './useDeleteAccountDialog';
import { DeleteAccountPasswordField } from './DeleteAccountPasswordField';

type DeleteAccountSectionProps = {
  email: string;
  hasPassword: boolean;
};

export const DeleteAccountSection = ({
  email,
  hasPassword,
}: DeleteAccountSectionProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess } = useNotifications();
  const passwordErrorId = 'delete-account-password-error';
  const submitErrorId = 'delete-account-submit-error';
  const popoverId = 'delete-account-popover';
  const {
    popoverRef,
    state,
    openConfirm,
    closeConfirm,
    handlePasswordChange,
    handleToggle,
    togglePasswordVisibility,
    setPasswordError,
    setSubmitError,
    clearErrors,
  } = useDeleteAccountDialog();
  const {
    isConfirmOpen,
    isPasswordVisible,
    currentPassword,
    passwordError,
    submitError,
  } = state;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      authService.deleteUser(
        hasPassword ? { currentPassword } : { currentPassword: undefined },
      ),
    onSuccess: async () => {
      showSuccess('notifications.auth.accountDeleted');
      await resetGuestSession(queryClient);
      navigate(ROUTES.app.login, { replace: true });
    },
    onError: error => setSubmitError(handleMutationError(error).message),
  });

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasPassword && currentPassword.trim().length === 0) {
      setPasswordError('account.dangerZone.password.required');
      return;
    }

    clearErrors();
    try {
      await mutateAsync();
    } catch {
      return;
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2 text-base text-slate-700 dark:text-slate-200'>
        <p>{t('account.dangerZone.description')}</p>
        <p className='text-sm text-rose-700 dark:text-rose-300'>
          {t('account.dangerZone.warning')}
        </p>
      </div>
      <Button
        onClick={openConfirm}
        aria-haspopup='dialog'
        aria-expanded={isConfirmOpen}
        aria-controls={popoverId}
        className='w-full justify-center border-rose-600 bg-rose-600 text-white enabled:hover:bg-rose-700 sm:w-fit'
        padding='md'
        disabled={isPending || isConfirmOpen}
      >
        {t('account.dangerZone.trigger')}
      </Button>
      <div
        ref={popoverRef}
        id={popoverId}
        popover='auto'
        role='dialog'
        aria-label={t('account.dangerZone.confirmTitle')}
        onToggle={handleToggle}
        className='bg-light text-dark fixed top-1/2 left-1/2 m-0 w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-rose-300 p-5 shadow-lg shadow-slate-900/15 backdrop:bg-black/45 dark:border-rose-800 dark:bg-slate-900 dark:text-slate-100'
      >
        <form
          className='flex flex-col gap-4'
          onSubmit={handleSubmit}
          noValidate
        >
          <div className='flex flex-col gap-2'>
            <h3 className='text-lg font-semibold text-rose-800 dark:text-rose-200'>
              {t('account.dangerZone.confirmTitle')}
            </h3>
            <p className='text-sm text-slate-700 dark:text-slate-200'>
              {t('account.dangerZone.confirmDescription', { email })}
            </p>
            <p className='text-sm text-rose-700 dark:text-rose-300'>
              {t('account.dangerZone.warning')}
            </p>
          </div>
          {hasPassword ? (
            <DeleteAccountPasswordField
              value={currentPassword}
              onChange={handlePasswordChange}
              visible={isPasswordVisible}
              onToggleVisible={togglePasswordVisibility}
              error={passwordError}
              errorId={passwordErrorId}
            />
          ) : null}
          <div className='min-h-14'>
            {submitError ? (
              <p
                id={submitErrorId}
                className='rounded border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300'
              >
                {t(submitError)}
              </p>
            ) : null}
          </div>
          <div className='flex flex-col gap-2 sm:flex-row sm:justify-end'>
            <Button
              onClick={closeConfirm}
              aria-controls={popoverId}
              className='justify-center border-slate-300 bg-white text-slate-700 enabled:hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:enabled:hover:bg-slate-800'
              appearance='ghost'
              padding='md'
              disabled={isPending}
            >
              {t('account.dangerZone.cancel')}
            </Button>
            <Button
              type='submit'
              className='justify-center border-rose-700 bg-rose-700 text-white enabled:hover:bg-rose-800 disabled:border-rose-300 disabled:bg-rose-300 disabled:text-rose-100 dark:border-rose-700 dark:bg-rose-700 dark:enabled:hover:bg-rose-800'
              padding='md'
              disabled={isPending}
              aria-describedby={submitError ? submitErrorId : undefined}
            >
              {t(
                `account.dangerZone.confirmAction${isPending ? 'Submitting' : ''}`,
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
