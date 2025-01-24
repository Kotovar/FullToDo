import BurgerIcon from './burger.svg?react';
import SearchIcon from './loupe-search.svg?react';
import LightThemeIcon from './light-theme.svg?react';
import RuFlagIcon from './flag-ru.svg?react';

export const Header = () => {
  return (
    <header className='bg-accent flex items-center justify-between gap-x-1 px-1 sm:col-span-3'>
      <div>
        <button type='button' className='flex p-1'>
          <BurgerIcon className='h-8 w-8' />
        </button>
      </div>
      <div className='flex h-10 w-full items-center gap-x-1 rounded-xl bg-white px-2 sm:w-[60%]'>
        <SearchIcon className='h-6 w-6' />
        <input className='w-full outline-0' type='search' placeholder='Поиск' />
      </div>
      <div className='flex gap-x-2'>
        <button type='button' className='flex items-center gap-x-1 px-1'>
          <RuFlagIcon className='h-6 w-6' />
          <span className='text-white'>Русский</span>
        </button>
        <button
          type='button'
          className='hover:border-accent-hover flex items-center gap-x-2 rounded-xl border-1 border-transparent p-1'
        >
          <LightThemeIcon className='h-6 w-6' />
        </button>
      </div>
    </header>
  );
};
