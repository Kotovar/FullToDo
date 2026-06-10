import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import {
  authService,
  handleMutationError,
  resetGuestSession,
} from '@shared/api';
import { useNotifications } from '@shared/lib';
import {
  ROUTES,
  changePasswordSchema,
  type ChangePassword,
} from '@sharedCommon';
import type { Translation } from '@shared/i18n';
import {
  createLoginPrefillState,
  persistLoginPrefilledEmail,
} from '../register/redirect';

type ChangePasswordField = 'oldPassword' | 'newPassword' | 'confirmPassword';
type ChangePasswordFormValues = ChangePassword & { confirmPassword: string };
type ChangePasswordFormErrors = Partial<Record<ChangePasswordField, string>>;

const INITIAL_VALUES: ChangePasswordFormValues = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const VALIDATION_MESSAGE_MAP: Record<string, Translation> = {
  'Password must be at least 8 characters':
    'account.security.validation.newPassword.min',
  'Must contain at least one uppercase letter':
    'account.security.validation.newPassword.uppercase',
  'Must contain at least one number':
    'account.security.validation.newPassword.number',
  'New password must differ from current password':
    'account.security.validation.newPassword.sameAsCurrent',
};

const validateChangePasswordForm = (
  values: ChangePasswordFormValues,
): ChangePasswordFormErrors | null => {
  const result = changePasswordSchema.safeParse({
    oldPassword: values.oldPassword,
    newPassword: values.newPassword,
  });
  const errors: ChangePasswordFormErrors = {};

  if (!result.success) {
    const { properties } = z.treeifyError(result.error);
    errors.oldPassword =
      values.oldPassword.length === 0
        ? 'account.security.validation.currentPassword.required'
        : undefined;
    errors.newPassword = properties?.newPassword?.errors?.[0]
      ? (VALIDATION_MESSAGE_MAP[properties.newPassword.errors[0]] ??
        properties.newPassword.errors[0])
      : undefined;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword =
      'account.security.validation.confirmPassword.required';
  } else if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword =
      'account.security.validation.confirmPassword.mismatch';
  }

  return Object.values(errors).some(Boolean) ? errors : null;
};

export const useChangePasswordForm = (email: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess } = useNotifications();
  const [values, setValues] =
    useState<ChangePasswordFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ChangePasswordFormErrors>({});
  const [submitError, setSubmitError] = useState<Translation | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ oldPassword, newPassword }: ChangePassword) =>
      authService.changePassword({ oldPassword, newPassword }),
    onSuccess: async () => {
      showSuccess('notifications.auth.passwordChanged');
      persistLoginPrefilledEmail(email);
      await resetGuestSession(queryClient);
      navigate(ROUTES.app.login, {
        replace: true,
        state: createLoginPrefillState(email),
      });
    },
    onError: error => {
      const normalizedError = handleMutationError(error);
      setSubmitError(normalizedError.message);
    },
  });

  const updateField =
    (field: ChangePasswordField) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues(prev => ({ ...prev, [field]: event.target.value }));
      setErrors(prev => ({ ...prev, [field]: undefined }));
    };

  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateChangePasswordForm(values);

    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setSubmitError(null);
    await mutateAsync({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
  };

  const isSubmitDisabled =
    isPending ||
    !values.oldPassword ||
    !values.newPassword ||
    !values.confirmPassword;

  const resetForm = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setSubmitError(null);
  };

  return {
    values,
    errors,
    submitError,
    isPending,
    isSubmitDisabled,
    updateField,
    submit,
    resetForm,
  };
};
