import { useCallback, useState } from 'react';

type UseEditableTitleProps = {
  initialTitle: string;
  onSaveTitle?: (newTitle: string) => Promise<string | void>;
};

export const useEditableTitle = ({
  initialTitle,
  onSaveTitle,
}: UseEditableTitleProps) => {
  const [editedTitle, setEditedTitle] = useState(initialTitle);

  const handleSaveTitle = useCallback(async () => {
    if (!onSaveTitle) return;

    const resultTitle = await onSaveTitle(editedTitle);
    if (resultTitle !== editedTitle) {
      setEditedTitle(initialTitle);
    }
  }, [editedTitle, initialTitle, onSaveTitle]);

  const handleKeyDown = useCallback<
    React.KeyboardEventHandler<HTMLInputElement>
  >(
    async e => {
      if (e.key === 'Enter' && editedTitle) {
        await handleSaveTitle();
      }
    },
    [editedTitle, handleSaveTitle],
  );

  const onChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    e => setEditedTitle(e.target.value),
    [],
  );

  return {
    editedTitle,
    titleMethods: {
      onChange,
      onBlur: handleSaveTitle,
      handleKeyDown,
    },
    setEditedTitle,
  };
};
