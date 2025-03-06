import { useState } from 'react';
import { TASKS1, TASKS2, TASKS3 } from '@entities/Task';
import { COLORS, Icon, LinkCard } from '@shared/ui';
import { ROUTES } from '@sharedCommon/';

interface TasksBodyProps {
  notepadId?: string;
  notepadPathName: string;
}

export const TasksBody = (props: TasksBodyProps) => {
  const { notepadPathName, notepadId } = props;
  const [currentModalId, setCurrentModalId] = useState('');

  const TASKS_MAP: Record<string, typeof TASKS1> = {
    '1': TASKS1,
    '2': TASKS2,
    '3': TASKS3,
  };

  const handleModalId = (id: string) => {
    setCurrentModalId(id);
  };

  const tasks = TASKS_MAP[notepadId ?? ''] ?? [];

  return (
    <ul className='flex flex-col gap-2 overflow-y-auto bg-white'>
      {tasks.map(({ name, progress, id }) => {
        return (
          <LinkCard
            currentModalId={currentModalId}
            handleModalId={handleModalId}
            className='hover:bg-accent-light grid grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-sm p-4 text-2xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'
            path={ROUTES.getTaskDetailPath(notepadPathName, String(id))}
            cardTitle={name}
            header={
              <div>
                <Icon name='circleEmpty' size={32} stroke={COLORS.ACCENT} />
              </div>
            }
            body={
              <div className='flex flex-col'>
                <span className='text-sm'>{progress}</span>
              </div>
            }
            key={id}
          />
        );
      })}
    </ul>
  );
};
