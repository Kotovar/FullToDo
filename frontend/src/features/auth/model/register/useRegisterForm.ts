import {
  useCallback,
  useMemo,
  useState,
  type SyntheticEvent,
  type ChangeEvent,
} from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useSessionStorage } from 'usehooks-ts';
import { z } from 'zod';
import { authService, handleMutationError } from '@shared/api';
import { useNotifications } from '@shared/lib';
import {
  ROUTES,
  registerWithEmailSchema,
  type RegisterWithEmail,
} from '@sharedCommon';
import { createRegisterRedirectState } from './redirect';
import type { Translation } from '@shared/i18n';

type RegisterField = keyof RegisterWithEmail;
type RegisterFormErrors = Partial<Record<RegisterField, string>>;

const REGISTER_EMAIL_STORAGE_KEY = 'register-email';

const VALIDATION_MESSAGE_MAP: Record<string, Translation> = {
  'Invalid email': 'register.validation.email.invalid',
  'Password must be at least 8 characters': 'register.validation.password.min',
  'Must contain at least one uppercase letter':
    'register.validation.password.uppercase',
  'Must contain at least one number': 'register.validation.password.number',
};

const getValidationMessage = (message: string) =>
  VALIDATION_MESSAGE_MAP[message] ?? message;

const validateRegisterForm = (
  values: RegisterWithEmail,
): RegisterFormErrors | null => {
  const result = registerWithEmailSchema.safeParse(values);

  if (result.success) {
    return null;
  }

  const fieldErrors = z.treeifyError(result.error);

  return {
    email: fieldErrors.properties?.email?.errors?.[0]
      ? getValidationMessage(fieldErrors.properties.email.errors[0])
      : undefined,
    password: fieldErrors.properties?.password?.errors?.[0]
      ? getValidationMessage(fieldErrors.properties.password.errors[0])
      : undefined,
  };
};

/**
 * Управляет формой регистрации по email и паролю.
 * После успешной регистрации перенаправляет на логин без автологина.
 */
export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { showSuccess } = useNotifications();
  const [storedEmail, setStoredEmail] = useSessionStorage(
    REGISTER_EMAIL_STORAGE_KEY,
    '',
  );
  const [values, setValues] = useState<RegisterWithEmail>({
    email: storedEmail,
    password: '',
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [submitError, setSubmitError] = useState<Translation | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (nextValues: RegisterWithEmail) =>
      authService.register(nextValues),
    onSuccess: (_, submittedValues) => {
      setStoredEmail('');
      showSuccess('notifications.auth.register');
      navigate(ROUTES.app.login, {
        replace: true,
        state: createRegisterRedirectState(submittedValues.email),
      });
    },
    onError: error => {
      const normalizedError = handleMutationError(error);
      setSubmitError(normalizedError.message);
    },
  });

  const updateField = useCallback(
    (field: RegisterField) => (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;

      setValues(prev => ({
        ...prev,
        [field]: nextValue,
      }));
      if (field === 'email') {
        setStoredEmail(nextValue);
      }
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
      setSubmitError(null);
    },
    [setStoredEmail],
  );

  const submit = useCallback(
    async (event: SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();

      const validationErrors = validateRegisterForm(values);

      if (validationErrors) {
        setErrors(validationErrors);
        return;
      }

      setSubmitError(null);
      await mutateAsync(values);
    },
    [mutateAsync, values],
  );

  const isSubmitDisabled = useMemo(
    () =>
      isPending ||
      values.email.trim().length === 0 ||
      values.password.length === 0,
    [isPending, values.email, values.password.length],
  );

  return {
    values,
    errors,
    submitError,
    isPending,
    isSubmitDisabled,
    updateField,
    submit,
  };
};
