import type { ComponentPropsWithoutRef, JSX } from 'react';
import { COLORS, Icon } from '@shared/ui/Icon';
import { Link } from 'react-router';

interface CardProps extends ComponentPropsWithoutRef<'li'> {
  path: string;
  cardTitle: string | JSX.Element;
  header?: JSX.Element;
  body?: JSX.Element;
  handleLinkClick?: () => void;
}

export const LinkCard = (props: CardProps) => {
  const { header, cardTitle, path, body, handleLinkClick, ...rest } = props;

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
      <button>
        <Icon name='threeDots' size={38} fill={COLORS.ACCENT} />
      </button>
    </li>
  );
};
