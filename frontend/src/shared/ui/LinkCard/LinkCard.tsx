import { memo, useRef } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { Button, Icon, ICON_SIZES, OptionsMenu } from '@shared/ui';
import { useDarkMode } from '@shared/lib';
import { useMenuToggle, useEditableTitle } from './hooks';
import type { LinkCardProps } from './LinkCard.interface';

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

  const buttonRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const { fill } = useDarkMode();

  const { editedTitle, titleMethods } = useEditableTitle({
    initialTitle: cardTitle,
    onSaveTitle,
  });

  const { isCurrentMenuOpen, isNotMainNotepad, menuMethods } = useMenuToggle({
    path,
    currentModalId,
    handleModalId,
  });

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
        onChange={titleMethods.onChange}
        onBlur={titleMethods.onBlur}
        onKeyDown={titleMethods.handleKeyDown}
        className={clsx(
          'h-full w-full rounded leading-normal focus:outline-none focus-visible:ring-2',
          linkClassName,
        )}
        autoFocus
      />
      {body}
    </div>
  ) : (
    <Link
      to={path}
      onClick={handleLinkClick}
      className={clsx(
        'focus-visible:ring-dark block h-full w-full rounded focus:outline-none',
        linkClassName,
      )}
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
      {isNotMainNotepad && (
        <div className='relative flex'>
          <Button
            appearance='ghost'
            onClick={menuMethods.toggleMenu}
            aria-label={t('card.additionalMenu')}
            ref={buttonRef}
          >
            <Icon name='threeDots' fill={fill} size={ICON_SIZES.DEFAULT} />
          </Button>
          {isCurrentMenuOpen && (
            <OptionsMenu
              buttonRef={buttonRef}
              renameHandler={handleClickRename}
              deleteHandler={handleClickDelete}
              closeMenu={menuMethods.closeMenu}
            />
          )}
        </div>
      )}
    </li>
  );
});
