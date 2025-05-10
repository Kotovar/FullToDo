import { getSuccessMessage } from './consts';

describe('getSuccessMessage', () => {
  test('Успешно возвращает ответ', () => {
    const result = getSuccessMessage('task', 'update');

    expect(result).toBe('Задача успешно обновлена');
  });
});
