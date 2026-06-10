import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/ui';
import { useChangePasswordForm } from '../../model/changePassword/useChangePasswordForm';
import { PasswordField } from './PasswordField';

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
      <PasswordField
        id='change-password-current'
        label={t('account.security.form.currentPassword.label')}
        value={values.oldPassword}
        onChange={updateField('oldPassword')}
        placeholder={t('account.security.form.currentPassword.placeholder')}
        visible={isCurrentPasswordVisible}
        onToggleVisible={() => setCurrentPasswordVisible(prev => !prev)}
        error={errors.oldPassword}
        autoComplete='current-password'
        showLabel={t('account.security.form.currentPassword.show')}
        hideLabel={t('account.security.form.currentPassword.hide')}
      />

      <PasswordField
        id='change-password-new'
        label={t('account.security.form.newPassword.label')}
        value={values.newPassword}
        onChange={updateField('newPassword')}
        placeholder={t('account.security.form.newPassword.placeholder')}
        visible={isNewPasswordVisible}
        onToggleVisible={() => setNewPasswordVisible(prev => !prev)}
        error={errors.newPassword}
        help={t('account.security.form.newPassword.hint')}
        autoComplete='new-password'
        showLabel={t('account.security.form.newPassword.show')}
        hideLabel={t('account.security.form.newPassword.hide')}
      />

      <PasswordField
        id='change-password-confirm'
        label={t('account.security.form.confirmPassword.label')}
        value={values.confirmPassword}
        onChange={updateField('confirmPassword')}
        placeholder={t('account.security.form.confirmPassword.placeholder')}
        visible={isConfirmPasswordVisible}
        onToggleVisible={() => setConfirmPasswordVisible(prev => !prev)}
        error={errors.confirmPassword}
        autoComplete='new-password'
        showLabel={t('account.security.form.confirmPassword.show')}
        hideLabel={t('account.security.form.confirmPassword.hide')}
      />

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
