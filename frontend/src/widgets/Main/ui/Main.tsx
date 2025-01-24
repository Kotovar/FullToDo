import FilterIcon from './task-filter.svg?react';
import SortIcon from './arrow-down.svg?react';
import { Task } from '@shared/ui';

interface Props {
  title: string;
}

const MOCK_DATA = ['Задача 1', 'Задача 2', 'Задача 3', 'Задача 4', 'Задача 5'];
const MOCK_DATA2 = ['1 из 5', '2 из 7', '0 из 1', '7 из 8', '0 из 3'];

export const Main = (props: Props) => {
  const { title } = props;

  return (
    <>
      <h1 className='text-center text-4xl'>{title}</h1>
      <div className='grid w-full grid-cols-2 text-xl'>
        <div className='flex items-center justify-center gap-2'>
          <button>Активные</button>
          <FilterIcon className='stroke-accent h-8 w-8' />
        </div>
        <div className='flex items-center justify-center gap-2'>
          <button>По дате создания</button>
          <button>
            <SortIcon className='fill-accent h-8 w-8' />
          </button>
        </div>
      </div>
      <ul className='flex flex-col gap-1'>
        {MOCK_DATA.map((task, i) => (
          <Task
            classname='text-2xl grid grid-cols-[2rem_1fr_2rem] grid-rows-1 items-end gap-2 '
            name={task}
            status={MOCK_DATA2[i]}
            key={i}
          />
        ))}
      </ul>
    </>
  );
};
