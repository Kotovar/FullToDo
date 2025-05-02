import { useState } from 'react';
import { Button, LinkCard } from '@shared/ui';
import { ROUTES } from '@sharedCommon/';
import { useTasks } from '@entities/Task';
import { CompletionIcon } from '@shared/ui/CompletionIcon';

interface TasksBodyProps {
  notepadId?: string;
  notepadPathName: string;
}

export const TasksBody = (props: TasksBodyProps) => {
  const { notepadPathName, notepadId } = props;
  const [currentModalId, setCurrentModalId] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const { tasks, isError, methods } = useTasks(notepadId);

  if (isError) {
    return <div>Error fetching data</div>;
  }

  const handleModalId = (id: string) => {
    setCurrentModalId(id);
  };

  const renameTask = (id: string) => {
    setEditingTaskId(id);
  };

  const updateTaskStatus = (id: string, status: boolean) => {
    methods.updateTask(
      {
        isCompleted: !status,
      },
      id,
    );
  };

  const handleSaveTitle = (
    id: string,
    newTitle: string,
    currentTitle: string,
  ) => {
    if (newTitle !== currentTitle) {
      methods.updateTask({ title: newTitle }, id);
    }

    setEditingTaskId(null);
  };

  return (
    <>
      {tasks && (
        <ul className='bg-grey-light my-scroll scrollbar-custom flex flex-col gap-2 overflow-y-auto p-1'>
          {tasks.map(({ title, progress, isCompleted, _id }) => {
            return (
              <LinkCard
                header={
                  <Button
                    appearance='ghost'
                    onClick={() => updateTaskStatus(_id, isCompleted)}
                    padding='none'
                    aria-label={
                      isCompleted
                        ? 'Снять отметку о выполнении'
                        : 'Отметить выполненной'
                    }
                  >
                    <CompletionIcon completed={isCompleted} />
                  </Button>
                }
                cardTitle={title}
                currentModalId={currentModalId}
                handleModalId={handleModalId}
                path={ROUTES.getTaskDetailPath(notepadPathName, String(_id))}
                handleClickDelete={() => methods.deleteTask(_id)}
                handleClickRename={() => renameTask(_id)}
                isEditing={editingTaskId === _id}
                onSaveTitle={newTitle => handleSaveTitle(_id, newTitle, title)}
                body={<p className='text-sm'>{progress}</p>}
                className='hover:bg-accent-light grid grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-sm bg-white p-4 text-2xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] last:mb-10'
                key={_id}
              />
            );
          })}
        </ul>
      )}
    </>
  );
};
