import { useState, useEffect, useMemo } from 'react';
import { Button, COLORS, Icon, Input } from '@shared/ui';
import type { Subtask } from '@sharedCommon/*';
import { debounce } from '@shared/lib/debounce';

interface SubtaskItemProps {
  subtask: Subtask;
  updateSubtask: (id: string, title: string, isCompleted: boolean) => void;
  deleteSubtask: (id: string) => void;
}

export const SubtaskItem = ({
  subtask,
  updateSubtask,
  deleteSubtask,
}: SubtaskItemProps) => {
  const { _id, title, isCompleted } = subtask;

  const [localTitle, setLocalTitle] = useState(title);
  const [localCompleted, setLocalCompleted] = useState(isCompleted);

  const debouncedUpdateSubtask = useMemo(
    () =>
      debounce((id: string, newTitle: string, completed: boolean) => {
        updateSubtask(id, newTitle, completed);
      }, 300),
    [updateSubtask],
  );

  useEffect(() => {
    debouncedUpdateSubtask(_id, localTitle, localCompleted);
  }, [_id, localCompleted, localTitle]);

  const handleToggleCompleted = () => {
    setLocalCompleted(prev => !prev);
  };

  return (
    <li className='odd:bg-bg-second even:bg-grey-light grid grid-cols-[1rem_1fr_1rem] items-center gap-4 p-2'>
      <Button appearance='ghost' onClick={handleToggleCompleted} padding='none'>
        <Icon
          name={localCompleted ? 'circleFilled' : 'circleEmpty'}
          fill={localCompleted ? COLORS.ACCENT : undefined}
          stroke={!localCompleted ? COLORS.ACCENT : undefined}
        />
      </Button>
      <Input
        type='text'
        value={localTitle}
        onChange={e => setLocalTitle(e.target.value)}
        className='w-full outline-0'
      />
      <Button
        appearance='ghost'
        onClick={() => deleteSubtask(_id)}
        padding='none'
      >
        <Icon name='cross' fill={COLORS.ACCENT} />
      </Button>
    </li>
  );
};
