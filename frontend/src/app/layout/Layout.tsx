import { useCallback, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { clsx } from 'clsx';
import { Header } from '@widgets/Header';
import { NavigationBar } from '@widgets/NavigationBar';
import { ROUTES } from '@sharedCommon';
import { useVisibility } from './hooks';

const Layout = () => {
  const { pathname } = useLocation();
  const [isHidden, handleVisibility, turnOffVisibility] = useVisibility();
  const navigationWrapperRef = useRef<HTMLDivElement>(null);
  const isAccountPage = pathname === ROUTES.app.account;

  const clearNavigationFocus = useCallback(() => {
    const activeElement = document.activeElement;

    if (
      activeElement instanceof HTMLElement &&
      navigationWrapperRef.current?.contains(activeElement)
    ) {
      activeElement.blur();
    }
  }, []);

  const handleTurnOffVisibility = useCallback(() => {
    clearNavigationFocus();
    turnOffVisibility();
  }, [clearNavigationFocus, turnOffVisibility]);

  return (
    <div
      className={clsx('bg-grey-light font-display', {
        ['h-dvh overflow-hidden']: !isAccountPage,
        ['min-h-dvh']: isAccountPage,
      })}
    >
      <Header
        className='bg-accent fixed top-0 left-0 z-10 flex h-16 w-full items-center gap-x-1 px-2'
        changeVisibility={handleVisibility}
      />
      <main
        className={clsx('text-dark flex text-2xl md:grid', {
          ['h-full overflow-hidden pt-16']: !isAccountPage,
          ['min-h-dvh pt-16']: isAccountPage,
          ['md:transition-[grid-template-columns] md:duration-300']:
            !isAccountPage,
        })}
        style={
          !isAccountPage
            ? {
                gridTemplateColumns: isHidden
                  ? '0px minmax(0, 1fr)'
                  : '20rem minmax(0, 1fr)',
              }
            : undefined
        }
      >
        {!isAccountPage && (
          <div
            ref={navigationWrapperRef}
            className={clsx(
              'fixed top-16 left-0 z-20 h-[calc(100dvh-4rem)] w-screen overflow-hidden transition-transform duration-300 ease-out md:static md:z-auto md:h-auto md:w-full md:transition-none',
              {
                ['translate-x-0']: !isHidden,
                ['-translate-x-full md:translate-x-0']: isHidden,
              },
            )}
            inert={isHidden}
          >
            <NavigationBar
              className={clsx(
                'bg-light scrollbar-notepads flex h-full w-full overflow-y-scroll p-2 transition-transform duration-300 ease-out md:p-4 md:pr-2',
                {
                  ['translate-x-0']: !isHidden,
                  ['-translate-x-6 md:translate-x-0']: isHidden,
                },
              )}
              turnOffVisibility={handleTurnOffVisibility}
              isHidden={isHidden}
              aria-expanded={!isHidden}
            />
          </div>
        )}
        <section
          className={clsx(
            'flex w-full min-w-0 flex-col p-4 md:flex landscape:p-1',
            {
              ['overflow-hidden']: !isAccountPage,
              ['mx-auto max-w-5xl p-4 md:px-8 md:py-6 landscape:p-4']:
                isAccountPage,
            },
          )}
          aria-live='polite'
        >
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Layout;
