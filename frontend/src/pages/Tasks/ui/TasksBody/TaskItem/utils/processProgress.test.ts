import { processProgress } from './processProgress';
import { t } from 'i18next';

vi.mock('i18next', () => ({
  t: vi.fn(key => {
    const translations: Record<string, string> = {
      of: 'of',
      'tasks.empty': 'No subtasks',
    };
    return translations[key] ?? key;
  }),
}));

describe('processProgress', () => {
  test('should update progress', () => {
    const result = processProgress('10/20');

    expect(result).toBe('10 of 20');
    expect(t).toHaveBeenCalledWith('of');
  });

  test('should display empty message', () => {
    const result = processProgress();

    expect(result).toBe('No subtasks');
    expect(t).toHaveBeenCalledWith('tasks.empty');
  });
});
