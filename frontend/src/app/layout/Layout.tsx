import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { clsx } from 'clsx';
import { useVisibility } from '@app/layout/useVisibility';
import { Header } from '@widgets/Header';
import { NavigationBar } from '@widgets/NavigationBar';

export const Layout = () => {
  const [isHidden, handleVisibility, turnOffVisibility] = useVisibility();

  return (
    <div className='font-display bg-grey-light h-screen'>
      <Header
        className='bg-accent fixed z-10 flex h-16 w-full items-center justify-between gap-x-1 px-2'
        changeVisibility={handleVisibility}
      />
      <div className='bg-grey-light text-dark relative flex h-full w-full pt-16 text-2xl'>
        <NavigationBar
          className={clsx(
            'flex flex-auto bg-white p-4 break-all md:w-[30%] md:flex-none',
            {
              ['hidden']: isHidden,
            },
          )}
          turnOffVisibility={turnOffVisibility}
          isHidden={isHidden}
        />
        <main
          className={clsx('flex flex-auto flex-col p-4 md:flex md:w-full', {
            ['hidden']: !isHidden,
          })}
        >
          <Outlet />
          <ToastContainer
            position='top-right'
            autoClose={2000}
            hideProgressBar={false}
            closeOnClick
            draggable
          />
        </main>
      </div>
    </div>
  );
};
