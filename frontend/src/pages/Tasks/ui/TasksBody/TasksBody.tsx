import { useState } from 'react';
import { Button, LinkCard, CompletionIcon } from '@shared/ui';
import { useTasks } from '@entities/Task';
import { useNotifications } from '@shared/lib/notifications';
import { getSuccessMessage } from '@shared/api';
import { getPatch } from '@pages/Tasks/lib';

export interface TasksBodyProps {
  notepadPathName: string;
  params: URLSearchParams;
  notepadId: string;
}

export const TasksBody = (props: TasksBodyProps) => {
  const { notepadPathName, notepadId, params } = props;
  const [currentModalId, setCurrentModalId] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const { showSuccess, showError } = useNotifications();
  const { tasks, methods } = useTasks({
    notepadId,
    params,
    onSuccess: method => showSuccess(getSuccessMessage('tasks', method)),
    onError: error => showError(error.message),
  });

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

  return (
    <>
      {tasks && (
        <ul className='bg-grey-light my-scroll scrollbar-custom flex flex-col gap-2 overflow-y-auto p-1'>
          {tasks.map(({ title, progress, isCompleted, _id }) => {
            const path = getPatch(_id, notepadPathName, notepadId);

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
                path={path}
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
