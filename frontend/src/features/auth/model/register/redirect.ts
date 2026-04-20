export type RegisterRedirectState = {
  registrationCompleted: true;
  registeredEmail: string;
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
  registeredEmail: email,
});

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
  'registeredEmail' in state &&
  state.registrationCompleted === true &&
  typeof state.registeredEmail === 'string';

/**
 * Безопасно извлекает email из `location.state`, переданного после регистрации.
 *
 * @param state Произвольное состояние маршрута из React Router.
 * @returns Email зарегистрированного пользователя или `null`, если state не соответствует ожидаемой структуре.
 */
export const getRegisterRedirectEmail = (state: unknown): string | null => {
  if (isRegisterRedirectState(state)) {
    return state.registeredEmail;
  }

  return null;
};
