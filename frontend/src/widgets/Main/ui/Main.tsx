import { TASKS1, TASKS2, TASKS3, NOTEPADS } from '@shared/mock';
import { Filter, Sort, TaskList } from '@widgets/Main/ui';
import { useLocation, useParams } from 'react-router';

interface Props {
  isEmptyPage?: boolean;
}

const TITLE_WITHOUT_TASKS = 'Не выбран ни один блокнот';

export const Main = (props: Props) => {
  const { isEmptyPage = false } = props;
  const { notepadId } = useParams();
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
      <h1 className='text-center text-4xl'>{title || TITLE_WITHOUT_TASKS}</h1>
      {!isEmptyPage && tasks && (
        <div className='grid w-full grid-cols-2 text-xl'>
          <Filter />
          <Sort />
        </div>
      )}
      {tasks ? (
        <TaskList tasks={tasks} />
      ) : (
        <span className='text-center'>Не найдено ни одной задачи</span>
      )}
    </>
  );
};
