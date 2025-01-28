import { Outlet } from 'react-router';
import { clsx } from 'clsx';
import { Header } from '@widgets/Header';
import { NavigationBar } from '@widgets/NavigationBar';
import { useState } from 'react';

export const Layout = () => {
  const [isHidden, setIsHidden] = useState(false);

  const handleVisibility = () => setIsHidden(prev => !prev);
  const turnOffVisibility = () => {
    if (window.innerWidth < 768) {
      setIsHidden(true);
    }
  };

  return (
    <div className='font-display bg-grey-light h-screen'>
      <Header
        className={clsx(
          'bg-accent fixed z-10 flex h-16 w-full items-center justify-between gap-x-1 px-2',
        )}
        changeVisibility={handleVisibility}
      />
      <div
        className={clsx(
          'bg-grey-light text-dark relative flex h-full w-full gap-2 pt-16 text-2xl',
        )}
      >
        <NavigationBar
          className={clsx(
            'flex flex-auto bg-white p-4 break-all md:w-[30%] md:flex-none',
            {
              ['hidden']: isHidden,
            },
          )}
          changeVisibility={turnOffVisibility}
        />
        <main
          className={clsx('flex-auto flex-col p-4 md:w-full', {
            ['hidden md:flex']: !isHidden,
          })}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
