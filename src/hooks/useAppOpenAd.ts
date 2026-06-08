import { useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import { loadAppOpenAd, type AppOpenAdHandle } from '../utils/ads';

export function useAppOpenAd() {
  const handleRef = useRef<AppOpenAdHandle | null>(null);
  const isShowing = useRef(false);
  const foregroundCount = useRef(0);

  const load = useCallback(async () => {
    const h = await loadAppOpenAd();
    handleRef.current = h;
  }, []);

  const tryShow = useCallback(async () => {
    if (isShowing.current || !handleRef.current) return;
    isShowing.current = true;
    await handleRef.current.show();
    handleRef.current = null;
    isShowing.current = false;
    load();
  }, [load]);

  useEffect(() => {
    load();

    const sub = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        foregroundCount.current += 1;
        // Skip first foreground (app launch), show on every subsequent resume
        if (foregroundCount.current > 1) {
          tryShow();
        }
      }
    });

    return () => sub.remove();
  }, [load, tryShow]);
}
