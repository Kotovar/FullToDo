import { Outlet, useParams } from 'react-router';
import { clsx } from 'clsx';
import { Header } from '@widgets/Header';
import { NavigationBar } from '@widgets/NavigationBar';

export const Layout = () => {
  const { taskIds } = useParams();

  return (
    <div className='font-display bg-grey-light h-screen'>
      <Header className='bg-accent fixed top-0 z-10 flex min-h-16 w-full items-center justify-between gap-x-1 px-1' />
      <NavigationBar className='hidden bg-white p-4 sm:p-2 md:col-span-1 md:block' />
      <main
        className={clsx(
          'bg-grey-light text-dark gap-2text-2xl relative top-16 flex flex-col justify-start',
          {
            ['sm:col-span-1']: taskIds,
            ['sm:col-span-2']: !taskIds,
          },
        )}
      >
        <Outlet />
      </main>
    </div>
  );
};
