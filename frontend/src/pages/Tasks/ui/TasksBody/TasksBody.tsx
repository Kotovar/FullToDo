import { useState } from 'react';
import { COLORS, Icon, LinkCard } from '@shared/ui';
import { ROUTES } from '@sharedCommon/';
import { useQuery } from '@tanstack/react-query';
import { taskService } from '@features/Tasks';

interface TasksBodyProps {
  notepadId?: string;
  notepadPathName: string;
}

export const TasksBody = (props: TasksBodyProps) => {
  const { notepadPathName, notepadId = '' } = props;
  const [currentModalId, setCurrentModalId] = useState('');

  const { data, isError } = useQuery({
    queryKey: ['tasks', notepadId],
    queryFn: () => taskService.getTasksFromNotepad(notepadId),
    select: data => data.data ?? null,
    enabled: !!notepadId,
  });

  if (isError) {
    return <div>Error fetching data</div>;
  }

  const handleModalId = (id: string) => {
    setCurrentModalId(id);
  };

  return (
    <>
      {data && !!data.length && (
        <ul className='bg-grey-light my-scroll scrollbar-custom flex flex-col gap-2 overflow-y-auto p-1'>
          {data.map(({ title, progress, isCompleted, _id }) => {
            return (
              <LinkCard
                currentModalId={currentModalId}
                handleModalId={handleModalId}
                className='hover:bg-accent-light grid grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-sm bg-white p-4 text-2xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] last:mb-8'
                path={ROUTES.getTaskDetailPath(notepadPathName, String(_id))}
                cardTitle={title}
                header={
                  <div>
                    {isCompleted ? (
                      <Icon name='circleFilled' fill={COLORS.ACCENT} />
                    ) : (
                      <Icon name='circleEmpty' stroke={COLORS.ACCENT} />
                    )}
                  </div>
                }
                body={
                  <div className='flex flex-col'>
                    <span className='text-sm'>{progress}</span>
                  </div>
                }
                key={_id}
              />
            );
          })}
        </ul>
      )}
    </>
  );
};
