import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { useRewardedAd } from '../hooks/useRewardedAd';

interface Props {
  label: string;
  rewardLabel?: string;        // shown in the "watch ad to unlock" badge
  onRewarded: () => void;      // called only if user earns the reward
  onFallback?: () => void;     // called when ads unavailable (graceful fallback)
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function RewardedShareButton({
  label,
  rewardLabel = 'Watch a short ad to unlock',
  onRewarded,
  onFallback,
}: Props) {
  const { status, showAd } = useRewardedAd();
  const [showing, setShowing] = useState(false);
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = async () => {
    if (showing) return;

    if (status === 'unavailable') {
      onFallback?.();
      return;
    }

    setShowing(true);
    const earned = await showAd();
    setShowing(false);

    if (earned) {
      onRewarded();
    }
  };

  const isLoading = status === 'loading' || showing;

  return (
    <View style={styles.wrapper}>
      <AnimatedPressable
        style={[styles.button, isLoading && styles.buttonDim, animStyle]}
        onPressIn={() => { scale.value = withSpring(0.96, { damping: 15, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
        onPress={handlePress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.gold} size="small" />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </AnimatedPressable>

      {status !== 'unavailable' && (
        <View style={styles.adBadge}>
          <Text style={styles.adIcon}>▶</Text>
          <Text style={styles.adLabel}>{rewardLabel}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    backgroundColor: COLORS.goldDim,
    minHeight: 52,
  },
  buttonDim: {
    opacity: 0.6,
  },
  label: {
    fontFamily: FONTS.display,
    fontSize: 17,
    color: COLORS.gold,
    letterSpacing: 1.5,
  },
  adBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  adIcon: {
    fontSize: 8,
    color: COLORS.textMuted,
  },
  adLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
});
