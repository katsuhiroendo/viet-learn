import { useState, useEffect } from 'react';

const MD_BREAKPOINT = 768;

export function useWindowSize() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= MD_BREAKPOINT;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= MD_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    // Check immediately on mount
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isDesktop };
}
