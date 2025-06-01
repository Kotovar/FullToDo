import { useState, type ComponentPropsWithoutRef } from 'react';
import { useLocation } from 'react-router';
import { clsx } from 'clsx';
import { LinkCard, Input, COLORS, Icon, Button } from '@shared/ui';
import { commonNotepadId, ROUTES } from '@sharedCommon/';
import { useNotifications } from '@shared/lib/notifications';
import { getSuccessMessage } from '@shared/api';
import { useNotepads } from '@widgets/NavigationBar/lib';
import { NavigationBarSkeleton } from './skeleton';

interface NavigationBarProps extends ComponentPropsWithoutRef<'nav'> {
  turnOffVisibility?: () => void;
  isHidden: boolean;
}

export const NavigationBar = (props: NavigationBarProps) => {
  const { isHidden, turnOffVisibility, ...rest } = props;

  const [currentModalId, setCurrentModalId] = useState('');
  const [title, setTitle] = useState('');
  const [editingNotepadId, setEditingNotepadId] = useState<string | null>(null);
  const { showSuccess, showError } = useNotifications();
  const { notepads, isError, isLoading, methods } = useNotepads({
    onSuccess: method => showSuccess(getSuccessMessage('notepad', method)),
    onError: error => showError(error.message),
  });
  const basePath = useLocation().pathname;

  if (isLoading || isError) {
    return <NavigationBarSkeleton isHidden={isHidden} />;
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter' && title) {
      methods.createNotepad(title);
      setTitle('');
    }
  };

  const handleSaveTitle = async (
    id: string,
    newTitle: string,
    currentTitle: string,
  ) => {
    if (newTitle !== currentTitle) {
      const success = await methods.updateNotepadTitle(id, newTitle);
      if (!success) {
        return currentTitle;
      }
    }
    setEditingNotepadId(null);
    return newTitle;
  };

  const handleCreateNotepad = () => {
    if (title) {
      methods.createNotepad(title);
      setTitle('');
    }
  };

  const notepadList = notepads?.map(({ title, _id }) => {
    let path: string;
    if (_id === commonNotepadId) {
      path = ROUTES.TASKS;
    } else {
      path = ROUTES.getNotepadPath(_id);
    }

    return (
      <LinkCard
        currentModalId={currentModalId}
        handleModalId={id => setCurrentModalId(id)}
        className={clsx(
          'text-dark hover:bg-accent-light grid min-h-16 grid-cols-[1fr_2rem] content-center items-center justify-items-center rounded-lg p-2 break-words',
          {
            ['bg-grey-light']: path === basePath,
          },
        )}
        handleLinkClick={turnOffVisibility}
        key={_id}
        path={path}
        cardTitle={title}
        handleClickDelete={() => methods.deleteNotepad(_id)}
        handleClickRename={() => setEditingNotepadId(_id)}
        onSaveTitle={newTitle => handleSaveTitle(_id, newTitle, title)}
        isEditing={editingNotepadId === _id}
      />
    );
  });

  return (
    <nav {...rest}>
      <ul className='w-full'>
        {notepadList}
        <div className='flex gap-2 p-2'>
          <Input
            className='min-w-0 outline-0'
            placeholder='Добавить блокнот'
            type='text'
            value={title}
            onChange={event => setTitle(event.target.value)}
            onKeyDown={handleKeyDown}
            leftContent={
              <Button
                appearance='ghost'
                onClick={handleCreateNotepad}
                padding='none'
                aria-label='Добавить блокнот'
              >
                <Icon name='plus' stroke={COLORS.ACCENT} />
              </Button>
            }
          />
        </div>
      </ul>
    </nav>
  );
};
