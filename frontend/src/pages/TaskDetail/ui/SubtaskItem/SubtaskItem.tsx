import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Input, CompletionIcon } from '@shared/ui';
import { useDarkMode } from '@shared/lib';
import { useSubtaskItem } from './hooks';
import type { Subtask } from '@sharedCommon/*';
import type { SubtaskAction } from '@pages/TaskDetail/lib';

interface SubtaskItemProps {
  subtask: Subtask;
  updateSubtask: (action: SubtaskAction) => void;
}

export const SubtaskItem = memo(
  ({ subtask, updateSubtask }: SubtaskItemProps) => {
    const { isCompleted } = subtask;
    const { fill } = useDarkMode();
    const { t } = useTranslation();

    const { methods, inputRef, isEditing, draftTitle } = useSubtaskItem(
      subtask,
      updateSubtask,
    );

    const {
      onDeleteSubtask,
      onEnableEditing,
      onSaveTitle,
      onChangeTitle,
      onKeyDown,
      onToggleStatus,
    } = methods;

    const completionIcon = useMemo(
      () => <CompletionIcon completed={isCompleted} />,
      [isCompleted],
    );

    const deleteIcon = useMemo(() => <Icon name='cross' fill={fill} />, [fill]);

    const completionLabel = useMemo(
      () => t(`tasks.actions.${isCompleted ? 'incomplete' : 'complete'}`),
      [isCompleted, t],
    );

    return (
      <li className='odd:bg-bg-second even:bg-grey-light grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md p-2'>
        <Button
          appearance='ghost'
          onClick={onToggleStatus}
          aria-label={completionLabel}
        >
          {completionIcon}
        </Button>

        {isEditing ? (
          <Input
            ref={inputRef}
            type='text'
            value={draftTitle}
            onChange={onChangeTitle}
            onBlur={onSaveTitle}
            onKeyDown={onKeyDown}
            className='w-full outline-0'
          />
        ) : (
          <span onClick={onEnableEditing} className='w-full'>
            {draftTitle}
          </span>
        )}

        <Button
          appearance='ghost'
          onClick={onDeleteSubtask}
          aria-label={t('tasks.deleteSubtask')}
        >
          {deleteIcon}
        </Button>
      </li>
    );
  },
);
