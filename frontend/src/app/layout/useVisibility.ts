import { useState } from 'react';

const DESKTOP_WIDTH = 768;

export const useVisibility = () => {
  const [isHidden, setIsHidden] = useState(false);

  const handleVisibility = () => setIsHidden(prev => !prev);
  const turnOffVisibility = () => {
    if (window.innerWidth < DESKTOP_WIDTH) {
      setIsHidden(true);
    }
  };

  return [isHidden, handleVisibility, turnOffVisibility] as const;
};
