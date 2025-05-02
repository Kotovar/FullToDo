import { clsx } from 'clsx';
import { Sort, Filter, AddTask } from '@pages/Tasks/ui';

interface TasksHeaderProps {
  title: string;
}

export const TasksHeader = ({ title }: TasksHeaderProps) => {
  return (
    <header className={clsx('bg-grey-light flex flex-col gap-2 p-1')}>
      <h1 className='text-center text-4xl'>{title}</h1>
      <nav className='grid grid-cols-2 gap-4 text-xl md:mr-2 md:flex md:justify-end'>
        <Filter />
        <Sort />
      </nav>
      <AddTask />
    </header>
  );
};
