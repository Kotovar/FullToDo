import { Outlet, useParams } from 'react-router';
import { clsx } from 'clsx';
import { Header } from '@widgets/Header';
import { NavigationBar } from '@widgets/NavigationBar';
import { TaskDetail } from '@widgets/Main';

export const Layout = () => {
  const { taskIds } = useParams();

  return (
    <div className='font-display grid h-screen grid-cols-1 grid-rows-[4rem_1fr] sm:grid-cols-[30vw_1fr_20vw] lg:grid-cols-[20vw_1fr_20vw]'>
      <Header />
      <NavigationBar />
      <main
        className={clsx(
          'bg-background text-text col-span-3 flex flex-col justify-start p-4 text-2xl',
          {
            ['sm:col-span-1']: taskIds,
            ['sm:col-span-2']: !taskIds,
          },
        )}
      >
        <Outlet />
      </main>
      {taskIds && <TaskDetail taskId={taskIds} />}
    </div>
  );
};
