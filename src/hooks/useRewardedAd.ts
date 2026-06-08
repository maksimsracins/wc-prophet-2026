import { useState, useEffect, useCallback } from 'react';
import { loadRewardedAd, type RewardedAdHandle } from '../utils/ads';

export type AdStatus = 'loading' | 'ready' | 'unavailable';

export function useRewardedAd() {
  const [handle, setHandle] = useState<RewardedAdHandle | null>(null);
  const [status, setStatus] = useState<AdStatus>('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    const h = await loadRewardedAd();
    if (h) {
      setHandle(h);
      setStatus('ready');
    } else {
      setHandle(null);
      setStatus('unavailable');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const showAd = useCallback(async (): Promise<boolean> => {
    if (!handle) return false;
    const earned = await handle.show();
    // Pre-load next ad after showing
    load();
    return earned;
  }, [handle, load]);

  return { status, showAd };
}
