import { useLocation, useParams } from 'react-router';
import { COLORS, Icon } from '@shared/ui/Icon';
import { clsx } from 'clsx';
import { Sort, Filter } from '..';
import { NOTEPADS } from '@shared/mock';

const TITLE_WITHOUT_TASKS = 'Не выбран ни один блокнот';

export const TaskHeader = () => {
  const { notepadId, taskIds } = useParams();
  const location = useLocation().pathname;

  const pathToNotepadId = `/notepad/${notepadId}`;

  const title = NOTEPADS.find(
    notepad => notepad.path === pathToNotepadId || notepad.path === location,
  )?.taskName;

  return (
    <div
      className={clsx('bg-grey-light flex flex-col gap-2 pb-2', {
        ['hidden']: taskIds,
      })}
    >
      <h1 className='text-center text-4xl'>{title || TITLE_WITHOUT_TASKS}</h1>
      {
        <div className='grid grid-cols-2 gap-4 text-xl md:mr-2 md:flex md:justify-end'>
          <Filter />
          <Sort />
        </div>
      }
      <div className='flex flex-col gap-2'>
        <div className='flex gap-2 bg-white p-4 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'>
          <Icon name='plus' size={32} stroke={COLORS.ACCENT} />
          <input
            className='w-full outline-0'
            type='text'
            placeholder='Добавить задачу'
          />
        </div>
        <div className='bg-grey-light flex items-center gap-2 p-4 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'>
          <Icon name='calendar' size={32} stroke={COLORS.ACCENT} />
          <input
            className='w-full outline-0'
            type='text'
            placeholder='Дата выполнения'
          />
          <button className='rounded-lg bg-white px-4 py-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'>
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
};
