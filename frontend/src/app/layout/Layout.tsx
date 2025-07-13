import { Outlet } from 'react-router';
import { ToastContainer, Slide } from 'react-toastify';
import { clsx } from 'clsx';
import { Header } from '@widgets/Header';
import { NavigationBar } from '@widgets/NavigationBar';
import { useVisibility, useDarkToast } from './hooks';

const Layout = () => {
  const [isHidden, handleVisibility, turnOffVisibility] = useVisibility();
  const { theme } = useDarkToast();

  return (
    <div className='font-display h-screen'>
      <Header
        className='bg-accent fixed z-10 flex h-16 w-full items-center gap-x-1 px-2'
        changeVisibility={handleVisibility}
      />
      <main className='bg-grey-light text-dark flex h-full pt-16 text-2xl'>
        <NavigationBar
          className={clsx(
            'bg-light scrollbar-notepads flex flex-auto overflow-y-scroll p-2 md:w-3xs md:flex-none md:p-4 md:pr-2 lg:w-80 2xl:max-w-100',
            {
              ['hidden']: isHidden,
            },
          )}
          turnOffVisibility={turnOffVisibility}
          isHidden={isHidden}
          aria-expanded={!isHidden}
        />
        <section
          className={clsx('flex w-full flex-col p-4 md:flex landscape:p-1', {
            ['hidden']: !isHidden,
          })}
          aria-live='polite'
        >
          <Outlet />
        </section>
        <ToastContainer
          toastClassName={
            'relative flex p-40 min-h-10 rounded-md cursor-pointer text-dark bg-red-50'
          }
          position='top-right'
          transition={Slide}
          autoClose={1500}
          hideProgressBar={true}
          limit={3}
          theme={theme}
          closeOnClick
          draggable
          stacked
        />
      </main>
    </div>
  );
};

export default Layout;
