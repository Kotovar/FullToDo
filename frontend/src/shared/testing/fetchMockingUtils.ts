import { ErrorDetail, ErrorType } from '@shared/api';

export const getFailFetchResponse = (status: number) => {
  return vi.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: false,
    status: status,
  } as Response);
};

export const getErrorMock = (withCause = false) => {
  const error = withCause
    ? new Error('Failed to fetch', { cause: 'Error' })
    : new Error('Failed to fetch');

  return vi.spyOn(global, 'fetch').mockRejectedValue(error);
};

export const getErrorResult = (errorList: Record<ErrorType, ErrorDetail>) => {
  return {
    message: 'Network error',
    cause: errorList.NETWORK_ERROR,
  };
};
