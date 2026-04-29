import {
  useCallback,
  useMemo,
  useReducer,
  type ChangeEvent,
  type SyntheticEvent,
} from 'react';
import { z } from 'zod';
import { authService, handleMutationError } from '@shared/api';
import { forgotPasswordSchema, type ForgotPassword } from '@sharedCommon';
import type { Translation } from '@shared/i18n';
import {
  forgotPasswordReducer,
  initialForgotPasswordState,
  type ForgotPasswordErrors,
} from './ForgotPassword.reducer';

const VALIDATION_MESSAGE_MAP: Record<string, Translation> = {
  'Invalid email': 'forgotPassword.validation.email.invalid',
};

const getValidationMessage = (message: string): Translation =>
  VALIDATION_MESSAGE_MAP[message] ?? 'forgotPassword.validation.email.invalid';

const validateForgotPassword = (
  values: ForgotPassword,
): ForgotPasswordErrors | null => {
  const result = forgotPasswordSchema.safeParse(values);

  if (result.success) {
    return null;
  }

  const fieldErrors = z.treeifyError(result.error);

  return {
    email: fieldErrors.properties?.email?.errors?.[0]
      ? getValidationMessage(fieldErrors.properties.email.errors[0])
      : undefined,
  };
};

export const useForgotPasswordForm = () => {
  const [state, dispatch] = useReducer(
    forgotPasswordReducer,
    initialForgotPasswordState,
  );
  const { values, errors, submitError, isSubmitted, isPending } = state;

  const updateEmail = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'change_email',
      value: event.target.value,
    });
  }, []);

  const submit = useCallback(
    async (event: SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();

      const validationErrors = validateForgotPassword(values);

      if (validationErrors) {
        dispatch({
          type: 'set_errors',
          errors: validationErrors,
        });
        return;
      }

      dispatch({ type: 'submit_start' });
      try {
        await authService.forgotPassword(values);
        dispatch({ type: 'submit_success' });
      } catch (error) {
        const normalizedError = handleMutationError(error);
        dispatch({
          type: 'submit_error',
          error: normalizedError.message,
        });
      }
    },
    [values],
  );

  const isSubmitDisabled = useMemo(
    () => isPending || values.email.trim().length === 0,
    [isPending, values.email],
  );

  return {
    values,
    errors,
    submitError,
    isSubmitted,
    isPending,
    isSubmitDisabled,
    updateEmail,
    submit,
  };
};
