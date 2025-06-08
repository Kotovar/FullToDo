import { useCallback } from 'react';
import { useDarkMode } from '@shared/lib';
import { getToastClassName } from './getToastClassName';

export const useDarkToast = () => {
  const { isDarkMode } = useDarkMode();
  const toastClassName = useCallback(
    () => getToastClassName(isDarkMode),
    [isDarkMode],
  );

  return {
    toastClassName,
    theme: isDarkMode ? 'dark' : 'light',
  };
};
