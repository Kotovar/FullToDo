import { Outlet } from 'react-router';
import { Header } from '@widgets/Header';
import { NavigationBar } from '@widgets/NavigationBar';

export const Layout = () => {
  return (
    <div className='font-display grid h-screen grid-cols-[16vw_1fr_16vw] grid-rows-[5.5vh_1fr]'>
      <Header />
      <NavigationBar />
      <main className='bg-background col-span-2 col-start-2'>
        <Outlet />
      </main>
    </div>
  );
};
