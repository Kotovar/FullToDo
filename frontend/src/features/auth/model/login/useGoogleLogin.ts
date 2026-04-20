import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import {
  authKeys,
  authService,
  fetchCurrentUser,
  handleMutationError,
} from '@shared/api';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_SCRIPT_URL,
  getGoogleAccountsId,
  initializeGoogleAccounts,
  renderGoogleButton,
  setGoogleCredentialHandler,
} from './google';
import type { Translation } from '@shared/i18n';

type UseGoogleLoginOptions = {
  redirectTo: string;
};

export const useGoogleLogin = ({ redirectTo }: UseGoogleLoginOptions) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const isConfigured = Boolean(GOOGLE_CLIENT_ID);
  const [scriptReady, setScriptReady] = useState(() =>
    isConfigured ? Boolean(getGoogleAccountsId()) : false,
  );
  const [googleError, setGoogleError] = useState<Translation | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (token: string) => authService.loginWithGoogle({ token }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authKeys.me(),
      });
      await queryClient.fetchQuery({
        queryKey: authKeys.me(),
        queryFn: fetchCurrentUser,
      });

      navigate(redirectTo, { replace: true });
    },
    onError: error => {
      const normalizedError = handleMutationError(error);
      setGoogleError(normalizedError.message);
    },
  });

  useEffect(() => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_SCRIPT_URL}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => setScriptReady(true), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.src = GOOGLE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptReady(true);
    document.body.append(script);

    return () => {
      script.onload = null;
    };
  }, [isConfigured]);

  useEffect(() => {
    if (
      !isConfigured ||
      !scriptReady ||
      !buttonRef.current ||
      !GOOGLE_CLIENT_ID
    ) {
      return;
    }

    setGoogleCredentialHandler(response => {
      if (!response.credential) {
        setGoogleError('errors.auth.UNAUTHORIZED');
        return;
      }

      setGoogleError(null);
      void mutateAsync(response.credential);
    });

    if (!initializeGoogleAccounts()) {
      return;
    }

    renderGoogleButton(buttonRef.current);
  }, [isConfigured, mutateAsync, scriptReady]);

  return {
    buttonRef,
    googleError,
    isConfigured,
    isPending,
  };
};
