import { getDateUpdate } from './getDateUpdate';

describe('getDateUpdate method', () => {
  test('should return null if newDate is empty', () => {
    const date = getDateUpdate(new Date(), '');

    expect(date).toBeNull();
  });

  test('should return undefined if taskDate isn`t exist', () => {
    const date = getDateUpdate(null, '');

    expect(date).toBeUndefined();
  });

  test('should return formattedDate if taskDate is exist', () => {
    const date = getDateUpdate(null, '2025-12-30T17:00:00.000Z');

    expect(date).toStrictEqual(new Date('2025-12-30T17:00:00.000Z'));
  });
});
