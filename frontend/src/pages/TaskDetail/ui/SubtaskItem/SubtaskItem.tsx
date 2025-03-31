import { useState, useEffect, useRef, memo } from 'react';
import { Button, COLORS, Icon, Input } from '@shared/ui';
import type { Subtask } from '@sharedCommon/*';
import { SubtaskAction } from '../Subtasks/types';

interface SubtaskItemProps {
  subtask: Subtask;
  updateSubtask: (action: SubtaskAction) => void;
}

export const SubtaskItem = memo(function SubtaskItem({
  subtask,
  updateSubtask,
}: SubtaskItemProps) {
  const { _id, title, isCompleted } = subtask;

  const [localTitle, setLocalTitle] = useState(title);
  const [localCompleted, setLocalCompleted] = useState(isCompleted);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    updateSubtask({
      type: 'update',
      id: _id,
      title: localTitle,
      isCompleted: localCompleted,
    });
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
        onClick={() => updateSubtask({ type: 'delete', id: _id })}
        padding='none'
      >
        <Icon name='cross' fill={COLORS.ACCENT} />
      </Button>
    </li>
  );
});
