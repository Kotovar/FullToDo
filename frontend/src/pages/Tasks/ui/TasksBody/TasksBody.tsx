import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTasks } from '@entities/Task';
import { useNotifications } from '@shared/lib/notifications';
import { getSuccessMessage } from '@shared/api';
import { TaskItem } from './TaskItem';

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
  const { tasks, methods } = useTasks({
    notepadId,
    params,
    onSuccess: method => showSuccess(getSuccessMessage('tasks', method)),
    onError: error => showError(error.message),
  });
  const { t } = useTranslation();

  const handleModalId = useCallback((id: string) => {
    setCurrentModalId(id);
  }, []);

  const renameTask = useCallback((id: string) => {
    setEditingTaskId(id);
  }, []);

  const updateTaskStatus = (id: string, status: boolean) => {
    methods.updateTask(
      {
        isCompleted: !status,
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
    <ul className='bg-grey-light my-scroll scrollbar-custom flex flex-col gap-2 overflow-y-auto p-1'>
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
