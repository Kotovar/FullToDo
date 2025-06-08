import { clsx } from 'clsx';

export const getToastClassName = (isDarkMode: boolean) =>
  clsx(
    'relative flex p-4 min-h-10 rounded-md cursor-pointer border-1 text-dark',
    {
      'bg-accent border-dark': isDarkMode,
      'bg-light border-accent': !isDarkMode,
    },
  );
