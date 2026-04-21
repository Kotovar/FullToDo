import { Outlet, useLocation } from 'react-router';
import { clsx } from 'clsx';
import { Header } from '@widgets/Header';
import { NavigationBar } from '@widgets/NavigationBar';
import { ROUTES } from '@sharedCommon';
import { useVisibility } from './hooks';

const Layout = () => {
  const { pathname } = useLocation();
  const [isHidden, handleVisibility, turnOffVisibility] = useVisibility();
  const isAccountPage = pathname === ROUTES.app.account;

  return (
    <div className='font-display h-screen'>
      <Header
        className='bg-accent fixed z-10 flex h-16 w-full items-center gap-x-1 px-2'
        changeVisibility={handleVisibility}
      />
      <main className='bg-grey-light text-dark flex h-full pt-16 text-2xl'>
        {!isAccountPage && (
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
        )}
        <section
          className={clsx('flex w-full flex-col p-4 md:flex landscape:p-1', {
            ['hidden']: !isAccountPage && !isHidden,
            ['mx-auto max-w-5xl p-4 md:px-8 md:py-6 landscape:p-4']:
              isAccountPage,
          })}
          aria-live='polite'
        >
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Layout;
