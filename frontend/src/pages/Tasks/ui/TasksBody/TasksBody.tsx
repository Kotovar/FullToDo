import { useState } from 'react';
import { Button, COLORS, Icon, LinkCard } from '@shared/ui';
import { ROUTES, Task } from '@sharedCommon/';
import { useMutation, useQuery } from '@tanstack/react-query';
import { taskService } from '@features/Tasks';

interface TasksBodyProps {
  notepadId?: string;
  notepadPathName: string;
}

export const TasksBody = (props: TasksBodyProps) => {
  const { notepadPathName, notepadId = '' } = props;
  const [currentModalId, setCurrentModalId] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const { data, isError, refetch } = useQuery({
    queryKey: ['tasks', notepadId],
    queryFn: () => taskService.getTasksFromNotepad(notepadId),
    select: data => data.data ?? null,
    enabled: !!notepadId,
  });

  const mutationUpdate = useMutation({
    mutationFn: ({
      updatedTask,
      id,
    }: {
      updatedTask: Partial<Task>;
      id: string;
    }) => taskService.updateTask(notepadId, id, updatedTask),
    onSuccess: () => refetch(),
  });

  const mutationDelete = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(notepadId, id),
    onSuccess: () => refetch(),
  });

  if (isError) {
    return <div>Error fetching data</div>;
  }

  const handleModalId = (id: string) => {
    setCurrentModalId(id);
  };

  const updateTask = (updatedTask: Partial<Task>, id: string) => {
    mutationUpdate.mutate({ updatedTask, id });
  };

  const deleteTask = (id: string) => {
    mutationDelete.mutate(id);
  };

  const renameTask = (id: string) => {
    setEditingTaskId(id);
  };

  const updateTaskStatus = (id: string, status: boolean) => {
    updateTask(
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
      updateTask({ title: newTitle }, id);
    }
    setEditingTaskId(null);
  };

  return (
    <>
      {data && !!data.length && (
        <ul className='bg-grey-light my-scroll scrollbar-custom flex flex-col gap-2 overflow-y-auto p-1'>
          {data.map(({ title, progress, isCompleted, _id }) => {
            return (
              <LinkCard
                header={
                  <Button
                    appearance='ghost'
                    onClick={() => updateTaskStatus(_id, isCompleted)}
                    padding='none'
                  >
                    <Icon
                      name={isCompleted ? 'circleFilled' : 'circleEmpty'}
                      fill={isCompleted ? COLORS.ACCENT : undefined}
                      stroke={!isCompleted ? COLORS.ACCENT : undefined}
                    />
                  </Button>
                }
                cardTitle={title}
                currentModalId={currentModalId}
                handleModalId={handleModalId}
                path={ROUTES.getTaskDetailPath(notepadPathName, String(_id))}
                handleClickDelete={() => deleteTask(_id)}
                handleClickRename={() => renameTask(_id)}
                isEditing={editingTaskId === _id}
                onSaveTitle={newTitle => handleSaveTitle(_id, newTitle, title)}
                body={
                  <div className='flex flex-col'>
                    <span className='text-sm'>{progress}</span>
                  </div>
                }
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
