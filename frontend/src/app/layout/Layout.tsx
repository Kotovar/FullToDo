import { Outlet } from 'react-router';
import { Header } from '@widgets/Header';

import { NavigationBar } from '@widgets/NavigationBar';

export const Layout = () => {
  return (
    <div className='font-display grid h-screen grid-cols-1 grid-rows-[4rem_1fr] sm:grid-cols-3'>
      <Header />
      <NavigationBar />
      <main className='bg-background text-text col-span-3 flex flex-col justify-start p-4 text-2xl sm:col-span-2'>
        <Outlet />
      </main>
    </div>
  );
};
