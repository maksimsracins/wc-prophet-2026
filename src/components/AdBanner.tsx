import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { BANNER_AD_UNIT_ID } from '../utils/ads';

export default function AdBanner() {
  const [loaded, setLoaded] = useState(false);
  const modRef = useRef<typeof import('react-native-google-mobile-ads') | null>(null);

  useEffect(() => {
    import('react-native-google-mobile-ads')
      .then(m => { modRef.current = m; setLoaded(true); })
      .catch(() => {});
  }, []);

  if (!loaded || !modRef.current) return null;

  const { BannerAd, BannerAdSize } = modRef.current;

  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}
