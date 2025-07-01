import { useState, memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Input, CompletionIcon } from '@shared/ui';
import { useDarkMode } from '@shared/lib';
import type { Subtask } from '@sharedCommon/*';
import type { SubtaskAction } from '../Subtasks/types';

interface SubtaskItemProps {
  subtask: Subtask;
  updateSubtask: (action: SubtaskAction) => void;
}
const areEqual = (prev: SubtaskItemProps, next: SubtaskItemProps) =>
  prev.subtask._id === next.subtask._id &&
  prev.subtask.title === next.subtask.title &&
  prev.subtask.isCompleted === next.subtask.isCompleted;

export const SubtaskItem = memo(function SubtaskItem({
  subtask,
  updateSubtask,
}: SubtaskItemProps) {
  const { _id, title, isCompleted } = subtask;
  const [draftTitle, setDraftTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { fill } = useDarkMode();
  const { t } = useTranslation();

  useEffect(() => {
    setDraftTitle(title);
  }, [title]);

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

  const handleSaveTitle = () => {
    setIsEditing(false);
    if (draftTitle !== title) {
      updateSubtask({
        type: 'update',
        id: _id,
        title: draftTitle,
        isCompleted,
      });
    }
  };

  const handleClick = () => {
    setIsEditing(true);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setDraftTitle(title);
      setIsEditing(false);
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

      {isEditing ? (
        <Input
          ref={inputRef}
          type='text'
          value={draftTitle}
          onChange={handleTitleChange}
          onBlur={handleSaveTitle}
          onKeyDown={handleKeyDown}
          className='w-full outline-0'
          autoFocus
        />
      ) : (
        <span onClick={handleClick} className='w-full'>
          {draftTitle}
        </span>
      )}

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
}, areEqual);
