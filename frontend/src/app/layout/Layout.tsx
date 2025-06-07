import { Outlet } from 'react-router';
import { ToastContainer, Slide } from 'react-toastify';
import { clsx } from 'clsx';
import { useVisibility } from '@app/layout/useVisibility';
import { Header } from '@widgets/Header';
import { NavigationBar } from '@widgets/NavigationBar';
import { useDarkMode } from '@shared/lib';

export const Layout = () => {
  const [isHidden, handleVisibility, turnOffVisibility] = useVisibility();
  const { isDarkMode } = useDarkMode();

  return (
    <div className='font-display bg-grey-light h-screen'>
      <Header
        className='bg-accent fixed z-10 flex h-16 w-full items-center justify-between gap-x-1 px-2'
        changeVisibility={handleVisibility}
      />
      <div className='bg-grey-light text-dark relative flex h-full w-full pt-16 text-2xl'>
        <NavigationBar
          className={clsx(
            'bg-light flex flex-auto p-4 break-all md:w-[30%] md:flex-none',
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
            toastClassName={() =>
              clsx(
                'relative flex p-4 min-h-10 rounded-md cursor-pointer border-1 text-dark',
                {
                  'bg-accent border-dark': isDarkMode,
                  'bg-light border-accent': !isDarkMode,
                },
              )
            }
            position='top-right'
            transition={Slide}
            autoClose={1000}
            hideProgressBar={true}
            limit={3}
            theme={isDarkMode ? 'dark' : 'light'}
            closeOnClick
            draggable
            stacked
          />
        </main>
      </div>
    </div>
  );
};
