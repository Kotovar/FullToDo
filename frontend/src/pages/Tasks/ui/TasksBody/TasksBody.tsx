import { memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { TaskItem, useTaskBody } from '.';
import { ScrollToTopButton } from './ScrollToTopButton';
import { useScrollToTopButton } from './useScrollToTopButton';

interface TasksBodyProps {
  notepadPathName: string;
  params: URLSearchParams;
  notepadId: string;
}

const VirtuosoComponent = () => <div className='h-1' />;

export const TasksBody = memo(
  ({ notepadPathName, notepadId, params }: TasksBodyProps) => {
    const { t } = useTranslation();
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const { isVisible, handleRangeChanged, handleScrollToTop } =
      useScrollToTopButton(virtuosoRef);

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
      <div className='relative h-full'>
        <Virtuoso
          ref={virtuosoRef}
          className='bg-grey-light scrollbar-tasks h-full'
          data={tasks}
          endReached={() => hasNextPage && fetchNextPage()}
          rangeChanged={handleRangeChanged}
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
        <ScrollToTopButton isVisible={isVisible} onClick={handleScrollToTop} />
      </div>
    );
  },
);
