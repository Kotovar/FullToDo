import { getFormattedDate } from './getFormattedDate';

describe('getFormattedDate method', () => {
  test('should be formatted correctly the date', () => {
    const date = new Date('2024-04-23T09:34:56.789Z');

    const formattedDate = getFormattedDate(date);

    expect(formattedDate).toBe('2024-04-23');
  });
});
