import type { RefObject } from 'react';

export const getRefs = (
  menuRef: RefObject<HTMLElement | null>,
  buttonRef: RefObject<HTMLElement | null>,
) => {
  const refs = [menuRef, buttonRef].filter(
    (ref): ref is RefObject<HTMLElement> => ref.current !== null,
  );

  return refs;
};
