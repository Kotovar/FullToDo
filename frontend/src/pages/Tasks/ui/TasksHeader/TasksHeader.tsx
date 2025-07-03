import type { SetURLSearchParams } from 'react-router';
import { Sort, Filter, AddTask } from '@pages/Tasks/ui';

interface TasksHeaderProps {
  title: string;
  params: URLSearchParams;
  setParams: SetURLSearchParams;
}

export const TasksHeader = ({ title, params, setParams }: TasksHeaderProps) => {
  return (
    <header className='bg-grey-light flex flex-col gap-2 p-1'>
      <h1 className='text-center text-4xl break-all'>{title}</h1>
      <nav className='flex justify-center gap-4 text-xl md:mr-2 md:justify-end'>
        <Filter params={params} setParams={setParams} />
        <Sort params={params} setParams={setParams} />
      </nav>
      <AddTask />
    </header>
  );
};
