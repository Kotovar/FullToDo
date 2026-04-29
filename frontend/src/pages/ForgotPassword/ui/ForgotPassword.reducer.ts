import type { ForgotPassword as ForgotPasswordPayload } from '@sharedCommon';
import type { Translation } from '@shared/i18n';

export type ForgotPasswordErrors = Partial<
  Record<keyof ForgotPasswordPayload, Translation>
>;

export type ForgotPasswordState = {
  values: ForgotPasswordPayload;
  errors: ForgotPasswordErrors;
  submitError: Translation | null;
  isSubmitted: boolean;
  isPending: boolean;
};

export type ForgotPasswordAction =
  | { type: 'change_email'; value: string }
  | { type: 'set_errors'; errors: ForgotPasswordErrors }
  | { type: 'submit_start' }
  | { type: 'submit_success' }
  | { type: 'submit_error'; error: Translation };

export const initialForgotPasswordState: ForgotPasswordState = {
  values: { email: '' },
  errors: {},
  submitError: null,
  isSubmitted: false,
  isPending: false,
};

export const forgotPasswordReducer = (
  state: ForgotPasswordState,
  action: ForgotPasswordAction,
): ForgotPasswordState => {
  switch (action.type) {
    case 'change_email':
      return {
        ...state,
        values: { email: action.value },
        errors: {},
        submitError: null,
        isSubmitted: false,
      };
    case 'set_errors':
      return {
        ...state,
        errors: action.errors,
      };
    case 'submit_start':
      return {
        ...state,
        isPending: true,
      };
    case 'submit_success':
      return {
        ...state,
        submitError: null,
        isSubmitted: true,
        isPending: false,
      };
    case 'submit_error':
      return {
        ...state,
        submitError: action.error,
        isPending: false,
      };
    default:
      return state;
  }
};
