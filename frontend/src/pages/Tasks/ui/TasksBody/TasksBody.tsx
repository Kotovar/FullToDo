import { useTranslation } from 'react-i18next';
import { TaskItem, useTaskBody } from '.';
import { memo } from 'react';

interface TasksBodyProps {
  notepadPathName: string;
  params: URLSearchParams;
  notepadId: string;
}

export const TasksBody = memo(
  ({ notepadPathName, notepadId, params }: TasksBodyProps) => {
    const { t } = useTranslation();

    const {
      tasks = [],
      currentModalId,
      editingTaskId,
      methods,
    } = useTaskBody({
      notepadId,
      params,
    });

    const {
      handleSaveTitle,
      handleModalId,
      renameTask,
      updateTaskStatus,
      deleteTask,
    } = methods;

    if (tasks?.length === 0) {
      return <span className='mt-2 text-center'>{t('common.notFound')}</span>;
    }

    return (
      <ul className='bg-grey-light scrollbar-tasks flex h-full flex-col gap-2 overflow-y-scroll p-1'>
        {tasks.map(task => (
          <TaskItem
            key={task._id}
            task={task}
            notepadPathName={notepadPathName}
            currentModalId={currentModalId}
            editingTaskId={editingTaskId}
            notepadId={notepadId}
            deleteTask={deleteTask}
            updateTaskStatus={updateTaskStatus}
            handleModalId={handleModalId}
            renameTask={renameTask}
            handleSaveTitle={handleSaveTitle}
          />
        ))}
      </ul>
    );
  },
);
