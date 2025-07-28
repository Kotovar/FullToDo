import type { NavigateFunction } from 'react-router';
import type { QueryObserverResult } from '@tanstack/react-query';
import type { Notepad } from '@sharedCommon/*';

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
