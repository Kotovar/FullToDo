import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getPath } from '@pages/Tasks/lib';
import { Button, CompletionIcon, LinkCard } from '@shared/ui';
import type { Task } from 'shared/schemas';

const ACTION_LABELS = {
  complete: 'tasks.actions.complete',
  incomplete: 'tasks.actions.incomplete',
} as const;

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

    return (
      <LinkCard
        header={
          <Button
            appearance='ghost'
            onClick={handleStatusChange}
            padding='none'
            aria-label={t(
              isCompleted ? ACTION_LABELS.incomplete : ACTION_LABELS.complete,
            )}
          >
            <CompletionIcon completed={isCompleted} />
          </Button>
        }
        cardTitle={title}
        currentModalId={currentModalId}
        handleModalId={handleModalId}
        path={path}
        handleClickDelete={handleDelete}
        handleClickRename={handleRename}
        isEditing={editingTaskId === _id}
        onSaveTitle={newTitle => handleSaveTitle(_id, newTitle, title)}
        body={
          <p className='text-sm'>{progress.replace('/', ` ${t('of')} `)}</p>
        }
        className='bg-light grid grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-sm p-4 text-2xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] last:mb-10 hover:bg-current/10'
      />
    );
  },
);
