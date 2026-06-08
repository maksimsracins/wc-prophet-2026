// Web stub — react-native-google-mobile-ads is native only.
// Metro uses this file on web instead of ads.ts.

export const AD_UNIT_IDS = {
  rewarded:     { ios: '', android: '' },
  interstitial: { ios: '', android: '' },
  banner:       { ios: '', android: '' },
  appOpen:      { ios: '', android: '' },
} as const;

export const REWARDED_AD_UNIT_ID     = '';
export const INTERSTITIAL_AD_UNIT_ID = '';
export const BANNER_AD_UNIT_ID       = '';
export const APP_OPEN_AD_UNIT_ID     = '';

export async function getAds()        { return null; }
export async function initializeAds() {}

export type RewardedAdState = 'idle' | 'loading' | 'ready' | 'showing';
export interface RewardedAdHandle { show: () => Promise<boolean>; state: RewardedAdState; }
export async function loadRewardedAd(): Promise<RewardedAdHandle | null> { return null; }

export interface InterstitialAdHandle { show: () => Promise<void>; }
export async function loadInterstitialAd(): Promise<InterstitialAdHandle | null> { return null; }

export interface AppOpenAdHandle { show: () => Promise<void>; }
export async function loadAppOpenAd(): Promise<AppOpenAdHandle | null> { return null; }
