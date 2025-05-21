import { MOCK_TASK } from '@shared/mocks';
import * as useTaskHook from '@entities/Task';

export const getUseTaskDetailsMock = (
  isError = false,
  updateTask = vi.fn(),
  isLoading = false,
  task = MOCK_TASK,
) => {
  vi.spyOn(useTaskHook, 'useTaskDetail').mockReturnValue({
    task,
    isError,
    isLoading,
    updateTask,
  });
};
