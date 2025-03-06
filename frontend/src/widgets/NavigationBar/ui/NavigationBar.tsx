import { useState, type ComponentPropsWithoutRef } from 'react';
import { useLocation } from 'react-router';
import { clsx } from 'clsx';
import { NOTEPADS } from '@entities/Task';
import { LinkCard, Input, COLORS, Icon, Button } from '@shared/ui';
import { ROUTES } from '@sharedCommon/';

interface Props extends ComponentPropsWithoutRef<'nav'> {
  turnOffVisibility?: () => void;
}

export const NavigationBar = (props: Props) => {
  const { turnOffVisibility, ...rest } = props;
  const [currentModalId, setCurrentModalId] = useState('');

  const location = useLocation().pathname;
  const basePath = location.split(ROUTES.TASK)[0];

  const handleModalId = (id: string) => {
    setCurrentModalId(id);
  };

  return (
    <nav {...rest}>
      <ul className='w-full'>
        {NOTEPADS.map(({ title, _id }) => {
          const path = ROUTES.getNotepadPath(_id);

          return (
            <LinkCard
              currentModalId={currentModalId}
              handleModalId={handleModalId}
              className={clsx(
                'text-dark hover:bg-accent-light grid min-h-16 grid-cols-[1fr_2rem] items-center justify-items-start rounded-lg p-2 break-words',
                {
                  ['bg-grey-light']: path === basePath,
                },
              )}
              handleLinkClick={turnOffVisibility}
              key={_id}
              path={path}
              cardTitle={<span className='text-3xl'>{title}</span>}
            />
          );
        })}
        <Input
          containerClassName='grid grid-cols-[2rem_1fr] overflow-hidden gap-2'
          className='min-w-0 outline-0'
          placeholder='Добавить список'
          type='text'
          leftContent={
            <Button appearance='ghost'>
              <Icon name='plus' stroke={COLORS.ACCENT} />
            </Button>
          }
        />
      </ul>
    </nav>
  );
};
