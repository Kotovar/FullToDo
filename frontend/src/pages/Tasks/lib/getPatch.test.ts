import { getPatch } from './getPatch';

describe('getPatch', () => {
  test('getting patch without notepadId', () => {
    const result = getPatch('1', '/tasks');
    expect(result).toBe(`/tasks/1`);
  });
});
