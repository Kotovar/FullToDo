import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getPath } from '@pages/Tasks/lib';
import { Button, CompletionIcon, LinkCard } from '@shared/ui';
import { ACTION_LABELS, CARD_CLASSES, processProgress } from './utils';
import type { Task } from 'shared/schemas';

interface TaskItemProps {
  task: Task;
  notepadPathName: string;
  notepadId: string;
  editingTaskId: string | null;
  deleteTask: (id: string) => Promise<boolean>;
  updateTaskStatus: (id: string, status: boolean) => void;
  renameTask: (id: string) => void;
  handleSaveTitle: (
    id: string,
    newTitle: string,
    currentTitle: string,
  ) => Promise<string>;
}

export const TaskItem = memo(
  ({
    task,
    notepadPathName,
    notepadId,
    editingTaskId,
    deleteTask,
    updateTaskStatus,
    renameTask,
    handleSaveTitle,
  }: TaskItemProps) => {
    const { t } = useTranslation();

    const { title, progress, isCompleted, _id } = task;
    const path = getPath(_id, notepadPathName, notepadId);

    const handleStatusChange = useCallback(() => {
      updateTaskStatus(_id, !isCompleted);
    }, [_id, isCompleted, updateTaskStatus]);

    const handleDelete = useCallback(() => {
      deleteTask(_id);
    }, [_id, deleteTask]);

    const handleRename = useCallback(() => {
      renameTask(_id);
    }, [_id, renameTask]);

    const taskProgress = processProgress(progress);

    const onSaveTitle = useCallback(
      (newTitle: string) => handleSaveTitle(_id, newTitle, title),
      [_id, handleSaveTitle, title],
    );

    const body = useMemo(
      () => <p className='text-sm'>{taskProgress}</p>,
      [taskProgress],
    );

    const header = useMemo(() => {
      return (
        <Button
          appearance='ghost'
          onClick={handleStatusChange}
          aria-label={t(
            isCompleted ? ACTION_LABELS.incomplete : ACTION_LABELS.complete,
          )}
          className='focus-visible:ring-dark h-8 w-8 place-items-center focus:outline-none focus-visible:ring-2'
        >
          <CompletionIcon completed={isCompleted} />
        </Button>
      );
    }, [handleStatusChange, isCompleted, t]);

    return (
      <LinkCard
        header={header}
        cardTitle={title}
        path={path}
        handleClickDelete={handleDelete}
        handleClickRename={handleRename}
        isEditing={editingTaskId === _id}
        onSaveTitle={onSaveTitle}
        body={body}
        className={CARD_CLASSES}
      />
    );
  },
);
