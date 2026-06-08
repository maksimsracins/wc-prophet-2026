import { Platform } from 'react-native';

export const AD_UNIT_IDS = {
  rewarded: {
    ios: 'ca-app-pub-7226425291757029/7508652057',
    android: 'ca-app-pub-7226425291757029/8459301876',
  },
  interstitial: {
    ios: 'ca-app-pub-7226425291757029/1043316050',
    android: 'ca-app-pub-7226425291757029/9772383548',
  },
  banner: {
    ios: 'ca-app-pub-7226425291757029/6195570380',
    android: 'ca-app-pub-7226425291757029/8131998813',
  },
  appOpen: {
    ios: 'ca-app-pub-7226425291757029/7417152713',
    android: 'ca-app-pub-7226425291757029/7613124064',
  },
} as const;

export const REWARDED_AD_UNIT_ID =
  Platform.OS === 'ios' ? AD_UNIT_IDS.rewarded.ios : AD_UNIT_IDS.rewarded.android;

export const INTERSTITIAL_AD_UNIT_ID =
  Platform.OS === 'ios' ? AD_UNIT_IDS.interstitial.ios : AD_UNIT_IDS.interstitial.android;

export const BANNER_AD_UNIT_ID =
  Platform.OS === 'ios' ? AD_UNIT_IDS.banner.ios : AD_UNIT_IDS.banner.android;

export const APP_OPEN_AD_UNIT_ID =
  Platform.OS === 'ios' ? AD_UNIT_IDS.appOpen.ios : AD_UNIT_IDS.appOpen.android;

// ─── Lazy-load so web/Expo Go don't crash ────────────────────────────────────
let _mobileAds: typeof import('react-native-google-mobile-ads') | null = null;

export async function getAds() {
  if (_mobileAds) return _mobileAds;
  try {
    _mobileAds = await import('react-native-google-mobile-ads');
    return _mobileAds;
  } catch {
    return null;
  }
}

export async function initializeAds(): Promise<void> {
  const ads = await getAds();
  if (!ads) return;
  try {
    await ads.default().initialize();
  } catch {
    // silently fail on web / unsupported platforms
  }
}

// ─── Rewarded Ad ─────────────────────────────────────────────────────────────

export type RewardedAdState = 'idle' | 'loading' | 'ready' | 'showing';

export interface RewardedAdHandle {
  show: () => Promise<boolean>;
  state: RewardedAdState;
}

export async function loadRewardedAd(): Promise<RewardedAdHandle | null> {
  const ads = await getAds();
  if (!ads) return null;

  const { RewardedAd, RewardedAdEventType } = ads;

  return new Promise(resolve => {
    const ad = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    let state: RewardedAdState = 'loading';
    let rewardEarned = false;

    const unsubLoad = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      state = 'ready';
      resolve({
        state,
        show: () =>
          new Promise<boolean>(res => {
            state = 'showing';
            rewardEarned = false;

            const unsubReward = ad.addAdEventListener(
              RewardedAdEventType.EARNED_REWARD,
              () => { rewardEarned = true; },
            );

            const unsubClose = ad.addAdEventListener(
              // @ts-ignore — 'closed' exists at runtime
              'closed',
              () => {
                unsubReward();
                unsubClose();
                state = 'idle';
                res(rewardEarned);
              },
            );

            ad.show().catch(() => { state = 'idle'; res(false); });
          }),
      });
      unsubLoad();
    });

    // @ts-ignore
    ad.addAdEventListener('error', () => {
      state = 'idle';
      resolve(null);
    });

    ad.load();
  });
}

// ─── Interstitial Ad ─────────────────────────────────────────────────────────

export interface InterstitialAdHandle {
  show: () => Promise<void>;
}

export async function loadInterstitialAd(): Promise<InterstitialAdHandle | null> {
  const ads = await getAds();
  if (!ads) return null;

  const { InterstitialAd, AdEventType } = ads;

  return new Promise(resolve => {
    const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    let resolved = false;

    const unsubLoad = ad.addAdEventListener(AdEventType.LOADED, () => {
      resolved = true;
      resolve({
        show: () =>
          new Promise<void>(res => {
            const unsubClose = ad.addAdEventListener(AdEventType.CLOSED, () => {
              unsubClose();
              res();
            });
            ad.show().catch(() => res());
          }),
      });
      unsubLoad();
    });

    ad.addAdEventListener(AdEventType.ERROR, () => {
      if (!resolved) resolve(null);
    });

    ad.load();
  });
}

// ─── App Open Ad ─────────────────────────────────────────────────────────────

export interface AppOpenAdHandle {
  show: () => Promise<void>;
}

export async function loadAppOpenAd(): Promise<AppOpenAdHandle | null> {
  const ads = await getAds();
  if (!ads) return null;

  const { AppOpenAd, AdEventType } = ads as any;
  if (!AppOpenAd) return null;

  return new Promise(resolve => {
    const ad = AppOpenAd.createForAdRequest(APP_OPEN_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    let resolved = false;

    const unsubLoad = ad.addAdEventListener(AdEventType.LOADED, () => {
      resolved = true;
      resolve({
        show: () =>
          new Promise<void>(res => {
            const unsubClose = ad.addAdEventListener(AdEventType.CLOSED, () => {
              unsubClose();
              res();
            });
            ad.show().catch(() => res());
          }),
      });
      unsubLoad();
    });

    ad.addAdEventListener(AdEventType.ERROR, () => {
      if (!resolved) resolve(null);
    });

    ad.load();
  });
}
