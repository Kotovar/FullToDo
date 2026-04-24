import { useCallback, useReducer, useRef, type SyntheticEvent } from 'react';
import type { Translation } from '@shared/i18n';
import {
  deleteAccountReducer,
  initialDeleteAccountState,
} from './DeleteAccountSection.reducer';

export const useDeleteAccountDialog = () => {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [state, dispatch] = useReducer(
    deleteAccountReducer,
    initialDeleteAccountState,
  );

  const openConfirm = useCallback(() => {
    popoverRef.current?.showPopover?.();
    dispatch({ type: 'open' });
  }, []);

  const closeConfirm = useCallback(() => {
    popoverRef.current?.hidePopover?.();
    dispatch({ type: 'close' });
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    dispatch({ type: 'change_password', value });
  }, []);

  const handleToggle = useCallback((event: SyntheticEvent<HTMLDivElement>) => {
    dispatch({
      type: 'set_confirm_open',
      value: event.currentTarget.matches(':popover-open'),
    });
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    dispatch({ type: 'toggle_password_visibility' });
  }, []);

  const setPasswordError = useCallback((value: Translation | null) => {
    dispatch({ type: 'set_password_error', value });
  }, []);

  const setSubmitError = useCallback((value: Translation | null) => {
    dispatch({ type: 'set_submit_error', value });
  }, []);

  const clearErrors = useCallback(() => {
    dispatch({ type: 'clear_errors' });
  }, []);

  return {
    popoverRef,
    state,
    openConfirm,
    closeConfirm,
    handlePasswordChange,
    handleToggle,
    togglePasswordVisibility,
    setPasswordError,
    setSubmitError,
    clearErrors,
  };
};
