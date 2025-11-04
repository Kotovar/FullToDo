import { memo } from 'react';

import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import { TaskItem, useTaskBody } from '.';

interface TasksBodyProps {
  notepadPathName: string;
  params: URLSearchParams;
  notepadId: string;
}

const VirtuosoComponent = () => <div className='h-1' />;

export const TasksBody = memo(
  ({ notepadPathName, notepadId, params }: TasksBodyProps) => {
    const { t } = useTranslation();

    const {
      tasks = [],
      editingTaskId,
      methods,
      hasNextPage,
    } = useTaskBody({
      notepadId,
      params,
    });

    const {
      handleSaveTitle,
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
            <div {...props} className='mb-2 cursor-pointer px-1 last:mb-0'>
              {children}
            </div>
          ),
          Header: VirtuosoComponent,
          Footer: VirtuosoComponent,
        }}
        itemContent={(_, task) => (
          <TaskItem
            key={task._id}
            task={task}
            notepadPathName={notepadPathName}
            editingTaskId={editingTaskId}
            notepadId={notepadId}
            deleteTask={deleteTask}
            updateTaskStatus={updateTaskStatus}
            renameTask={renameTask}
            handleSaveTitle={handleSaveTitle}
          />
        )}
      />
    );
  },
);
