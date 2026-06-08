import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
  withSequence, withDelay, runOnJS, Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';
import { TEAMS, type Team } from '../data/teams';
import type { Match } from '../data/tournament';

const { width: SCREEN_W } = Dimensions.get('window');

interface Props {
  match: Match;
  onPick: (matchId: string, winnerId: string) => void;
}

export default function MatchCard({ match, onPick }: Props) {
  const teamA = TEAMS[match.teamA];
  const teamB = TEAMS[match.teamB];

  const cardOpacity = useSharedValue(1);
  const cardTranslateX = useSharedValue(0);
  const scaleA = useSharedValue(1);
  const scaleB = useSharedValue(1);
  const opacityA = useSharedValue(1);
  const opacityB = useSharedValue(1);
  const borderA = useSharedValue(0);
  const borderB = useSharedValue(0);

  const animateAndPick = useCallback((winnerId: string) => {
    'worklet';
    const isA = winnerId === match.teamA;
    const direction = isA ? -1 : 1;

    // Winner expands, loser fades
    if (isA) {
      scaleA.value = withSpring(1.04, { damping: 12, stiffness: 280 });
      scaleB.value = withTiming(0.94, { duration: 250 });
      opacityA.value = withTiming(1);
      opacityB.value = withTiming(0.35, { duration: 250 });
      borderA.value = withTiming(1, { duration: 200 });
    } else {
      scaleB.value = withSpring(1.04, { damping: 12, stiffness: 280 });
      scaleA.value = withTiming(0.94, { duration: 250 });
      opacityB.value = withTiming(1);
      opacityA.value = withTiming(0.35, { duration: 250 });
      borderB.value = withTiming(1, { duration: 200 });
    }

    // Slide card off screen after brief pause
    cardTranslateX.value = withDelay(
      380,
      withTiming(direction * SCREEN_W * 1.2, {
        duration: 340,
        easing: Easing.in(Easing.cubic),
      }),
    );
    cardOpacity.value = withDelay(
      520,
      withTiming(0, { duration: 200 }, () => {
        runOnJS(onPick)(match.id, winnerId);
      }),
    );
  }, [match.id, match.teamA, match.teamB]);

  const handlePickA = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    animateAndPick(match.teamA);
  }, [match.teamA, animateAndPick]);

  const handlePickB = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    animateAndPick(match.teamB);
  }, [match.teamB, animateAndPick]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateX: cardTranslateX.value }],
  }));

  const teamAStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleA.value }],
    opacity: opacityA.value,
    borderColor: `rgba(212,175,55,${borderA.value * 0.6})`,
    borderWidth: borderA.value > 0.1 ? 1.5 : 1,
  }));

  const teamBStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleB.value }],
    opacity: opacityB.value,
    borderColor: `rgba(212,175,55,${borderB.value * 0.6})`,
    borderWidth: borderB.value > 0.1 ? 1.5 : 1,
  }));

  if (!teamA || !teamB) return null;

  return (
    <Animated.View style={[styles.card, cardStyle]}>
      {/* Team A */}
      <TeamTile
        team={teamA}
        animStyle={teamAStyle}
        onPress={handlePickA}
      />

      {/* VS divider */}
      <View style={styles.vsRow}>
        <View style={styles.vsDivider} />
        <View style={styles.vsBadge}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <View style={styles.vsDivider} />
      </View>

      {/* Team B */}
      <TeamTile
        team={teamB}
        animStyle={teamBStyle}
        onPress={handlePickB}
      />
    </Animated.View>
  );
}

interface TileProps {
  team: Team;
  animStyle: ReturnType<typeof useAnimatedStyle>;
  onPress: () => void;
}

function TeamTile({ team, animStyle, onPress }: TileProps) {
  const pressScale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => { pressScale.value = withSpring(0.97, { damping: 20, stiffness: 400 }); }}
      onPressOut={() => { pressScale.value = withSpring(1, { damping: 20, stiffness: 400 }); }}
      onPress={onPress}
      style={styles.tilePressable}
    >
      <Animated.View style={[styles.tile, animStyle, pressStyle]}>
        {/* Flag */}
        <Text style={styles.flag}>{team.flag}</Text>

        {/* Team info */}
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{team.name.toUpperCase()}</Text>
          <Text style={styles.teamShort}>{team.shortName}</Text>
          <View style={styles.statsRow}>
            <StatBadge label="RANK" value={`#${team.fifaRank}`} />
            <StatBadge label="BEST" value={team.bestResult.split(' ')[0]} />
            <StatBadge label="" value={team.confederation} accent />
          </View>
          <Text style={styles.wildFact} numberOfLines={2}>"{team.wildFact}"</Text>
        </View>

        {/* Tap hint arrow */}
        <View style={styles.tapHint}>
          <Text style={styles.tapHintText}>TAP</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

function StatBadge({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={[styles.badge, accent && styles.badgeAccent]}>
      {label ? <Text style={styles.badgeLabel}>{label}</Text> : null}
      <Text style={[styles.badgeValue, accent && styles.badgeValueAccent]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    gap: 0,
  },
  tilePressable: {
    width: '100%',
  },
  tile: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    ...SHADOW.card,
  },
  flag: {
    fontSize: 64,
    lineHeight: 72,
  },
  teamInfo: {
    flex: 1,
    gap: SPACING.xs,
  },
  teamName: {
    fontFamily: FONTS.display,
    fontSize: 26,
    color: COLORS.textPrimary,
    letterSpacing: 1,
    lineHeight: 30,
  },
  teamShort: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  badgeAccent: {
    backgroundColor: COLORS.goldDim,
  },
  badgeLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 9,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  badgeValue: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  badgeValueAccent: {
    color: COLORS.gold,
  },
  wildFact: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },
  tapHint: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
  },
  tapHintText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 9,
    color: COLORS.gold,
    letterSpacing: 1,
  },
  vsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    marginVertical: -2,
    zIndex: 10,
  },
  vsDivider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  vsBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bg,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.sm,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  vsText: {
    fontFamily: FONTS.display,
    fontSize: 16,
    color: COLORS.gold,
    letterSpacing: 1,
  },
});
