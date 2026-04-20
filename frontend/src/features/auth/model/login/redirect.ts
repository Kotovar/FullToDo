import { ROUTES } from '@sharedCommon';

type LoginRedirectState = {
  from: string;
};

const isLoginRedirectState = (state: unknown): state is LoginRedirectState =>
  typeof state === 'object' &&
  state !== null &&
  'from' in state &&
  typeof state.from === 'string';

export const getLoginRedirectTarget = (state: unknown): string =>
  isLoginRedirectState(state) ? state.from : ROUTES.tasks.base;
