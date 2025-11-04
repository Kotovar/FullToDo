import { useCallback, useState } from 'react';
import { ROUTES } from 'shared/routes';

type UseMenuToggleProps = {
  path: string;
};

export const useMenuToggle = ({ path }: UseMenuToggleProps) => {
  const [openMenuPath, setOpenMenuPath] = useState<string | null>(null);

  const toggleMenu = useCallback(() => {
    setOpenMenuPath(prev => (prev === path ? null : path));
  }, [path]);

  const closeMenu = useCallback(() => setOpenMenuPath(null), []);

  const isCurrentMenuOpen = openMenuPath === path;
  const isNotMainNotepad = path !== ROUTES.TASKS;

  return {
    isCurrentMenuOpen,
    isNotMainNotepad,
    menuMethods: {
      toggleMenu,
      closeMenu,
    },
  };
};
