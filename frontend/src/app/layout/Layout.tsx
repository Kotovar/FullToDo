import { Outlet } from 'react-router';
import { ToastContainer, Slide } from 'react-toastify';
import { clsx } from 'clsx';
import { useVisibility } from '@app/layout/useVisibility';
import { Header } from '@widgets/Header';
import { NavigationBar } from '@widgets/NavigationBar';
import { useDarkToast } from './utils';

export const Layout = () => {
  const [isHidden, handleVisibility, turnOffVisibility] = useVisibility();
  const { toastClassName, theme } = useDarkToast();

  return (
    <div className='font-display bg-grey-light h-screen'>
      <Header
        className='bg-accent fixed z-10 flex h-16 w-full items-center justify-between gap-x-1 px-2'
        changeVisibility={handleVisibility}
      />
      <div className='bg-grey-light text-dark relative flex h-full w-full pt-16 text-2xl'>
        <NavigationBar
          className={clsx(
            'bg-light scrollbar-notepads flex flex-auto overflow-y-scroll p-2 break-all md:w-3xs md:flex-none md:p-4 lg:w-80 2xl:max-w-100',
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
            toastClassName={toastClassName}
            position='top-right'
            transition={Slide}
            autoClose={1000}
            hideProgressBar={true}
            limit={3}
            theme={theme}
            closeOnClick
            draggable
            stacked
          />
        </main>
      </div>
    </div>
  );
};
