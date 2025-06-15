import { RefObject, useEffect } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

export const useFocusTrap = (
  menuRef: RefObject<HTMLElement | null>,
  buttonRef: RefObject<HTMLElement | null>,
  closeMenu: () => void,
) => {
  useOnClickOutside(
    [menuRef as RefObject<HTMLElement>, buttonRef as RefObject<HTMLElement>],
    closeMenu,
  );

  useEffect(() => {
    const menu = menuRef.current;

    if (!menu) return;

    const focusableElements = Array.from(
      menu.querySelectorAll<HTMLElement>('button, input'),
    );

    if (focusableElements.length < 2) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;

      if (e.key === 'Tab') {
        if (!e.shiftKey && activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        } else if (e.shiftKey && activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else if (e.key === 'Escape') {
        closeMenu();
      }
    };

    firstElement.focus();
    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeMenu, menuRef]);
};
