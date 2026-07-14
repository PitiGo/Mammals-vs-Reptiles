import { useCallback, useEffect, useState } from 'react';

function readLayout() {
  if (typeof window === 'undefined') {
    return { isMobile: false, isPortrait: false };
  }

  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const hasTouch = (navigator.maxTouchPoints || 0) > 0 || 'ontouchstart' in window;
  const mobileViewport = window.innerWidth <= 768;

  return {
    isMobile: (coarsePointer && hasTouch) || mobileViewport,
    isPortrait: window.innerHeight > window.innerWidth,
  };
}

export function useDeviceLayout() {
  const [layout, setLayout] = useState(readLayout);

  useEffect(() => {
    const update = () => setLayout(readLayout());
    const coarseQuery = window.matchMedia?.('(pointer: coarse)');

    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    window.visualViewport?.addEventListener('resize', update);
    coarseQuery?.addEventListener?.('change', update);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.visualViewport?.removeEventListener('resize', update);
      coarseQuery?.removeEventListener?.('change', update);
    };
  }, []);

  const requestLandscape = useCallback(async () => {
    if (typeof document === 'undefined') return false;

    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // iOS/Safari may reject fullscreen; the portrait overlay remains the fallback.
    }

    try {
      if (window.screen?.orientation?.lock) {
        await window.screen.orientation.lock('landscape');
        return true;
      }
    } catch {
      // Lock commonly requires fullscreen and is unsupported in iOS browser tabs.
    }

    return false;
  }, []);

  return { ...layout, requestLandscape };
}
