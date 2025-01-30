import { useParams } from 'react-router';
import { clsx } from 'clsx';
import { TaskCard } from '@pages/TasksPage/ui';
import type { ComponentPropsWithoutRef } from 'react';

interface Task {
  name: string;
  progress: string;
  id: number;
}

interface Props extends ComponentPropsWithoutRef<'ul'> {
  tasks: Task[];
}

export const TaskList = (props: Props) => {
  const { tasks, ...rest } = props;
  const { taskIds } = useParams();

  return (
    <ul {...rest}>
      {tasks.map(({ name, progress, id }) => (
        <TaskCard
          className={clsx(
            'hover:bg-accent-light grid grid-cols-[2rem_1fr_2rem] items-center gap-2 rounded-sm p-4 text-2xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]',
            {
              ['bg-bg-second']: id === Number(taskIds),
              ['bg-white']: id !== Number(taskIds),
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
