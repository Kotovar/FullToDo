import { useCallback, useLayoutEffect, useMemo } from 'react';
import { useLocalStorage, useMediaQuery } from 'usehooks-ts';
import { COLORS } from '@shared/ui';

const LOCAL_STORAGE_KEY = 'dark-mode';
const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

type DarkModeOptions = {
  localStorageKey?: string;
};

type DarkModeReturn = {
  isDarkMode: boolean;
  fill: string;
  toggle: () => void;
};

export function useDarkMode({
  localStorageKey = LOCAL_STORAGE_KEY,
}: DarkModeOptions = {}): DarkModeReturn {
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);

  const [isDarkMode, setDarkMode] = useLocalStorage<boolean>(
    localStorageKey,
    isDarkOS,
  );

  useLayoutEffect(() => {
    const html = document.documentElement;

    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggle = useCallback(() => setDarkMode(prev => !prev), [setDarkMode]);
  const fill = useMemo(
    () => (isDarkMode ? COLORS.ACCENT_DARK : COLORS.ACCENT),
    [isDarkMode],
  );

  return {
    isDarkMode,
    fill,
    toggle,
  };
}
