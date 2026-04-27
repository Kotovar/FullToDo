import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import {
  authKeys,
  authService,
  fetchCurrentUser,
  handleMutationError,
  resetGuestSession,
} from '@shared/api';
import { useNotifications } from '@shared/lib';
import { ROUTES } from '@sharedCommon';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showError } = useNotifications();
  const { data: user } = useQuery({
    queryKey: authKeys.me(),
    queryFn: fetchCurrentUser,
    enabled: false,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      await resetGuestSession(queryClient);
      await queryClient.invalidateQueries({
        queryKey: authKeys.me(),
      });
      navigate(ROUTES.app.login, { replace: true });
    },
    onError: error => {
      showError(handleMutationError(error).message);
    },
  });

  const logout = useCallback(async () => {
    await mutateAsync();
  }, [mutateAsync]);

  return {
    isAuthenticated: Boolean(user),
    isPending,
    logout,
  };
};
