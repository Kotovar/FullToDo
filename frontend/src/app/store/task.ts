import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface TaskState {
  task: number;
  increase: () => void;
}

export const useTaskStore = create<TaskState>()(
  devtools(set => ({
    task: 0,
    increase: () =>
      set(state => ({ task: state.task + 1 }), undefined, 'task/addTask'),
  })),
);
