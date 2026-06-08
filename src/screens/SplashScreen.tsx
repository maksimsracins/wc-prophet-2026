import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
  withDelay, withRepeat, withSequence, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import GoldButton from '../components/GoldButton';
import { useTournamentStore } from '../store/tournamentStore';

const { width: W, height: H } = Dimensions.get('window');

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const startGame = useTournamentStore(s => s.startGame);

  // Entrance animations
  const trophyScale = useSharedValue(0.4);
  const trophyRotate = useSharedValue(-12);
  const headlineY = useSharedValue(40);
  const headlineOpacity = useSharedValue(0);
  const subY = useSharedValue(20);
  const subOpacity = useSharedValue(0);
  const ctaOpacity = useSharedValue(0);
  const ctaY = useSharedValue(16);

  // Ambient pulse circles
  const pulse1 = useSharedValue(0.3);
  const pulse2 = useSharedValue(0.5);
  const pulse3 = useSharedValue(0.2);

  // Floating trophy
  const trophyFloat = useSharedValue(0);

  useEffect(() => {
    trophyScale.value = withSpring(1, { damping: 14, stiffness: 120 });
    trophyRotate.value = withSpring(0, { damping: 14, stiffness: 120 });

    headlineY.value = withDelay(200, withSpring(0, { damping: 16, stiffness: 160 }));
    headlineOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));

    subY.value = withDelay(450, withSpring(0, { damping: 16, stiffness: 160 }));
    subOpacity.value = withDelay(450, withTiming(1, { duration: 400 }));

    ctaOpacity.value = withDelay(700, withTiming(1, { duration: 400 }));
    ctaY.value = withDelay(700, withSpring(0, { damping: 16, stiffness: 160 }));

    // Ambient pulses
    pulse1.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      ), -1, false,
    );
    pulse2.value = withDelay(1000, withRepeat(
      withSequence(
        withTiming(0.8, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.2, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      ), -1, false,
    ));
    pulse3.value = withDelay(500, withRepeat(
      withSequence(
        withTiming(0.6, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.15, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
      ), -1, false,
    ));

    // Gentle trophy float
    trophyFloat.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(8, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ), -1, true,
    );
  }, []);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: trophyScale.value },
      { rotate: `${trophyRotate.value}deg` },
      { translateY: trophyFloat.value },
    ],
  }));

  const headlineStyle = useAnimatedStyle(() => ({
    opacity: headlineOpacity.value,
    transform: [{ translateY: headlineY.value }],
  }));

  const subStyle = useAnimatedStyle(() => ({
    opacity: subOpacity.value,
    transform: [{ translateY: subY.value }],
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaY.value }],
  }));

  const p1Style = useAnimatedStyle(() => ({ opacity: pulse1.value }));
  const p2Style = useAnimatedStyle(() => ({ opacity: pulse2.value }));
  const p3Style = useAnimatedStyle(() => ({ opacity: pulse3.value }));

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Ambient blur circles */}
      <Animated.View style={[styles.pulseCircle, styles.pulse1, p1Style]} />
      <Animated.View style={[styles.pulseCircle, styles.pulse2, p2Style]} />
      <Animated.View style={[styles.pulseCircle, styles.pulse3, p3Style]} />

      {/* Content */}
      <View style={styles.content}>
        {/* Trophy */}
        <Animated.Text style={[styles.trophy, trophyStyle]}>🏆</Animated.Text>

        {/* Headline */}
        <Animated.View style={headlineStyle}>
          <Text style={styles.year}>2026</Text>
          <Text style={styles.headline}>WORLD CUP</Text>
          <Text style={styles.subheadline}>PROPHET</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, subStyle]}>
          Who takes the trophy?{'\n'}You decide.
        </Animated.Text>

        {/* Gold divider */}
        <Animated.View style={[styles.divider, subStyle]} />

        {/* Facts */}
        <Animated.View style={[styles.facts, subStyle]}>
          <FactBubble emoji="🌍" text="48 Nations" />
          <FactBubble emoji="⚽" text="104 Matches" />
          <FactBubble emoji="👑" text="1 Champion" />
        </Animated.View>
      </View>

      {/* CTA */}
      <Animated.View style={[styles.ctaContainer, ctaStyle]}>
        <GoldButton label="START PREDICTING" onPress={startGame} />
        <Text style={styles.ctaHint}>72 group matches · full bracket</Text>
      </Animated.View>
    </View>
  );
}

function FactBubble({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={styles.factBubble}>
      <Text style={styles.factEmoji}>{emoji}</Text>
      <Text style={styles.factText}>{text}</Text>
    </View>
  );
}

const CIRCLE_BASE = {
  position: 'absolute' as const,
  borderRadius: 9999,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pulseCircle: {
    ...CIRCLE_BASE,
  },
  pulse1: {
    width: W * 0.9,
    height: W * 0.9,
    top: -W * 0.1,
    left: -W * 0.1,
    backgroundColor: 'rgba(212,175,55,0.04)',
    // blur simulated via large border radius and low opacity
  },
  pulse2: {
    width: W * 1.1,
    height: W * 1.1,
    bottom: -W * 0.3,
    right: -W * 0.2,
    backgroundColor: 'rgba(212,175,55,0.03)',
  },
  pulse3: {
    width: W * 0.6,
    height: W * 0.6,
    top: H * 0.3,
    left: W * 0.1,
    backgroundColor: 'rgba(46,204,113,0.025)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  trophy: {
    fontSize: 100,
    lineHeight: 116,
  },
  year: {
    fontFamily: FONTS.display,
    fontSize: 20,
    color: COLORS.gold,
    letterSpacing: 8,
    textAlign: 'center',
  },
  headline: {
    fontFamily: FONTS.display,
    fontSize: 64,
    color: COLORS.textPrimary,
    letterSpacing: 4,
    textAlign: 'center',
    lineHeight: 68,
  },
  subheadline: {
    fontFamily: FONTS.display,
    fontSize: 64,
    color: COLORS.gold,
    letterSpacing: 4,
    textAlign: 'center',
    lineHeight: 68,
  },
  tagline: {
    fontFamily: FONTS.body,
    fontSize: 17,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 26,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.full,
    opacity: 0.5,
  },
  facts: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  factBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  factEmoji: { fontSize: 14 },
  factText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  ctaContainer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    width: '100%',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  ctaHint: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
});
