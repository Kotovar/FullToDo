import { type RefObject, useCallback, useState } from 'react';
import type { VirtuosoHandle } from 'react-virtuoso';

const SCROLL_TO_TOP_THRESHOLD = 8;

export const useScrollToTopButton = (
  virtuosoRef: RefObject<VirtuosoHandle | null>,
) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleRangeChanged = useCallback((range: { startIndex: number }) => {
    setIsVisible(range.startIndex >= SCROLL_TO_TOP_THRESHOLD);
  }, []);

  const handleScrollToTop = useCallback(() => {
    virtuosoRef.current?.scrollToIndex({
      index: 0,
      behavior: 'smooth',
      align: 'start',
    });
  }, [virtuosoRef]);

  return {
    isVisible,
    handleRangeChanged,
    handleScrollToTop,
  };
};
