import type { MutationMethods, QueryError } from '@shared/api';
import type { Notepad } from '@sharedCommon/*';
import type { QueryObserverResult } from '@tanstack/react-query';
import type { NavigateFunction } from 'react-router';

export interface UseNotepadsProps {
  onSuccess?: (method: MutationMethods) => void;
  onError?: (error: QueryError) => void;
}

export interface MutationUpdateProps {
  notepadId: string;
  updatedNotepad: Partial<Notepad>;
}

export const handleMutationSuccess = (
  refetch: () => Promise<QueryObserverResult>,
  navigate?: NavigateFunction,
  redirectTo?: string,
) => {
  refetch();
  if (navigate && redirectTo) {
    navigate(redirectTo);
  }
};
