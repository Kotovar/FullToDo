import { useLocation } from 'react-router';
import { useMemo, useState, type ComponentPropsWithoutRef } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { commonNotepadId, ROUTES } from '@sharedCommon/';
import { LinkCard, Input, Icon, Button } from '@shared/ui';
import { useDarkMode } from '@shared/lib';
import { NavigationBarSkeleton } from './skeleton';
import { useNavigationBar } from './hooks';

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

  const { t } = useTranslation();
  const basePath = useLocation().pathname;
  const { fill } = useDarkMode();
  const { state, actions } = useNavigationBar();

  const { notepads, isLoading, title, editingNotepadId } = state;

  const leftContent = useMemo(() => {
    return (
      <Button
        appearance='ghost'
        onClick={actions.create.onClick}
        aria-label={t('notepads.add')}
      >
        <Icon name='plus' stroke={fill} />
      </Button>
    );
  }, [actions.create.onClick, fill, t]);

  const notepadList = useMemo(
    () =>
      notepads.map(({ title, _id }) => {
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
              'text-dark grid grid-cols-[1fr_2rem] items-center rounded-lg hover:bg-current/10 has-[a:focus]:ring-2',
              {
                ['bg-grey/40']: basePath.startsWith(path),
              },
            )}
            linkClassName='px-2 py-4'
            handleLinkClick={turnOffVisibility}
            key={_id}
            path={path}
            cardTitle={title}
            handleClickDelete={() => actions.delete.onClick(_id)}
            handleClickRename={() => actions.edit.setId(_id)}
            onSaveTitle={newTitle =>
              actions.edit.saveTitle(_id, newTitle, title)
            }
            isEditing={editingNotepadId === _id}
          />
        );
      }),
    [
      actions.delete,
      actions.edit,
      basePath,
      currentModalId,
      editingNotepadId,
      notepads,
      turnOffVisibility,
    ],
  );

  if (isLoading) {
    return <NavigationBarSkeleton isHidden={isHidden} />;
  }

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
              onChange={actions.create.onChange}
              onKeyDown={actions.create.onKeyDown}
              leftContent={leftContent}
            />
          </div>
        </li>
      </ul>
    </nav>
  );
};
