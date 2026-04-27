let accessToken: string | null = null;

/** Возвращает текущий access token из in-memory хранилища. */
export const getAccessToken = () => accessToken;

/** Сохраняет новый access token в in-memory хранилище. */
export const setAccessToken = (token: string) => {
  accessToken = token;
};

/** Очищает access token в in-memory хранилище. */
export const clearAccessToken = () => {
  accessToken = null;
};
