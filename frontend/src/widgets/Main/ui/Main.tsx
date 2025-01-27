import { useLocation, useParams } from 'react-router';
import { clsx } from 'clsx';
import { TASKS1, TASKS2, TASKS3, NOTEPADS } from '@shared/mock';
import { Filter, Sort, TaskList } from '@widgets/Main/ui';
import { TaskDetail } from '@widgets/Main';
import PlusIcon from './plus.svg?react';
import CalendarIcon from './calendar.svg?react';

interface Props {
  isEmptyPage?: boolean;
}

const TITLE_WITHOUT_TASKS = 'Не выбран ни один блокнот';

export const Main = (props: Props) => {
  const { isEmptyPage = false } = props;
  const { notepadId, taskIds } = useParams();
  const location = useLocation().pathname;

  const pathToNotepadId = `/notepad/${notepadId}`;

  const title = NOTEPADS.find(
    notepad => notepad.path === pathToNotepadId || notepad.path === location,
  )?.taskName;

  const tasks =
    notepadId === '1'
      ? TASKS1
      : notepadId === '2'
        ? TASKS2
        : notepadId === '3'
          ? TASKS3
          : '';

  return (
    <>
      <div
        className={clsx({
          ['hidden']: taskIds,
        })}
      >
        <div className='bg-grey-light fixed z-10 flex min-h-56 w-full flex-col justify-center'>
          <h1 className='text-center text-4xl'>
            {title || TITLE_WITHOUT_TASKS}
          </h1>
          {!isEmptyPage && tasks && (
            <div className='grid w-full grid-cols-2 text-xl'>
              <Filter />
              <Sort />
            </div>
          )}
          <div className='flex flex-col gap-2'>
            <div className='flex gap-2 bg-white p-4 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'>
              <PlusIcon className='h-8 w-8' />
              <input
                className='w-full outline-0'
                type='text'
                placeholder='Добавить задачу'
              />
            </div>
            <div className='bg-grey-light flex gap-2 p-4 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'>
              <CalendarIcon className='h-8 w-8' />
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

        {tasks ? (
          <TaskList
            tasks={tasks}
            className='relative top-56 flex w-full flex-col gap-2'
          />
        ) : (
          <span className='text-center'>Не найдено ни одной задачи</span>
        )}
      </div>
      {taskIds && (
        <TaskDetail
          className={clsx({
            ['hidden']: !taskIds,
          })}
          taskId={taskIds}
        />
      )}
    </>
  );
};
