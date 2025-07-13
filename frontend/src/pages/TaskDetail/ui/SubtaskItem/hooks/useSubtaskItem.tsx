import { useCallback, useEffect, useRef, useState } from 'react';
import type { Subtask } from '@sharedCommon/*';
import type { SubtaskAction } from '@pages/TaskDetail/lib';

export const useSubtaskItem = (
  subtask: Subtask,
  updateSubtask: (action: SubtaskAction) => void,
) => {
  const { _id, title, isCompleted } = subtask;

  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraftTitle(title);
  }, [title]);

  const onDeleteSubtask = useCallback(
    () => updateSubtask({ type: 'delete', id: _id }),
    [_id, updateSubtask],
  );

  const onEnableEditing = () => {
    setIsEditing(true);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const onSaveTitle = () => {
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

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraftTitle(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSaveTitle();
    } else if (e.key === 'Escape') {
      setDraftTitle(title);
      setIsEditing(false);
    }
  };

  const onToggleStatus = useCallback(() => {
    updateSubtask({
      type: 'update',
      id: _id,
      title,
      isCompleted: !isCompleted,
    });
  }, [_id, isCompleted, title, updateSubtask]);

  return {
    methods: {
      onDeleteSubtask,
      onEnableEditing,
      onSaveTitle,
      onChangeTitle,
      onKeyDown,
      onToggleStatus,
    },
    inputRef,
    isEditing,
    draftTitle,
  };
};
