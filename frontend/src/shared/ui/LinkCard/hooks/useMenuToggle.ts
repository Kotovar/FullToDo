import { useCallback, useState } from 'react';
import { ROUTES } from 'shared/routes';

type UseMenuToggleProps = {
  path: string;
  currentModalId: string;
  handleModalId: (id: string) => void;
};

export const useMenuToggle = ({
  path,
  currentModalId,
  handleModalId,
}: UseMenuToggleProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const toggleMenu = useCallback(() => {
    handleModalId(path);
    setIsMenuOpen(prev => !prev);
  }, [handleModalId, path]);

  const isCurrentMenuOpen = isMenuOpen && currentModalId === path;
  const isNotMainNotepad = path !== ROUTES.TASKS;

  return {
    isCurrentMenuOpen,
    isNotMainNotepad,
    menuMethods: {
      closeMenu,
      toggleMenu,
    },
  };
};
