import { ComponentPropsWithoutRef, JSX, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button, Icon, ICON_SIZES, OptionsMenu } from '@shared/ui';
import { useDarkMode } from '@shared/lib';

interface LinkCardProps extends ComponentPropsWithoutRef<'li'> {
  path: string;
  cardTitle: string;
  currentModalId: string;
  header?: JSX.Element;
  body?: JSX.Element;
  isEditing?: boolean;
  handleModalId: (id: string) => void;
  handleClickRename: () => void;
  handleClickDelete: () => void;
  handleLinkClick?: () => void;
  onSaveTitle?: (newTitle: string) => Promise<string | void>;
}

export const LinkCard = (props: LinkCardProps) => {
  const {
    header,
    cardTitle,
    path,
    body,
    currentModalId,
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

  const handleButtonClick = () => {
    handleModalId(path);
    setIsMenuOpen(!isMenuOpen);
  };

  const inputTitle = (
    <input
      type='text'
      value={editedTitle}
      className='h-full w-full cursor-pointer border-none bg-transparent outline-none'
      aria-label={`${t('essence')} ${editedTitle}`}
      name={editedTitle}
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
          aria-label={t('card.additionalMenu')}
          ref={buttonRef}
        >
          <Icon name='threeDots' fill={fill} size={ICON_SIZES.DEFAULT} />
        </Button>
        {isMenuOpen && currentModalId === path && (
          <OptionsMenu
            buttonRef={buttonRef}
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
