import { useCallback, useEffect, useRef, useState } from 'react';
import { ROUTES } from 'shared/routes';
import type { OptionsMenuPosition } from '../../OptionsMenu/constants';

type UseMenuToggleProps = {
  path: string;
};

const MENU_ANIMATION_DURATION = 180;
const OPTIONS_MENU_MIN_SPACE_PX = 120;

export const useMenuToggle = ({ path }: UseMenuToggleProps) => {
  const [openMenuPath, setOpenMenuPath] = useState<string | null>(null);
  const [closingMenuPath, setClosingMenuPath] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] =
    useState<OptionsMenuPosition>('bottom');
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMenu = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setClosingMenuPath(path);

    closeTimerRef.current = setTimeout(() => {
      setOpenMenuPath(null);
      setClosingMenuPath(null);
      closeTimerRef.current = null;
    }, MENU_ANIMATION_DURATION);
  }, [path]);

  const toggleMenu = useCallback(
    (button: HTMLButtonElement | null) => {
      if (openMenuPath === path) {
        closeMenu();
        return;
      }

      if (button) {
        const rect = button.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        if (spaceBelow >= OPTIONS_MENU_MIN_SPACE_PX) {
          setMenuPosition('bottom');
        } else if (spaceAbove >= OPTIONS_MENU_MIN_SPACE_PX) {
          setMenuPosition('top');
        } else {
          setMenuPosition(spaceBelow >= spaceAbove ? 'bottom' : 'top');
        }
      }

      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }

      setClosingMenuPath(null);
      setOpenMenuPath(path);
    },
    [closeMenu, openMenuPath, path],
  );

  const isCurrentMenuOpen = openMenuPath === path;
  const isClosingMenu = closingMenuPath === path;
  const isNotMainNotepad = path !== ROUTES.tasks.base;

  useEffect(
    () => () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  return {
    isCurrentMenuOpen,
    isClosingMenu,
    isNotMainNotepad,
    menuPosition,
    menuMethods: {
      toggleMenu,
      closeMenu,
    },
  };
};
