import { NOTEPADS } from '@shared/mock';
import { Notepad } from './Notepad';
import { useLocation } from 'react-router';
import { clsx } from 'clsx';

export const NavigationBar = () => {
  const location = useLocation().pathname;
  const title = NOTEPADS.find(notepad => notepad.path === location)?.taskName;

  return (
    <nav className='hidden bg-white p-4 sm:col-span-1 sm:block sm:p-2'>
      <ul className='flex flex-col gap-1'>
        {NOTEPADS.map(({ taskName, path, id }) => (
          <Notepad
            className={clsx(
              'text-text hover:bg-accent-hover grid grid-cols-[1fr_2rem] justify-items-start rounded-lg break-words',
              {
                ['bg-background']: taskName === title,
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
