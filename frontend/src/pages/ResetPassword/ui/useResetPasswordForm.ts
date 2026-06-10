import { useReducer, type ChangeEvent, type SyntheticEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router';
import { z } from 'zod';
import {
  authKeys,
  authService,
  handleMutationError,
  resetGuestSession,
} from '@shared/api';
import { resetPasswordSchema, ROUTES } from '@sharedCommon';
import type { Translation } from '@shared/i18n';
import {
  createInitialResetPasswordState,
  resetPasswordReducer,
  type ResetPasswordErrors,
  type ResetPasswordField,
  type ResetPasswordValues,
} from './ResetPassword.reducer';

const VALIDATION_MESSAGE_MAP: Record<string, Translation> = {
  'Password must be at least 8 characters':
    'resetPassword.validation.newPassword.min',
  'Must contain at least one uppercase letter':
    'resetPassword.validation.newPassword.uppercase',
  'Must contain at least one number':
    'resetPassword.validation.newPassword.number',
};

const validateResetPassword = (
  values: ResetPasswordValues,
): ResetPasswordErrors | null => {
  const result = resetPasswordSchema.safeParse({
    token: values.token,
    newPassword: values.newPassword,
  });
  const errors: ResetPasswordErrors = {};

  if (!result.success) {
    const { properties } = z.treeifyError(result.error);
    if (properties?.token?.errors?.[0])
      errors.token = 'resetPassword.validation.token.required';
    if (properties?.newPassword?.errors?.[0]) {
      errors.newPassword =
        VALIDATION_MESSAGE_MAP[properties.newPassword.errors[0]] ??
        'resetPassword.validation.newPassword.min';
    }
  }

  if (!values.confirmPassword) {
    errors.confirmPassword =
      'resetPassword.validation.confirmPassword.required';
  } else if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword =
      'resetPassword.validation.confirmPassword.mismatch';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export const useResetPasswordForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [state, dispatch] = useReducer(
    resetPasswordReducer,
    token,
    createInitialResetPasswordState,
  );
  const {
    values,
    errors,
    submitError,
    isNewPasswordVisible,
    isConfirmPasswordVisible,
  } = state;

  const { mutate, isPending } = useMutation({
    mutationFn: ({ confirmPassword: _, ...payload }: ResetPasswordValues) =>
      authService.resetPassword(payload),
    onSuccess: async () => {
      await resetGuestSession(queryClient);
      await queryClient.invalidateQueries({ queryKey: authKeys.me() });
      navigate(ROUTES.app.login, { replace: true });
    },
    onError: error =>
      dispatch({
        type: 'set_submit_error',
        error: handleMutationError(error).message,
      }),
  });

  const updateField =
    (field: Extract<ResetPasswordField, 'newPassword' | 'confirmPassword'>) =>
    (event: ChangeEvent<HTMLInputElement>) =>
      dispatch({ type: 'update_field', field, value: event.target.value });

  const submit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateResetPassword(values);
    if (validationErrors) {
      dispatch({ type: 'set_errors', errors: validationErrors });
      return;
    }
    mutate(values);
  };

  const isSubmitDisabled =
    isPending ||
    !values.token ||
    !values.newPassword ||
    !values.confirmPassword;

  const toggleNewPasswordVisibility = () =>
    dispatch({ type: 'toggle_new_password_visibility' });
  const toggleConfirmPasswordVisibility = () =>
    dispatch({ type: 'toggle_confirm_password_visibility' });

  return {
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
  };
};
