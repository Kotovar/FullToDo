import * as useTaskHook from '@entities/Task';
import { MOCK_TASK } from '@shared/mocks';

export const getUseTasksMock = (
  isError = false,
  updateTask = vi.fn(),
  deleteTask = vi.fn(),
  tasks = [],
) => {
  vi.spyOn(useTaskHook, 'useTasks').mockReturnValue({
    task: MOCK_TASK,
    tasks,
    isError,
    isLoading: false,
    methods: {
      updateTask,
      deleteTask,
      createTask: vi.fn(),
    },
  });
};
