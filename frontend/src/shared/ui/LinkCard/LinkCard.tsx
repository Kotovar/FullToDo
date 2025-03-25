import {
  useRef,
  type ComponentPropsWithoutRef,
  JSX,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router';
import { Button, COLORS, Icon, OptionsMenu } from '@shared/ui';

interface LinkCardProps extends ComponentPropsWithoutRef<'li'> {
  path: string;
  cardTitle: string;
  header?: JSX.Element;
  body?: JSX.Element;
  handleLinkClick?: () => void;
  handleModalId: (id: string) => void;
  currentModalId: string;
  handleClickRename: () => void;
  handleClickDelete: () => void;
  closeDialog: boolean;
  isEditing?: boolean;
  onSaveTitle?: (newTitle: string) => void;
}

export const LinkCard = (props: LinkCardProps) => {
  const {
    header,
    cardTitle,
    path,
    body,
    handleLinkClick,
    currentModalId,
    handleModalId,
    handleClickRename,
    handleClickDelete,
    closeDialog,
    isEditing = false,
    onSaveTitle,
    ...rest
  } = props;
  const menuRef = useRef<HTMLDivElement>(null);
  const [editedTitle, setEditedTitle] = useState(cardTitle);

  useEffect(() => {
    if (closeDialog) {
      menuRef.current?.togglePopover();
    }
  }, [closeDialog]);

  const handleClick = () => {
    handleModalId(path);
    menuRef.current?.togglePopover();
  };

  const handleSave = () => {
    onSaveTitle?.(editedTitle);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter' && editedTitle) {
      handleSave();
    }
  };

  return (
    <li {...rest}>
      {header}
      {isEditing ? (
        <div className='w-full'>
          {isEditing ? (
            <input
              type='text'
              value={editedTitle}
              onChange={e => setEditedTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <div>{editedTitle}</div>
          )}
          {body}
        </div>
      ) : (
        <Link
          to={path}
          onClick={handleLinkClick || undefined}
          className='w-full'
        >
          {cardTitle}
          {body}
        </Link>
      )}
      <div className='relative flex'>
        <Button appearance='ghost' onClick={handleClick} padding='none'>
          <Icon name='threeDots' size={38} fill={COLORS.ACCENT} />
        </Button>
        {currentModalId === path && (
          <OptionsMenu
            handleClickRename={handleClickRename}
            handleClickDelete={handleClickDelete}
            ref={menuRef}
          />
        )}
      </div>
    </li>
  );
};
