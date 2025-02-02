import { clsx } from 'clsx';
import { Sort, Filter, AddTask } from '@pages/Tasks/ui';

interface TasksHeaderProps {
  title: string;
}

export const TasksHeader = ({ title }: TasksHeaderProps) => {
  return (
    <div className={clsx('bg-grey-light flex flex-col gap-2 pb-2')}>
      <h1 className='text-center text-4xl'>{title}</h1>
      <div className='grid grid-cols-2 gap-4 text-xl md:mr-2 md:flex md:justify-end'>
        <Filter />
        <Sort />
      </div>
      <div className='flex flex-col gap-2'>
        <AddTask />
      </div>
    </div>
  );
};
