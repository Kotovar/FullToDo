import type { ComponentPropsWithoutRef } from 'react';
import { clsx } from 'clsx';
import { NOTEPADS } from '@entities/Task';
import { LinkCard } from '@shared/ui/LinkCard';
import { Input } from '@shared/ui/Input';
import { COLORS, Icon } from '@shared/ui/Icon';
import { Button } from '@shared/ui/Button';
import { useTitle } from '@features/notepad';

interface Props extends ComponentPropsWithoutRef<'nav'> {
  turnOffVisibility?: () => void;
}

export const NavigationBar = (props: Props) => {
  const { turnOffVisibility, ...rest } = props;

  const [title] = useTitle();

  return (
    <nav {...rest}>
      <ul className='w-full'>
        {NOTEPADS.map(({ taskName, path, id }) => (
          <LinkCard
            className={clsx(
              'text-dark hover:bg-accent-light grid min-h-16 grid-cols-[1fr_2rem] items-center justify-items-start rounded-lg p-2 break-words',
              {
                ['bg-grey-light']: taskName === title,
              },
            )}
            handleLinkClick={turnOffVisibility}
            key={id}
            path={path}
            cardTitle={<span className='text-3xl'>{taskName}</span>}
          />
        ))}
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
