import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Translation } from '@shared/i18n';
import { Button, Icon, Input } from '@shared/ui';
import { useRegisterForm } from '../model/useRegisterForm';

const isTranslationKey = (value: string): value is Translation =>
  value.startsWith('register.') || value.startsWith('errors.');

export const RegisterForm = () => {
  const { t } = useTranslation();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const {
    values,
    errors,
    submitError,
    isPending,
    isSubmitDisabled,
    updateField,
    submit,
  } = useRegisterForm();

  return (
    <form
      className='flex w-full max-w-md flex-col gap-4'
      onSubmit={submit}
      noValidate
    >
      <p className='text-center text-sm'>{t('register.description')}</p>

      <div className='flex flex-col gap-1'>
        <label
          className='text-left text-sm font-medium'
          htmlFor='register-email'
        >
          {t('register.form.email.label')}
        </label>
        <Input
          id='register-email'
          className='rounded border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 dark:text-slate-900'
          type='email'
          autoComplete='email'
          value={values.email}
          onChange={updateField('email')}
          placeholder={t('register.form.email.placeholder')}
          aria-invalid={Boolean(errors.email)}
          aria-describedby='register-email-error'
        />
        <div className='min-h-5'>
          {errors.email ? (
            <p
              id='register-email-error'
              className='text-left text-sm text-red-600'
            >
              {isTranslationKey(errors.email) ? t(errors.email) : errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        <label
          className='text-left text-sm font-medium'
          htmlFor='register-password'
        >
          {t('register.form.password.label')}
        </label>
        <div className='relative'>
          <Input
            id='register-password'
            className='w-full rounded border border-slate-300 bg-white px-3 py-2 pr-11 text-base text-slate-900 placeholder:text-slate-400 dark:text-slate-900'
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete='new-password'
            value={values.password}
            onChange={updateField('password')}
            placeholder={t('register.form.password.placeholder')}
            aria-invalid={Boolean(errors.password)}
            aria-describedby='register-password-help register-password-error'
          />
          <button
            type='button'
            className='absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition hover:text-slate-700'
            onClick={() => setPasswordVisible(prev => !prev)}
            aria-label={t(
              isPasswordVisible
                ? 'register.form.password.hide'
                : 'register.form.password.show',
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
        <p
          id='register-password-help'
          className='text-left text-sm text-slate-500'
        >
          {t('register.form.password.hint')}
        </p>
        <div className='min-h-5'>
          {errors.password ? (
            <p
              id='register-password-error'
              className='text-left text-sm text-red-600'
            >
              {isTranslationKey(errors.password)
                ? t(errors.password)
                : errors.password}
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
        {isPending ? t('register.form.submitting') : t('register.form.submit')}
      </Button>
    </form>
  );
};
