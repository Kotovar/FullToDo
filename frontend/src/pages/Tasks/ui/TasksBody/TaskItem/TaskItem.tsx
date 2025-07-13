import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getPath } from '@pages/Tasks/lib';
import { Button, CompletionIcon, LinkCard } from '@shared/ui';
import type { Task } from 'shared/schemas';

const ACTION_LABELS = {
  complete: 'tasks.actions.complete',
  incomplete: 'tasks.actions.incomplete',
} as const;

const CARD_CLASSES =
  'bg-light grid grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-sm p-4 text-2xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] hover:bg-current/10 has-[a:focus]:ring-2';

interface TaskItemProps {
  task: Task;
  notepadPathName: string;
  notepadId: string;
  currentModalId: string;
  editingTaskId: string | null;
  deleteTask: (id: string) => Promise<boolean>;
  updateTaskStatus: (id: string, status: boolean) => void;
  handleModalId: (id: string) => void;
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
    currentModalId,
    editingTaskId,
    deleteTask,
    updateTaskStatus,
    handleModalId,
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

    const taskProgress = useMemo(
      () =>
        progress ? progress.replace('/', ` ${t('of')} `) : t('tasks.empty'),
      [progress, t],
    );

    const onSaveTitle = useCallback(
      (newTitle: string) => handleSaveTitle(_id, newTitle, title),
      [_id, handleSaveTitle, title],
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
        currentModalId={currentModalId}
        handleModalId={handleModalId}
        path={path}
        handleClickDelete={handleDelete}
        handleClickRename={handleRename}
        isEditing={editingTaskId === _id}
        onSaveTitle={onSaveTitle}
        body={<p className='text-sm'>{taskProgress}</p>}
        className={CARD_CLASSES}
      />
    );
  },
);
