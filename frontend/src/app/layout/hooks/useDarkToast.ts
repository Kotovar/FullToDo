import { useMemo } from 'react';
import clsx from 'clsx';
import { useDarkMode } from '@shared/lib';

const getToastClassName = (isDarkMode: boolean) =>
  clsx('relative flex p-4 min-h-10 rounded-md cursor-pointer text-dark', {
    'bg-accent': isDarkMode,
    'bg-light': !isDarkMode,
  });

export const useDarkToast = () => {
  const { isDarkMode } = useDarkMode();
  const toastClassName = useMemo(
    () => getToastClassName(isDarkMode),
    [isDarkMode],
  );

  return {
    theme: isDarkMode ? 'dark' : 'light',
    toastClassName,
  };
};
