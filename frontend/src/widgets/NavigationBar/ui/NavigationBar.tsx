import type { ComponentPropsWithoutRef } from 'react';
import { useLocation, useParams } from 'react-router';
import { clsx } from 'clsx';
import { NOTEPADS } from '@entities/Task';
import { LinkCard } from '@shared/ui/LinkCard';
import { Input } from '@shared/ui/Input';

interface Props extends ComponentPropsWithoutRef<'nav'> {
  turnOffVisibility?: () => void;
}

export const NavigationBar = (props: Props) => {
  const { turnOffVisibility, ...rest } = props;

  const location = useLocation().pathname;
  const { notepadId } = useParams();

  const pathToNotepadId = `/notepad/${notepadId}`;

  const title = NOTEPADS.find(
    notepad => notepad.path === pathToNotepadId || notepad.path === location,
  )?.taskName;

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
        <div className='flex gap-2 bg-white p-4'>
          <Input placeholder='Добавить список' type='text' iconName='plus' />
        </div>
      </ul>
    </nav>
  );
};
