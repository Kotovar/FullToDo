import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTasks } from '@entities/Task';
import { useNotifications } from '@shared/lib/notifications';
import { useAutoScrollToNewItem, useSuccessMessage } from '@shared/lib';
import { TaskItem } from '.';

interface TasksBodyProps {
  notepadPathName: string;
  params: URLSearchParams;
  notepadId: string;
}

export const TasksBody = ({
  notepadPathName,
  notepadId,
  params,
}: TasksBodyProps) => {
  const [currentModalId, setCurrentModalId] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const { showSuccess, showError } = useNotifications();
  const getSuccessMessage = useSuccessMessage();
  const { t } = useTranslation();
  const { tasks, methods } = useTasks({
    notepadId,
    params,
    onSuccess: method => showSuccess(getSuccessMessage('tasks', method)),
    onError: error => showError(t(error.message)),
  });
  const listRef = useAutoScrollToNewItem<HTMLUListElement>(notepadId, tasks);

  const handleModalId = useCallback((id: string) => {
    setCurrentModalId(id);
  }, []);

  const renameTask = useCallback((id: string) => {
    setEditingTaskId(id);
  }, []);

  const updateTaskStatus = (id: string, status: boolean) => {
    methods.updateTask(
      {
        isCompleted: status,
      },
      id,
    );
  };

  const handleSaveTitle = async (
    id: string,
    newTitle: string,
    currentTitle: string,
  ) => {
    if (newTitle !== currentTitle) {
      const success = await methods.updateTask({ title: newTitle }, id);

      if (!success) {
        return currentTitle;
      }
    }
    setEditingTaskId(null);
    return newTitle;
  };

  if (tasks?.length === 0) {
    return <span className='mt-2 text-center'>{t('common.notFound')}</span>;
  }

  return (
    <ul
      ref={listRef}
      className='bg-grey-light scrollbar-tasks flex h-full flex-col gap-2 overflow-y-scroll p-1'
    >
      {tasks?.map(task => (
        <TaskItem
          key={task._id}
          task={task}
          notepadPathName={notepadPathName}
          currentModalId={currentModalId}
          editingTaskId={editingTaskId}
          notepadId={notepadId}
          deleteTask={methods.deleteTask}
          updateTaskStatus={updateTaskStatus}
          handleModalId={handleModalId}
          renameTask={renameTask}
          handleSaveTitle={handleSaveTitle}
        />
      ))}
    </ul>
  );
};
