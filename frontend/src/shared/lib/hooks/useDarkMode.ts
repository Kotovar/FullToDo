import { useLayoutEffect } from 'react';
import { useLocalStorage, useMediaQuery } from 'usehooks-ts';

const LOCAL_STORAGE_KEY = 'dark-mode';
const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

type DarkModeOptions = {
  localStorageKey?: string;
};

type DarkModeReturn = {
  isDarkMode: boolean;
  toggle: () => void;
};

export function useDarkMode({
  localStorageKey = LOCAL_STORAGE_KEY,
}: DarkModeOptions = {}): DarkModeReturn {
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);

  const [isDarkMode, setDarkMode] = useLocalStorage<boolean>(
    localStorageKey,
    isDarkOS ?? false,
  );

  useLayoutEffect(() => {
    const html = document.documentElement;

    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDarkMode]);

  return {
    isDarkMode,
    toggle: () => setDarkMode(prev => !prev),
  };
}
