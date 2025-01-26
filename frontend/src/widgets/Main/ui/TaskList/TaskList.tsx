import { clsx } from 'clsx';
import { TaskCard } from '@widgets/Main/ui';
import { useParams } from 'react-router';

interface Task {
  name: string;
  progress: string;
  id: number;
}

interface Props {
  tasks: Task[];
}

export const TaskList = (props: Props) => {
  const { tasks } = props;
  const { taskId } = useParams();

  return (
    <ul className='flex flex-col gap-1'>
      {tasks.map(({ name, progress, id }) => (
        <TaskCard
          className={clsx(
            'b grid grid-cols-[1fr_2rem] grid-rows-1 items-center gap-2 rounded-lg text-2xl hover:bg-white',
            {
              ['bg-gray-300']: id === Number(taskId),
            },
          )}
          name={name}
          progress={progress}
          taskId={id}
          key={id}
        />
      ))}
    </ul>
  );
};
