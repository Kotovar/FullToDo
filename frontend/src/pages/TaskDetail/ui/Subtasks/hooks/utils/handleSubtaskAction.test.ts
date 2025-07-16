import { handleSubtaskAction } from './handleSubtaskAction';
import { MOCK_SUBTASK, MOCK_SUBTASK_OTHER } from '@shared/mocks';
import type { SubtaskAction } from '@pages/TaskDetail/lib';

const getAction = (
  id = '1',
  type: 'update' | 'delete' = 'update',
): SubtaskAction => {
  return type === 'update'
    ? {
        title: 'test',
        isCompleted: true,
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

  test('if the list of subtasks contains the desired one and the delete method, then return all tasks without the desired one', () => {
    const result = handleSubtaskAction(
      [MOCK_SUBTASK],
      getAction('1', 'delete'),
    );

    expect(result).toStrictEqual([]);
  });

  test('should return the same subtask if the title and status are the same', () => {
    const result = handleSubtaskAction([MOCK_SUBTASK], {
      ...MOCK_SUBTASK,
      id: MOCK_SUBTASK._id,
      type: 'update',
    });

    expect(result).toStrictEqual([MOCK_SUBTASK]);
  });

  test('should return the correct filtering of subtasks', () => {
    const result = handleSubtaskAction(
      [MOCK_SUBTASK, MOCK_SUBTASK_OTHER],
      getAction('2'),
    );

    expect(result).toStrictEqual([
      MOCK_SUBTASK,
      {
        ...MOCK_SUBTASK_OTHER,
        title: 'test',
      },
    ]);
  });
});
