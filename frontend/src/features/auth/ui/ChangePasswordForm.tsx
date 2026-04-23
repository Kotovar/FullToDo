import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Input } from '@shared/ui';
import { createTranslationKeyGuard } from '../lib/createTranslationKeyGuard';
import { useChangePasswordForm } from '../model/changePassword/useChangePasswordForm';

const isTranslationKey = createTranslationKeyGuard('account');

type ChangePasswordFormProps = {
  email: string;
};

export const ChangePasswordForm = ({ email }: ChangePasswordFormProps) => {
  const { t } = useTranslation();
  const [isExpanded, setExpanded] = useState(false);
  const [isCurrentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const {
    values,
    errors,
    submitError,
    isPending,
    isSubmitDisabled,
    updateField,
    submit,
    resetForm,
  } = useChangePasswordForm(email);

  const closeForm = () => {
    setExpanded(false);
    setCurrentPasswordVisible(false);
    setNewPasswordVisible(false);
    setConfirmPasswordVisible(false);
    resetForm();
  };

  if (!isExpanded) {
    return (
      <div className='pt-2'>
        <Button
          onClick={() => setExpanded(true)}
          className='w-full justify-center sm:w-auto sm:min-w-44'
          padding='md'
        >
          {t('account.security.form.open')}
        </Button>
      </div>
    );
  }

  return (
    <form className='flex flex-col gap-4 pt-2' onSubmit={submit} noValidate>
      <div className='flex flex-col gap-1'>
        <label
          className='text-left text-sm font-medium'
          htmlFor='change-password-current'
        >
          {t('account.security.form.currentPassword.label')}
        </label>
        <div className='relative w-full'>
          <Input
            id='change-password-current'
            className='w-full rounded border border-slate-300 bg-white px-3 py-2 pr-11 text-base text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500'
            type={isCurrentPasswordVisible ? 'text' : 'password'}
            autoComplete='current-password'
            value={values.oldPassword}
            onChange={updateField('oldPassword')}
            placeholder={t('account.security.form.currentPassword.placeholder')}
            aria-invalid={Boolean(errors.oldPassword)}
            aria-describedby='change-password-current-error'
          />
          <button
            type='button'
            className='absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            onClick={() => setCurrentPasswordVisible(prev => !prev)}
            aria-label={t(
              `account.security.form.currentPassword.${isCurrentPasswordVisible ? 'hide' : 'show'}`,
            )}
            aria-pressed={isCurrentPasswordVisible}
          >
            <Icon
              name={isCurrentPasswordVisible ? 'eyeOff' : 'eye'}
              size={20}
              stroke='currentColor'
            />
          </button>
        </div>
        <div className='min-h-5'>
          {errors.oldPassword ? (
            <p
              id='change-password-current-error'
              className='text-left text-sm text-red-600 dark:text-red-400'
            >
              {isTranslationKey(errors.oldPassword)
                ? t(errors.oldPassword)
                : errors.oldPassword}
            </p>
          ) : null}
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        <label
          className='text-left text-sm font-medium'
          htmlFor='change-password-new'
        >
          {t('account.security.form.newPassword.label')}
        </label>
        <div className='relative w-full'>
          <Input
            id='change-password-new'
            className='w-full rounded border border-slate-300 bg-white px-3 py-2 pr-11 text-base text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500'
            type={isNewPasswordVisible ? 'text' : 'password'}
            autoComplete='new-password'
            value={values.newPassword}
            onChange={updateField('newPassword')}
            placeholder={t('account.security.form.newPassword.placeholder')}
            aria-invalid={Boolean(errors.newPassword)}
            aria-describedby='change-password-new-help change-password-new-error'
          />
          <button
            type='button'
            className='absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            onClick={() => setNewPasswordVisible(prev => !prev)}
            aria-label={t(
              `account.security.form.newPassword.${isNewPasswordVisible ? 'hide' : 'show'}`,
            )}
            aria-pressed={isNewPasswordVisible}
          >
            <Icon
              name={isNewPasswordVisible ? 'eyeOff' : 'eye'}
              size={20}
              stroke='currentColor'
            />
          </button>
        </div>
        <div className='min-h-10'>
          <p
            id='change-password-new-help'
            className='text-left text-sm text-slate-600 dark:text-slate-300'
          >
            {t('account.security.form.newPassword.hint')}
          </p>
          {errors.newPassword ? (
            <p
              id='change-password-new-error'
              className='text-left text-sm text-red-600 dark:text-red-400'
            >
              {isTranslationKey(errors.newPassword)
                ? t(errors.newPassword)
                : errors.newPassword}
            </p>
          ) : null}
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        <label
          className='text-left text-sm font-medium'
          htmlFor='change-password-confirm'
        >
          {t('account.security.form.confirmPassword.label')}
        </label>
        <div className='relative w-full'>
          <Input
            id='change-password-confirm'
            className='w-full rounded border border-slate-300 bg-white px-3 py-2 pr-11 text-base text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500'
            type={isConfirmPasswordVisible ? 'text' : 'password'}
            autoComplete='new-password'
            value={values.confirmPassword}
            onChange={updateField('confirmPassword')}
            placeholder={t('account.security.form.confirmPassword.placeholder')}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby='change-password-confirm-error'
          />
          <button
            type='button'
            className='absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            onClick={() => setConfirmPasswordVisible(prev => !prev)}
            aria-label={t(
              `account.security.form.confirmPassword.${isConfirmPasswordVisible ? 'hide' : 'show'}`,
            )}
            aria-pressed={isConfirmPasswordVisible}
          >
            <Icon
              name={isConfirmPasswordVisible ? 'eyeOff' : 'eye'}
              size={20}
              stroke='currentColor'
            />
          </button>
        </div>
        <div className='min-h-5'>
          {errors.confirmPassword ? (
            <p
              id='change-password-confirm-error'
              className='text-left text-sm text-red-600 dark:text-red-400'
            >
              {isTranslationKey(errors.confirmPassword)
                ? t(errors.confirmPassword)
                : errors.confirmPassword}
            </p>
          ) : null}
        </div>
      </div>

      <p className='text-left text-sm text-slate-600 dark:text-slate-300'>
        {t('account.security.sessionReset')}
      </p>

      <div className='min-h-14'>
        {submitError ? (
          <p className='rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300'>
            {t(submitError)}
          </p>
        ) : null}
      </div>

      <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
        <Button
          onClick={closeForm}
          className='w-full justify-center border-slate-300 bg-white text-slate-700 enabled:hover:bg-slate-100 sm:w-auto sm:min-w-44 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:enabled:hover:bg-slate-800'
          appearance='ghost'
          padding='md'
          disabled={isPending}
        >
          {t('account.security.form.cancel')}
        </Button>
        <Button
          type='submit'
          className='w-full justify-center disabled:border-slate-300 disabled:bg-slate-300 disabled:text-slate-500 sm:w-auto sm:min-w-44'
          padding='md'
          disabled={isSubmitDisabled}
        >
          {t(`account.security.form.submit${isPending ? 'Submitting' : ''}`)}
        </Button>
      </div>
    </form>
  );
};
