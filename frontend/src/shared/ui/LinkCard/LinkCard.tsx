import { ComponentPropsWithoutRef, JSX, useState } from 'react';
import { Link } from 'react-router';
import { Button, COLORS, Icon, ICON_SIZES, OptionsMenu } from '@shared/ui';

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
  isEditing?: boolean;
  onSaveTitle?: (newTitle: string) => void;
}

export const LinkCard = (props: LinkCardProps) => {
  const {
    header,
    cardTitle,
    path,
    body,
    isEditing = false,
    currentModalId,
    handleLinkClick,
    handleModalId,
    handleClickRename,
    handleClickDelete,
    onSaveTitle,
    ...rest
  } = props;

  const [editedTitle, setEditedTitle] = useState(cardTitle);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleSave = () => {
    onSaveTitle?.(editedTitle);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter' && editedTitle) {
      handleSave();
    }
  };

  const handleButtonClick = () => {
    handleModalId(path);
    setIsMenuOpen(!isMenuOpen);
  };

  const inputTitle = (
    <input
      type='text'
      value={editedTitle}
      className='h-full w-full cursor-pointer border-none bg-transparent outline-none'
      readOnly
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
        className='h-full w-full leading-normal outline-2 outline-transparent'
        autoFocus
      />
      {body}
    </div>
  ) : (
    <Link
      to={path}
      onClick={handleLinkClick || undefined}
      className='block h-full w-full'
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

  return (
    <li {...rest}>
      {header}
      {title}
      <div className='relative flex'>
        <Button
          appearance='ghost'
          onClick={handleButtonClick}
          padding='none'
          aria-label='Дополнительное меню'
        >
          <Icon
            name='threeDots'
            fill={COLORS.ACCENT}
            size={ICON_SIZES.DEFAULT}
          />
        </Button>
        {isMenuOpen && currentModalId === path && (
          <OptionsMenu
            renameHandler={() => {
              handleClickRename();
              closeMenu();
            }}
            deleteHandler={() => {
              handleClickDelete();
              closeMenu();
            }}
            closeMenu={closeMenu}
          />
        )}
      </div>
    </li>
  );
};
