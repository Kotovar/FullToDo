import { clsx } from 'clsx';
import { Sort, Filter } from '..';
import { useTask } from './useTitle';
import { AddTask } from '../AddTask.tsx';

export const TasksHeader = () => {
  const [title] = useTask();

  return (
    <div className={clsx('bg-grey-light flex flex-col gap-2 pb-2')}>
      <h1 className='text-center text-4xl'>{title}</h1>
      {
        <div className='grid grid-cols-2 gap-4 text-xl md:mr-2 md:flex md:justify-end'>
          <Filter />
          <Sort />
        </div>
      }
      <div className='flex flex-col gap-2'>
        <AddTask />
      </div>
    </div>
  );
};
