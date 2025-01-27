import type { ComponentPropsWithoutRef } from 'react';
import { clsx } from 'clsx';
import { useLocation, useParams } from 'react-router';
import { NOTEPADS } from '@shared/mock';
import { Notepad } from './Notepad';

type Props = ComponentPropsWithoutRef<'nav'>;

export const NavigationBar = (props: Props) => {
  const { ...rest } = props;

  const location = useLocation().pathname;
  const { notepadId } = useParams();

  const pathToNotepadId = `/notepad/${notepadId}`;

  const title = NOTEPADS.find(
    notepad => notepad.path === pathToNotepadId || notepad.path === location,
  )?.taskName;

  return (
    <nav {...rest}>
      <ul className='flex flex-col gap-1'>
        {NOTEPADS.map(({ taskName, path, id }) => (
          <Notepad
            className={clsx(
              'text-dark hover:bg-accent-light grid min-h-16 grid-cols-[1fr_2rem] items-center justify-items-end rounded-lg p-2 break-words',
              {
                ['bg-grey-light']: taskName === title,
              },
            )}
            name={taskName}
            path={path}
            key={id}
          />
        ))}
      </ul>
    </nav>
  );
};
