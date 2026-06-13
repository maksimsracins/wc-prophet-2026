import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Share } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
  withDelay, withRepeat, withSequence, Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { useTournamentStore } from '../store/tournamentStore';
import { TEAMS } from '../data/teams';
import GoldButton from '../components/GoldButton';
import RewardedShareButton from '../components/RewardedShareButton';

export default function FinalScreen() {
  const insets = useSafeAreaInsets();
  const { champion, resetGame } = useTournamentStore();
  const team = champion ? TEAMS[champion] : null;

  const crownScale = useSharedValue(0);
  const crownOpacity = useSharedValue(0);
  const crownRotate = useSharedValue(-20);
  const flagScale = useSharedValue(0.5);
  const flagOpacity = useSharedValue(0);
  const nameY = useSharedValue(40);
  const nameOpacity = useSharedValue(0);
  const ctaOpacity = useSharedValue(0);

  // Crown float
  const crownFloat = useSharedValue(0);

  // Confetti particles
  const confettiOpacity = useSharedValue(0);

  useEffect(() => {
    // Crown drops in
    crownScale.value = withDelay(200, withSpring(1, { damping: 8, stiffness: 120 }));
    crownOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    crownRotate.value = withDelay(200, withSpring(0, { damping: 12, stiffness: 160 }));

    // Flag appears
    flagScale.value = withDelay(600, withSpring(1, { damping: 12, stiffness: 180 }));
    flagOpacity.value = withDelay(600, withTiming(1, { duration: 400 }));

    // Name rises
    nameY.value = withDelay(900, withSpring(0, { damping: 14, stiffness: 160 }));
    nameOpacity.value = withDelay(900, withTiming(1, { duration: 500 }));

    // CTA fades in
    ctaOpacity.value = withDelay(1300, withTiming(1, { duration: 600 }));

    // Confetti burst
    confettiOpacity.value = withDelay(400, withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0.6, { duration: 1000 }),
    ));

    // Crown floats
    crownFloat.value = withDelay(800, withRepeat(
      withSequence(
        withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(10, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      ), -1, true,
    ));
  }, []);

  const crownStyle = useAnimatedStyle(() => ({
    opacity: crownOpacity.value,
    transform: [
      { scale: crownScale.value },
      { rotate: `${crownRotate.value}deg` },
      { translateY: crownFloat.value },
    ],
  }));

  const flagStyle = useAnimatedStyle(() => ({
    opacity: flagOpacity.value,
    transform: [{ scale: flagScale.value }],
  }));

  const nameStyle = useAnimatedStyle(() => ({
    opacity: nameOpacity.value,
    transform: [{ translateY: nameY.value }],
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
  }));

  const confettiStyle = useAnimatedStyle(() => ({
    opacity: confettiOpacity.value,
  }));

  const handleShare = () => {
    if (!team) return;
    Share.share({
      message: `👑 I predict ${team.name} will win the 2026 World Cup! Can you beat my bracket? #WCProphet2026 #WorldCup2026`,
    });
  };

  if (!team) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Confetti overlay (text-based) */}
      <Animated.Text style={[styles.confetti, confettiStyle]}>
        🎊 🎉 🏆 ✨ 🎊 🎉 ⭐ 🌟 🎊 🎉
      </Animated.Text>

      <View style={styles.content}>
        {/* Crown */}
        <Animated.Text style={[styles.crown, crownStyle]}>👑</Animated.Text>

        {/* Flag */}
        <Animated.Text style={[styles.flag, flagStyle]}>{team.flag}</Animated.Text>

        {/* Team info */}
        <Animated.View style={[styles.teamBlock, nameStyle]}>
          <Text style={styles.yourPrediction}>YOUR PREDICTED CHAMPION</Text>
          <Text style={styles.teamName}>{team.name.toUpperCase()}</Text>
          <Text style={styles.teamFact}>"{team.wildFact}"</Text>
        </Animated.View>

        {/* Trophy card */}
        <Animated.View style={[styles.trophyCard, nameStyle]}>
          <Text style={styles.trophyCardLabel}>BEST RESULT BEFORE 2026</Text>
          <Text style={styles.trophyCardValue}>{team.bestResult}</Text>

          <View style={styles.divider} />

          <Text style={styles.trophyCardLabel}>WORLD RANKING</Text>
          <Text style={styles.trophyCardValue}>#{team.fifaRank} in the world</Text>
        </Animated.View>
      </View>

      {/* Actions */}
      <Animated.View style={[styles.actions, ctaStyle]}>
        <RewardedShareButton
          label="🏆  EXPORT CHAMPION CARD"
          onRewarded={handleShare}
          onFallback={handleShare}
        />
        <GoldButton label="START OVER" onPress={resetGame} variant="outline" />
        <Text style={styles.shareHint}>Share your pick · WC Prophet 2026</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'space-between',
  },
  confetti: {
    position: 'absolute',
    top: 60,
    width: '100%',
    textAlign: 'center',
    fontSize: 28,
    letterSpacing: 4,
    flexWrap: 'wrap',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  crown: {
    fontSize: 72,
    lineHeight: 84,
  },
  flag: {
    fontSize: 96,
    lineHeight: 108,
  },
  teamBlock: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  yourPrediction: {
    fontFamily: FONTS.display,
    fontSize: 12,
    color: COLORS.gold,
    letterSpacing: 3,
  },
  teamName: {
    fontFamily: FONTS.display,
    fontSize: 52,
    color: COLORS.textPrimary,
    letterSpacing: 3,
    textAlign: 'center',
    lineHeight: 58,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  teamFact: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
    maxWidth: 280,
  },
  trophyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
    padding: SPACING.lg,
    width: '100%',
    gap: SPACING.xs,
  },
  trophyCardLabel: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 2,
  },
  trophyCardValue: {
    fontFamily: FONTS.display,
    fontSize: 18,
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },
  actions: {
    padding: SPACING.lg,
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'stretch',
  },
  shareHint: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
