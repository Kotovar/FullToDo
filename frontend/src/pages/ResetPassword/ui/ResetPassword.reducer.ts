import type { ResetPassword as ResetPasswordPayload } from '@sharedCommon';
import type { Translation } from '@shared/i18n';

export type ResetPasswordValues = ResetPasswordPayload & {
  confirmPassword: string;
};
export type ResetPasswordField = keyof ResetPasswordValues;
export type ResetPasswordErrors = Partial<
  Record<ResetPasswordField, Translation>
>;

export type ResetPasswordState = {
  values: ResetPasswordValues;
  errors: ResetPasswordErrors;
  submitError: Translation | null;
  isNewPasswordVisible: boolean;
  isConfirmPasswordVisible: boolean;
};

export type ResetPasswordAction =
  | {
      type: 'update_field';
      field: Extract<ResetPasswordField, 'newPassword' | 'confirmPassword'>;
      value: string;
    }
  | { type: 'set_errors'; errors: ResetPasswordErrors }
  | { type: 'set_submit_error'; error: Translation }
  | { type: 'toggle_new_password_visibility' }
  | { type: 'toggle_confirm_password_visibility' };

export const createInitialResetPasswordState = (
  token: string,
): ResetPasswordState => ({
  values: {
    token,
    newPassword: '',
    confirmPassword: '',
  },
  errors: token ? {} : { token: 'resetPassword.validation.token.required' },
  submitError: null,
  isNewPasswordVisible: false,
  isConfirmPasswordVisible: false,
});

export const resetPasswordReducer = (
  state: ResetPasswordState,
  action: ResetPasswordAction,
): ResetPasswordState => {
  switch (action.type) {
    case 'update_field':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value,
        },
        errors: {
          ...state.errors,
          [action.field]: undefined,
        },
        submitError: null,
      };
    case 'set_errors':
      return {
        ...state,
        errors: action.errors,
      };
    case 'set_submit_error':
      return {
        ...state,
        submitError: action.error,
      };
    case 'toggle_new_password_visibility':
      return {
        ...state,
        isNewPasswordVisible: !state.isNewPasswordVisible,
      };
    case 'toggle_confirm_password_visibility':
      return {
        ...state,
        isConfirmPasswordVisible: !state.isConfirmPasswordVisible,
      };
    default:
      return state;
  }
};
