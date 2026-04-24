import type { Translation } from '@shared/i18n';

export type DeleteAccountState = {
  isConfirmOpen: boolean;
  isPasswordVisible: boolean;
  currentPassword: string;
  passwordError: Translation | null;
  submitError: Translation | null;
};

export type DeleteAccountAction =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'toggle_password_visibility' }
  | { type: 'change_password'; value: string }
  | { type: 'set_password_error'; value: Translation | null }
  | { type: 'set_submit_error'; value: Translation | null }
  | { type: 'set_confirm_open'; value: boolean }
  | { type: 'clear_errors' };

export const initialDeleteAccountState: DeleteAccountState = {
  isConfirmOpen: false,
  isPasswordVisible: false,
  currentPassword: '',
  passwordError: null,
  submitError: null,
};

export const deleteAccountReducer = (
  state: DeleteAccountState,
  action: DeleteAccountAction,
): DeleteAccountState => {
  switch (action.type) {
    case 'open':
      return {
        ...state,
        isConfirmOpen: true,
        passwordError: null,
        submitError: null,
      };
    case 'close':
      return initialDeleteAccountState;
    case 'toggle_password_visibility':
      return {
        ...state,
        isPasswordVisible: !state.isPasswordVisible,
      };
    case 'change_password':
      return {
        ...state,
        currentPassword: action.value,
        passwordError: null,
        submitError: null,
      };
    case 'set_password_error':
      return {
        ...state,
        passwordError: action.value,
      };
    case 'set_submit_error':
      return {
        ...state,
        submitError: action.value,
      };
    case 'set_confirm_open':
      return {
        ...state,
        isConfirmOpen: action.value,
      };
    case 'clear_errors':
      return {
        ...state,
        passwordError: null,
        submitError: null,
      };
    default:
      return state;
  }
};
