import {
  ComponentPropsWithoutRef,
  JSX,
  memo,
  useCallback,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { Button, Icon, ICON_SIZES, OptionsMenu } from '@shared/ui';
import { useDarkMode } from '@shared/lib';
import { ROUTES } from 'shared/routes';

interface LinkCardProps extends ComponentPropsWithoutRef<'li'> {
  path: string;
  cardTitle: string;
  currentModalId: string;
  header?: JSX.Element;
  body?: JSX.Element;
  isEditing?: boolean;
  linkClassName?: string;
  handleModalId: (id: string) => void;
  handleClickRename: () => void;
  handleClickDelete: () => void;
  handleLinkClick?: () => void;
  onSaveTitle?: (newTitle: string) => Promise<string | void>;
}

export const LinkCard = memo((props: LinkCardProps) => {
  const {
    header,
    cardTitle,
    path,
    body,
    currentModalId,
    linkClassName,
    isEditing = false,
    handleLinkClick,
    handleModalId,
    handleClickRename,
    handleClickDelete,
    onSaveTitle,
    ...rest
  } = props;

  const [editedTitle, setEditedTitle] = useState(cardTitle);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const { fill } = useDarkMode();

  const closeMenu = () => setIsMenuOpen(false);

  const handleSave = async () => {
    const resultTitle = await onSaveTitle?.(editedTitle);
    if (resultTitle !== editedTitle) {
      setEditedTitle(cardTitle);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<
    HTMLInputElement
  > = async event => {
    if (event.key === 'Enter' && editedTitle) {
      await handleSave();
    }
  };

  const handleButtonClick = useCallback(() => {
    handleModalId(path);
    setIsMenuOpen(prev => !prev);
  }, [handleModalId, path]);

  const inputTitle = (
    <input
      type='text'
      value={editedTitle}
      className='h-full w-full cursor-pointer truncate border-none bg-transparent outline-none'
      aria-label={`${t('essence')} ${editedTitle}`}
      name={editedTitle}
      readOnly
      tabIndex={-1}
    />
  );

  const title = isEditing ? (
    <div className='w-full'>
      <input
        type='text'
        value={editedTitle}
        onChange={e => setEditedTitle(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={clsx(
          'h-full w-full leading-normal outline-2 outline-transparent',
          linkClassName,
        )}
        autoFocus
      />
      {body}
    </div>
  ) : (
    <Link
      to={path}
      onClick={handleLinkClick || undefined}
      className={clsx('block h-full w-full', linkClassName)}
    >
      {body ? (
        <div className='w-full'>
          {inputTitle}
          {body}
        </div>
      ) : (
        inputTitle
      )}
    </Link>
  );

  const isNotMainNotepad = path !== ROUTES.TASKS;

  return (
    <li {...rest}>
      {header}
      {title}
      {isNotMainNotepad && (
        <div className='relative flex'>
          <Button
            appearance='ghost'
            onClick={handleButtonClick}
            aria-label={t('card.additionalMenu')}
            ref={buttonRef}
          >
            <Icon name='threeDots' fill={fill} size={ICON_SIZES.DEFAULT} />
          </Button>
          {isMenuOpen && currentModalId === path && (
            <OptionsMenu
              buttonRef={buttonRef}
              renameHandler={handleClickRename}
              deleteHandler={handleClickDelete}
              closeMenu={closeMenu}
            />
          )}
        </div>
      )}
    </li>
  );
});
