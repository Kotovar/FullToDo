import { handleMutationError } from './handleMutationError';

const cause = {
  type: 'cause_type',
  message: 'cause_message',
};

describe('handleMutationError', () => {
  test('should return the error reason if specified', () => {
    const error = new Error('Error', {
      cause,
    });

    const result = handleMutationError(error);
    expect(result).toEqual(cause);
  });
});
