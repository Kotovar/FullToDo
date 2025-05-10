import { handleMutationError } from './handleMutationError';

describe('handleMutationError', () => {
  const cause = {
    type: 'cause_type',
    message: 'cause_message',
  };
  test('Возвращает причину ошибки, если она указана', () => {
    const error = new Error('Error', {
      cause,
    });

    const result = handleMutationError(error);
    expect(result).toEqual(cause);
  });
});
