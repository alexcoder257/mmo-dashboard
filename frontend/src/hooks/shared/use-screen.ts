import { useEffect, useState } from 'react';

import { BREAK_POINT_MOBILE } from '@/constants/shared.const';

const useScreen = (breakpoint: number = BREAK_POINT_MOBILE): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.matchMedia(`(max-width: ${breakpoint}px)`).matches);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useScreen;
