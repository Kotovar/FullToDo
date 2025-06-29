import { useLocation } from 'react-router';
import { useState, type ComponentPropsWithoutRef } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { LinkCard, Input, Icon, Button } from '@shared/ui';
import { commonNotepadId, ROUTES } from '@sharedCommon/';
import { useNotifications } from '@shared/lib/notifications';
import { useNotepads } from '@widgets/NavigationBar/lib';
import { NavigationBarSkeleton } from './skeleton';
import { useDarkMode, useSuccessMessage } from '@shared/lib';

interface NavigationBarProps extends ComponentPropsWithoutRef<'nav'> {
  turnOffVisibility?: () => void;
  isHidden: boolean;
}

export const NavigationBar = ({
  isHidden,
  turnOffVisibility,
  ...rest
}: NavigationBarProps) => {
  const [currentModalId, setCurrentModalId] = useState('');
  const [title, setTitle] = useState('');
  const [editingNotepadId, setEditingNotepadId] = useState<string | null>(null);
  const { showSuccess, showError } = useNotifications();
  const getSuccessMessage = useSuccessMessage();
  const { t } = useTranslation();
  const { notepads, isError, isLoading, methods } = useNotepads({
    onSuccess: method => showSuccess(getSuccessMessage('notepad', method)),
    onError: error => showError(t(error.message)),
  });
  const basePath = useLocation().pathname;
  const { fill } = useDarkMode();

  if (isLoading || isError) {
    return <NavigationBarSkeleton isHidden={isHidden} />;
  }

  const handleCreateNotepad = async () => {
    if (title) {
      await methods.createNotepad(title);

      setTitle('');
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter') {
      handleCreateNotepad();
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
          'text-dark grid grid-cols-[1fr_2rem] content-center items-center justify-items-center rounded-lg hover:bg-current/10',
          {
            ['bg-grey/40']: basePath.startsWith(path),
          },
        )}
        linkClassName='px-2 py-4'
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
        <li>
          <div className='flex gap-2 p-2'>
            <Input
              className='placeholder:text-grey min-w-0 outline-0'
              placeholder={t('notepads.add')}
              name='notepad'
              type='text'
              value={title}
              onChange={event => setTitle(event.target.value)}
              onKeyDown={handleKeyDown}
              leftContent={
                <Button
                  appearance='ghost'
                  onClick={handleCreateNotepad}
                  aria-label={t('notepads.add')}
                >
                  <Icon name='plus' stroke={fill} />
                </Button>
              }
            />
          </div>
        </li>
      </ul>
    </nav>
  );
};
