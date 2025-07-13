import { handleSubtaskAction } from './handleSubtaskAction';
import { MOCK_SUBTASK } from '@shared/mocks';
import type { SubtaskAction } from '@pages/TaskDetail/lib';

const getAction = (
  id = '1',
  type: 'update' | 'delete' = 'update',
): SubtaskAction => {
  return type === 'update'
    ? {
        title: 'test',
        isCompleted: false,
        type,
        id,
      }
    : { type, id };
};

describe('handleSubtaskAction method', () => {
  test('если в списке подзадач нет искомой, то вернуть все задачи', () => {
    const result = handleSubtaskAction([MOCK_SUBTASK], getAction('2'));

    expect(result).toStrictEqual([MOCK_SUBTASK]);
  });

  test('если в списке подзадач есть искомая и метод update, то вернуть все задачи с обновлённой задачей', () => {
    const result = handleSubtaskAction([MOCK_SUBTASK], getAction());

    expect(result).toStrictEqual([{ ...MOCK_SUBTASK, title: 'test' }]);
  });

  test('если в списке подзадач есть искомая и метод delete, то вернуть все задачи без искомой', () => {
    const result = handleSubtaskAction(
      [MOCK_SUBTASK],
      getAction('1', 'delete'),
    );

    expect(result).toStrictEqual([]);
  });
});
