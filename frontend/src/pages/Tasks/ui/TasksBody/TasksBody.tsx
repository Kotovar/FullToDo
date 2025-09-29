import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import { TaskItem, useTaskBody } from '.';

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
      hasNextPage,
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
      fetchNextPage,
    } = methods;

    if (tasks?.length === 0) {
      return <span className='mt-2 text-center'>{t('common.notFound')}</span>;
    }

    return (
      <Virtuoso
        className='bg-grey-light scrollbar-tasks h-full'
        data={tasks}
        endReached={() => hasNextPage && fetchNextPage()}
        components={{
          Item: ({ children, ...props }) => (
            <div {...props} className='mb-2 px-1 last:mb-0'>
              {children}
            </div>
          ),
          Footer: () => <div className='h-4' />,
        }}
        itemContent={(_, task) => (
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
        )}
      />
    );
  },
);
