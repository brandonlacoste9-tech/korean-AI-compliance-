import { useEffect } from 'react';

export const usePerformance = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = '/pricing';
        document.head.appendChild(link);
      });
    }
  }, []);
};
