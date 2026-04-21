export const LOGIN_EMAIL_STORAGE_KEY = 'login-email';

export type LoginEmailPrefillState = {
  loginEmail: string;
};

export type RegisterRedirectState = LoginEmailPrefillState & {
  registrationCompleted: true;
};

/**
 * Формирует `location.state` для редиректа на страницу логина
 * после успешной регистрации без автологина.
 *
 * @param email Email, на который было отправлено письмо подтверждения.
 * @returns Состояние маршрута для страницы логина.
 */
export const createRegisterRedirectState = (
  email: string,
): RegisterRedirectState => ({
  registrationCompleted: true,
  loginEmail: email,
});

export const createLoginPrefillState = (
  email: string,
): LoginEmailPrefillState => ({
  loginEmail: email,
});

/**
 * Сохраняет email в `sessionStorage`, чтобы страница логина
 * могла подставить его в поле email после редиректа.
 *
 * Используется как fallback на случай, если `location.state`
 * не будет доступен после навигации.
 *
 * @param email Email для предзаполнения формы логина.
 */
export const persistLoginPrefilledEmail = (email: string): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(LOGIN_EMAIL_STORAGE_KEY, JSON.stringify(email));
};

/**
 * Проверяет, является ли `state` допустимым состоянием редиректа после регистрации.
 *
 * @param state Произвольное состояние маршрута из React Router.
 * @returns `true`, если `state` соответствует ожидаемой структуре `RegisterRedirectState`.
 */
const isRegisterRedirectState = (
  state: unknown,
): state is RegisterRedirectState =>
  typeof state === 'object' &&
  state !== null &&
  'registrationCompleted' in state &&
  'loginEmail' in state &&
  state.registrationCompleted === true &&
  typeof state.loginEmail === 'string';

const hasLoginEmail = (state: unknown): state is LoginEmailPrefillState =>
  typeof state === 'object' &&
  state !== null &&
  'loginEmail' in state &&
  typeof state.loginEmail === 'string';

/**
 * Безопасно извлекает email из `location.state`, переданного после регистрации.
 *
 * @param state Произвольное состояние маршрута из React Router.
 * @returns Email зарегистрированного пользователя или `null`, если state не соответствует ожидаемой структуре.
 */
export const getRegisterRedirectEmail = (state: unknown): string | null => {
  if (isRegisterRedirectState(state)) {
    return state.loginEmail;
  }

  return null;
};

export const getLoginPrefilledEmail = (state: unknown): string | null => {
  if (hasLoginEmail(state)) {
    return state.loginEmail;
  }

  return null;
};
