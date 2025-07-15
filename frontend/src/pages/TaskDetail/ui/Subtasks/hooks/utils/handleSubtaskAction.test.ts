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
  test('if the subtask list does not contain the one you are looking for, then return all tasks', () => {
    const result = handleSubtaskAction([MOCK_SUBTASK], getAction('2'));

    expect(result).toStrictEqual([MOCK_SUBTASK]);
  });

  test('if the list of subtasks contains the desired one and the update method, then return all tasks with the updated task', () => {
    const result = handleSubtaskAction([MOCK_SUBTASK], getAction());

    expect(result).toStrictEqual([{ ...MOCK_SUBTASK, title: 'test' }]);
  });

  test('if the list of subtasks contains the desired one and the delete method, then return all tasks without the desired one', () => {
    const result = handleSubtaskAction(
      [MOCK_SUBTASK],
      getAction('1', 'delete'),
    );

    expect(result).toStrictEqual([]);
  });
});
