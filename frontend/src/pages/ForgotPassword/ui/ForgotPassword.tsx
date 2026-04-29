import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@shared/ui';
import { ROUTES } from '@sharedCommon';
import { useForgotPasswordForm } from './useForgotPasswordForm';

export const ForgotPassword = () => {
  const { t } = useTranslation();
  const {
    values,
    errors,
    submitError,
    isSubmitted,
    isPending,
    isSubmitDisabled,
    updateEmail,
    submit,
  } = useForgotPasswordForm();

  return (
    <>
      <form className='flex w-full flex-col gap-4' onSubmit={submit} noValidate>
        <p className='text-center text-sm'>{t('forgotPassword.description')}</p>

        <div className='flex flex-col gap-1'>
          <label
            className='text-left text-sm font-medium'
            htmlFor='forgot-password-email'
          >
            {t('forgotPassword.form.email.label')}
          </label>
          <Input
            id='forgot-password-email'
            className='rounded border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 dark:text-slate-900'
            type='email'
            autoComplete='email'
            value={values.email}
            onChange={updateEmail}
            placeholder={t('forgotPassword.form.email.placeholder')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby='forgot-password-email-error'
          />
          <div className='min-h-5'>
            {errors.email ? (
              <p
                id='forgot-password-email-error'
                className='text-left text-sm text-red-600'
              >
                {t(errors.email)}
              </p>
            ) : null}
          </div>
        </div>

        <div className='min-h-20'>
          {isSubmitted ? (
            <p className='rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800'>
              {t('forgotPassword.successMessage')}
            </p>
          ) : null}
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
            ? t('forgotPassword.form.submitting')
            : t('forgotPassword.form.submit')}
        </Button>
      </form>

      <Link
        className='w-full max-w-md rounded border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-50'
        to={ROUTES.app.login}
      >
        {t('forgotPassword.login')}
      </Link>
      <div aria-hidden='true' className='min-h-24 w-full max-w-md' />
    </>
  );
};
