import { useDarkMode } from '@shared/lib';

export const useDarkToast = () => {
  const { isDarkMode } = useDarkMode();

  return {
    theme: isDarkMode ? 'dark' : 'light',
  };
};
