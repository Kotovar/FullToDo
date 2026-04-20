import {
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useSessionStorage } from 'usehooks-ts';
import { z } from 'zod';
import {
  authKeys,
  authService,
  fetchCurrentUser,
  handleMutationError,
} from '@shared/api';
import { loginWithEmailSchema, type LoginWithEmail } from '@sharedCommon';
import type { Translation } from '@shared/i18n';

const LOGIN_EMAIL_STORAGE_KEY = 'login-email';

type LoginField = keyof LoginWithEmail;
type LoginFormErrors = Partial<Record<LoginField, string>>;

const VALIDATION_MESSAGE_MAP: Record<string, Translation> = {
  'Invalid email': 'login.validation.email.invalid',
};

const getValidationMessage = (message: string) =>
  VALIDATION_MESSAGE_MAP[message] ?? message;

const validateLoginForm = (values: LoginWithEmail): LoginFormErrors | null => {
  const result = loginWithEmailSchema.safeParse(values);

  if (result.success) {
    return null;
  }

  const fieldErrors = z.treeifyError(result.error);

  return {
    email: fieldErrors.properties?.email?.errors?.[0]
      ? getValidationMessage(fieldErrors.properties.email.errors[0])
      : undefined,
    password:
      values.password.length === 0
        ? 'login.validation.password.required'
        : undefined,
  };
};

type UseLoginFormOptions = {
  initialEmail?: string | null;
  redirectTo: string;
};

export const useLoginForm = ({
  initialEmail,
  redirectTo,
}: UseLoginFormOptions) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [storedEmail, setStoredEmail] = useSessionStorage(
    LOGIN_EMAIL_STORAGE_KEY,
    '',
  );
  const [values, setValues] = useState<LoginWithEmail>({
    email: initialEmail ?? storedEmail,
    password: '',
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [submitError, setSubmitError] = useState<Translation | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (nextValues: LoginWithEmail) => authService.login(nextValues),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authKeys.me(),
      });
      await queryClient.fetchQuery({
        queryKey: authKeys.me(),
        queryFn: fetchCurrentUser,
      });

      setStoredEmail('');
      navigate(redirectTo, { replace: true });
    },
    onError: error => {
      const normalizedError = handleMutationError(error);
      setSubmitError(normalizedError.message);
    },
  });

  const updateField = useCallback(
    (field: LoginField) => (event: ChangeEvent<HTMLInputElement>) => {
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

      const validationErrors = validateLoginForm(values);

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
