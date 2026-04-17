import type { ErrorDetail } from '@shared/api';

/** Возвращает mock fetch с неуспешным HTTP-ответом и указанным статусом. */
export const getFailFetchResponse = (status: number) => {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
    ok: false,
    status: status,
  } as Response);
};

/** Возвращает mock fetch с сетевой ошибкой, при необходимости с заполненным cause. */
export const getErrorMock = (withCause = false) => {
  const error = withCause
    ? new Error('Failed to fetch', { cause: 'Error' })
    : new Error('Failed to fetch');

  return vi.spyOn(globalThis, 'fetch').mockRejectedValue(error);
};

/** Возвращает ожидаемую структуру network error для тестовых проверок. */
export const getErrorResult = (errorList: { NETWORK_ERROR: ErrorDetail }) => {
  return {
    message: 'Network error',
    cause: errorList.NETWORK_ERROR,
  };
};
