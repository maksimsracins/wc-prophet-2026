import { useState, useEffect, useCallback, useRef } from 'react';
import { loadInterstitialAd, type InterstitialAdHandle } from '../utils/ads';

export function useInterstitialAd() {
  const [ready, setReady] = useState(false);
  const handleRef = useRef<InterstitialAdHandle | null>(null);

  const load = useCallback(async () => {
    setReady(false);
    const h = await loadInterstitialAd();
    if (h) {
      handleRef.current = h;
      setReady(true);
    } else {
      handleRef.current = null;
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const show = useCallback(async (): Promise<void> => {
    if (!handleRef.current) return;
    const h = handleRef.current;
    handleRef.current = null;
    setReady(false);
    await h.show();
    load();
  }, [load]);

  return { ready, show };
}
