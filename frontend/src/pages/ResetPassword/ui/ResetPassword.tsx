import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Input } from '@shared/ui';
import { ROUTES } from '@sharedCommon';
import { useResetPasswordForm } from './useResetPasswordForm';

export const ResetPassword = () => {
  const { t } = useTranslation();
  const {
    values,
    errors,
    submitError,
    isNewPasswordVisible,
    isConfirmPasswordVisible,
    isPending,
    isSubmitDisabled,
    updateField,
    submit,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = useResetPasswordForm();

  return (
    <>
      <form className='flex w-full flex-col gap-4' onSubmit={submit} noValidate>
        <p className='text-center text-sm'>{t('resetPassword.description')}</p>

        {errors.token ? (
          <p className='rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
            {t(errors.token)}
          </p>
        ) : null}

        <div className='flex flex-col gap-1'>
          <label
            className='text-left text-sm font-medium'
            htmlFor='reset-password-new'
          >
            {t('resetPassword.form.newPassword.label')}
          </label>
          <div className='relative'>
            <Input
              id='reset-password-new'
              className='w-full rounded border border-slate-300 bg-white px-3 py-2 pr-11 text-base text-slate-900 placeholder:text-slate-400 dark:text-slate-900'
              type={isNewPasswordVisible ? 'text' : 'password'}
              autoComplete='new-password'
              value={values.newPassword}
              onChange={updateField('newPassword')}
              placeholder={t('resetPassword.form.newPassword.placeholder')}
              aria-invalid={Boolean(errors.newPassword)}
              aria-describedby='reset-password-new-help reset-password-new-error'
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition hover:text-slate-700'
              onClick={toggleNewPasswordVisibility}
              aria-label={t(
                isNewPasswordVisible
                  ? 'resetPassword.form.newPassword.hide'
                  : 'resetPassword.form.newPassword.show',
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
              id='reset-password-new-help'
              className='text-left text-sm text-slate-500'
            >
              {t('resetPassword.form.newPassword.hint')}
            </p>
            {errors.newPassword ? (
              <p
                id='reset-password-new-error'
                className='text-left text-sm text-red-600'
              >
                {t(errors.newPassword)}
              </p>
            ) : null}
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <label
            className='text-left text-sm font-medium'
            htmlFor='reset-password-confirm'
          >
            {t('resetPassword.form.confirmPassword.label')}
          </label>
          <div className='relative'>
            <Input
              id='reset-password-confirm'
              className='w-full rounded border border-slate-300 bg-white px-3 py-2 pr-11 text-base text-slate-900 placeholder:text-slate-400 dark:text-slate-900'
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              autoComplete='new-password'
              value={values.confirmPassword}
              onChange={updateField('confirmPassword')}
              placeholder={t('resetPassword.form.confirmPassword.placeholder')}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby='reset-password-confirm-error'
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition hover:text-slate-700'
              onClick={toggleConfirmPasswordVisibility}
              aria-label={t(
                isConfirmPasswordVisible
                  ? 'resetPassword.form.confirmPassword.hide'
                  : 'resetPassword.form.confirmPassword.show',
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
                id='reset-password-confirm-error'
                className='text-left text-sm text-red-600'
              >
                {t(errors.confirmPassword)}
              </p>
            ) : null}
          </div>
        </div>

        <div className='min-h-14'>
          {submitError ? (
            <p className='rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
              {t(submitError)}
            </p>
          ) : null}
        </div>

        <Button
          type='submit'
          className='w-full justify-center disabled:border-slate-300 disabled:bg-slate-300 disabled:text-slate-500'
          padding='md'
          disabled={isSubmitDisabled}
        >
          {isPending
            ? t('resetPassword.form.submitting')
            : t('resetPassword.form.submit')}
        </Button>
      </form>

      <Link
        className='w-full max-w-md rounded border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-50'
        to={ROUTES.app.login}
      >
        {t('resetPassword.login')}
      </Link>
      <div aria-hidden='true' className='min-h-24 w-full max-w-md' />
    </>
  );
};
