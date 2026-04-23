import { useId, useRef, useState, type SyntheticEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  authService,
  handleMutationError,
  resetGuestSession,
} from '@shared/api';
import { useNotifications } from '@shared/lib';
import { Button, Icon, Input } from '@shared/ui';
import { ROUTES } from '@sharedCommon';
import type { Translation } from '@shared/i18n';

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
  const passwordErrorId = useId();
  const submitErrorId = useId();
  const popoverId = useId();
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordError, setPasswordError] = useState<Translation | null>(null);
  const [submitError, setSubmitError] = useState<Translation | null>(null);

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
    onError: error => {
      const normalizedError = handleMutationError(error);
      setSubmitError(normalizedError.message);
    },
  });

  const openConfirm = () => {
    popoverRef.current?.showPopover?.();
    setConfirmOpen(true);
    setPasswordError(null);
    setSubmitError(null);
  };

  const closeConfirm = () => {
    popoverRef.current?.hidePopover?.();
    setConfirmOpen(false);
    setPasswordVisible(false);
    setCurrentPassword('');
    setPasswordError(null);
    setSubmitError(null);
  };

  const handlePasswordChange = (value: string) => {
    setCurrentPassword(value);
    setPasswordError(null);
    setSubmitError(null);
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasPassword && currentPassword.trim().length === 0) {
      setPasswordError('account.dangerZone.password.required');
      return;
    }

    setPasswordError(null);
    setSubmitError(null);
    try {
      await mutateAsync();
    } catch {
      return;
    }
  };

  const handleToggle = (event: SyntheticEvent<HTMLDivElement>) => {
    setConfirmOpen(event.currentTarget.matches(':popover-open'));
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
            <div className='flex flex-col gap-1'>
              <label
                className='text-sm font-medium text-slate-900 dark:text-slate-100'
                htmlFor='delete-account-password'
              >
                {t('account.dangerZone.password.label')}
              </label>
              <div className='relative w-full'>
                <Input
                  id='delete-account-password'
                  className='w-full rounded border border-rose-300 bg-white px-3 py-2 pr-11 text-base text-slate-900 placeholder:text-slate-400 dark:border-rose-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500'
                  type={isPasswordVisible ? 'text' : 'password'}
                  autoComplete='current-password'
                  value={currentPassword}
                  onChange={event => handlePasswordChange(event.target.value)}
                  placeholder={t('account.dangerZone.password.placeholder')}
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={passwordError ? passwordErrorId : undefined}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  onClick={() => setPasswordVisible(prev => !prev)}
                  aria-label={t(
                    `account.dangerZone.password.${isPasswordVisible ? 'hide' : 'show'}`,
                  )}
                  aria-pressed={isPasswordVisible}
                >
                  <Icon
                    name={isPasswordVisible ? 'eyeOff' : 'eye'}
                    size={20}
                    stroke='currentColor'
                  />
                </button>
              </div>
              <div className='min-h-5'>
                {passwordError ? (
                  <p
                    id={passwordErrorId}
                    className='text-sm text-rose-700 dark:text-rose-300'
                  >
                    {t(passwordError)}
                  </p>
                ) : null}
              </div>
            </div>
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
