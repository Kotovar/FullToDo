import type { ComponentPropsWithoutRef } from 'react';
import { clsx } from 'clsx';
import { useLocation, useParams } from 'react-router';
import { NOTEPADS } from '@shared/mock';
import { Notepad } from './Notepad';
import { COLORS, Icon } from '@shared/ui/Icon';

interface Props extends ComponentPropsWithoutRef<'nav'> {
  changeVisibility?: () => void;
}

export const NavigationBar = (props: Props) => {
  const { changeVisibility, ...rest } = props;

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
          <Notepad
            className={clsx(
              'text-dark hover:bg-accent-light grid min-h-16 grid-cols-[1fr_2rem] items-center justify-items-start rounded-lg p-2 break-words',
              {
                ['bg-grey-light']: taskName === title,
              },
            )}
            name={taskName}
            path={path}
            key={id}
            changeVisibility={changeVisibility}
          />
        ))}
        <div className='flex gap-2 bg-white p-4'>
          <Icon name='plus' size={32} stroke={COLORS.ACCENT} />
          <input
            className='w-full outline-0'
            type='text'
            placeholder='Добавить список'
          />
        </div>
      </ul>
    </nav>
  );
};
