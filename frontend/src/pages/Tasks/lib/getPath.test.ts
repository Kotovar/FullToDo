import { getPath } from './getPath';

describe('getPath', () => {
  test('getting patch without notepadId', () => {
    const result = getPath('1', '/tasks');
    expect(result).toBe(`/tasks/1`);
  });
});
