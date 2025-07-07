import { useCallback, useMemo, useState } from 'react';
import { useTasks } from '@entities/Task';

type useTaskBodyProps = {
  notepadId: string;
  params: URLSearchParams;
};

export const useTaskBody = ({ notepadId, params }: useTaskBodyProps) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [currentModalId, setCurrentModalId] = useState('');
  const {
    tasks,
    methods: { updateTask, deleteTask },
  } = useTasks({
    notepadId,
    params,
    entity: 'tasks',
  });

  const handleSaveTitle = useCallback(
    async (id: string, newTitle: string, currentTitle: string) => {
      if (newTitle !== currentTitle) {
        const success = await updateTask({ title: newTitle }, id);
        if (!success) return currentTitle;
      }
      setEditingTaskId(null);
      return newTitle;
    },
    [updateTask],
  );

  const handleModalId = useCallback((id: string) => {
    setCurrentModalId(id);
  }, []);

  const renameTask = useCallback((id: string) => {
    setEditingTaskId(id);
  }, []);

  const updateTaskStatus = useCallback(
    (id: string, status: boolean) => {
      updateTask({ isCompleted: status }, id);
    },
    [updateTask],
  );

  const methods = useMemo(
    () => ({
      handleSaveTitle,
      handleModalId,
      renameTask,
      updateTaskStatus,
      deleteTask,
    }),
    [handleSaveTitle, handleModalId, renameTask, updateTaskStatus, deleteTask],
  );

  return {
    tasks: tasks,
    currentModalId,
    editingTaskId,
    methods,
  };
};
