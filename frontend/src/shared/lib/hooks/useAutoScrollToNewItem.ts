import { useEffect, useRef } from 'react';

export const useAutoScrollToNewItem = <T extends HTMLElement>(
  id: string,
  deps?: unknown[],
) => {
  const ref = useRef<T>(null);
  const prevStateRef = useRef({
    length: 0,
    id: '',
  });

  useEffect(() => {
    if (!deps?.length) return;

    if (prevStateRef.current.id === '') {
      prevStateRef.current = {
        length: deps.length,
        id,
      };
      return;
    }

    if (prevStateRef.current.id !== id) {
      prevStateRef.current = {
        length: deps.length,
        id,
      };

      ref.current?.firstElementChild?.scrollIntoView();
      return;
    }

    if (deps.length > prevStateRef.current.length) {
      ref.current?.lastElementChild?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }

    prevStateRef.current.length = deps.length;
  }, [deps, id]);

  return ref;
};
