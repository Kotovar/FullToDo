import { useRef, type ComponentPropsWithoutRef, JSX } from 'react';
import { Link } from 'react-router';
import { COLORS, Icon, OptionsMenu } from '@shared/ui';

interface LinkCardProps extends ComponentPropsWithoutRef<'li'> {
  path: string;
  cardTitle: string | JSX.Element;
  header?: JSX.Element;
  body?: JSX.Element;
  handleLinkClick?: () => void;
  handleModalId: (id: string) => void;
  currentModalId: string;
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
    ...rest
  } = props;
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    handleModalId(path);
    menuRef.current?.togglePopover();
  };

  return (
    <li {...rest}>
      {header}
      {handleLinkClick ? (
        <Link to={path} onClick={handleLinkClick} className='w-full'>
          {cardTitle}
          {body}
        </Link>
      ) : (
        <Link to={path} className='w-full'>
          {cardTitle}
          {body}
        </Link>
      )}
      <div className='relative'>
        <button onClick={handleClick}>
          <Icon name='threeDots' size={38} fill={COLORS.ACCENT} />
        </button>
        {currentModalId === path && <OptionsMenu ref={menuRef} />}
      </div>
    </li>
  );
};
