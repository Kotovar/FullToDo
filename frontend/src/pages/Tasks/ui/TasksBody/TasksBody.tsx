import { useState } from 'react';
import { COLORS, Icon, LinkCard } from '@shared/ui';
import { ROUTES } from '@sharedCommon/';
import { useQuery } from '@tanstack/react-query';
import { fetchTasksFromNotepad } from '@entities/Task/api';

interface TasksBodyProps {
  notepadId?: string;
  notepadPathName: string;
}

export const TasksBody = (props: TasksBodyProps) => {
  const { notepadPathName, notepadId = '' } = props;
  const [currentModalId, setCurrentModalId] = useState('');

  const { data, isError } = useQuery({
    queryKey: ['tasks', notepadId],
    queryFn: () => fetchTasksFromNotepad(notepadId),
  });

  if (isError) {
    return <div>Error fetching data</div>;
  }

  const tasksDate = data?.data ?? [];

  const handleModalId = (id: string) => {
    setCurrentModalId(id);
  };

  return (
    <ul className='flex flex-col gap-2 overflow-y-auto bg-white'>
      {tasksDate.map(({ title, _id }) => {
        return (
          <LinkCard
            currentModalId={currentModalId}
            handleModalId={handleModalId}
            className='hover:bg-accent-light grid grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-sm p-4 text-2xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'
            path={ROUTES.getTaskDetailPath(notepadPathName, String(_id))}
            cardTitle={title}
            header={
              <div>
                <Icon name='circleEmpty' size={32} stroke={COLORS.ACCENT} />
              </div>
            }
            body={
              <div className='flex flex-col'>
                <span className='text-sm'>{'1 из 5'}</span>
              </div>
            }
            key={_id}
          />
        );
      })}
    </ul>
  );
};
