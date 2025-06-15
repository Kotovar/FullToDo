import { useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Input, CompletionIcon } from '@shared/ui';
import { useDarkMode } from '@shared/lib';
import type { Subtask } from '@sharedCommon/*';
import type { SubtaskAction } from '../Subtasks/types';

interface SubtaskItemProps {
  subtask: Subtask;
  updateSubtask: (action: SubtaskAction) => void;
}

export const SubtaskItem = memo(function SubtaskItem({
  subtask,
  updateSubtask,
}: SubtaskItemProps) {
  const { _id, title, isCompleted } = subtask;

  const [draftTitle, setDraftTitle] = useState(title);
  const { fill } = useDarkMode();

  useEffect(() => {
    setDraftTitle(title);
  }, [title]);

  const { t } = useTranslation();

  const handleToggleCompleted = () => {
    updateSubtask({
      type: 'update',
      id: _id,
      title,
      isCompleted: !isCompleted,
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraftTitle(e.target.value);
  };

  const saveTitle = () => {
    if (draftTitle !== title) {
      updateSubtask({
        type: 'update',
        id: _id,
        title: draftTitle,
        isCompleted,
      });
    }
  };

  return (
    <li className='odd:bg-bg-second even:bg-grey-light grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md p-2'>
      <Button
        appearance='ghost'
        onClick={handleToggleCompleted}
        padding='none'
        aria-label={
          isCompleted
            ? t('tasks.actions.incomplete')
            : t('tasks.actions.complete')
        }
      >
        <CompletionIcon completed={isCompleted} />
      </Button>
      <Input
        type='text'
        value={draftTitle}
        onChange={handleTitleChange}
        onBlur={saveTitle}
        className='w-full outline-0'
        name={_id}
      />
      <Button
        appearance='ghost'
        onClick={() => updateSubtask({ type: 'delete', id: _id })}
        padding='none'
        aria-label={t('tasks.deleteSubtask')}
      >
        <Icon name='cross' fill={fill} />
      </Button>
    </li>
  );
});
