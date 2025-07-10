import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNotepads } from '../../lib';

export const useNavigationBar = () => {
  const [title, setTitle] = useState('');
  const [editingNotepadId, setEditingNotepadId] = useState<string | null>(null);
  const titleRef = useRef(title);
  const { notepads, isError, isLoading, methods } = useNotepads();

  const { createNotepad, updateNotepadTitle, deleteNotepad } = methods;

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  const handleCreateNotepad = useCallback(async () => {
    if (titleRef.current) {
      await createNotepad(titleRef.current);
      setTitle('');
    }
  }, [createNotepad]);

  const onChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleCreateNotepad();
    },
    [handleCreateNotepad],
  );

  const handleSaveTitle = useCallback(
    async (id: string, newTitle: string, currentTitle: string) => {
      if (newTitle !== currentTitle) {
        const success = await updateNotepadTitle(id, newTitle);
        if (!success) return currentTitle;
      }
      setEditingNotepadId(null);
      return newTitle;
    },
    [updateNotepadTitle],
  );

  const handleDeleteNotepad = useCallback(
    (id: string) => deleteNotepad(id),
    [deleteNotepad],
  );

  const actions = useMemo(() => {
    return {
      create: {
        onClick: handleCreateNotepad,
        onChange: onChangeTitle,
        onKeyDown: handleKeyDown,
      },
      edit: {
        saveTitle: handleSaveTitle,
        setId: setEditingNotepadId,
      },
      delete: {
        onClick: handleDeleteNotepad,
      },
    };
  }, [
    handleCreateNotepad,
    handleDeleteNotepad,
    handleKeyDown,
    handleSaveTitle,
    onChangeTitle,
  ]);

  return {
    state: {
      notepads,
      isLoading: isLoading || isError,
      title,
      editingNotepadId,
    },
    actions,
  };
};
