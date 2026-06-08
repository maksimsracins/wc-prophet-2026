import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Share } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
  withDelay, withSequence,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { useTournamentStore } from '../store/tournamentStore';
import { GROUPS, calculateGroupStandings } from '../data/tournament';
import { TEAMS } from '../data/teams';
import FlagChip from '../components/FlagChip';
import GoldButton from '../components/GoldButton';
import RewardedShareButton from '../components/RewardedShareButton';
import { useInterstitialAd } from '../hooks/useInterstitialAd';

export default function StageCompleteScreen() {
  const insets = useSafeAreaInsets();
  const { currentGroupIndex, acknowledgeStageComplete, picks } = useTournamentStore();
  const { ready: interstitialReady, show: showInterstitial } = useInterstitialAd();

  const allGroupsDone = currentGroupIndex >= GROUPS.length - 1;
  const group = GROUPS[currentGroupIndex];

  const stampScale = useSharedValue(2);
  const stampOpacity = useSharedValue(0);
  const stampRotate = useSharedValue(-8);
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(30);

  useEffect(() => {
    stampScale.value = withSpring(1, { damping: 10, stiffness: 180 });
    stampOpacity.value = withTiming(1, { duration: 300 });
    stampRotate.value = withSpring(0, { damping: 12, stiffness: 200 });

    contentOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    contentY.value = withDelay(400, withSpring(0, { damping: 16, stiffness: 160 }));
  }, []);

  const stampStyle = useAnimatedStyle(() => ({
    opacity: stampOpacity.value,
    transform: [
      { scale: stampScale.value },
      { rotate: `${stampRotate.value}deg` },
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  // Compute standings directly — calling a function inside a Zustand selector
  // returns a new array every render, which triggers an infinite loop in useSyncExternalStore.
  const standings = useMemo(
    () => calculateGroupStandings(GROUPS[currentGroupIndex], picks),
    [currentGroupIndex, picks],
  );
  const top2 = standings.slice(0, 2).map(s => s.teamId);
  const eliminated = standings.slice(2).map(s => s.teamId);

  const handleShare = () => {
    const teamNames = top2.map(id => TEAMS[id]?.name ?? id).join(' & ');
    Share.share({
      message: `I just picked ${teamNames} to advance from ${group?.label ?? 'Group'} in my #WCProphet2026 bracket! 🏆 Can you beat my prediction? Download WC Prophet 2026!`,
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Stamp */}
        <Animated.View style={[styles.stampContainer, stampStyle]}>
          <View style={styles.stamp}>
            <Text style={styles.stampCheck}>✓</Text>
            <Text style={styles.stampText}>COMPLETE</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.content, contentStyle]}>
          {/* Title */}
          <View style={styles.titleBlock}>
            <Text style={styles.groupLabel}>{group?.label ?? ''}</Text>
            <Text style={styles.title}>
              {allGroupsDone ? 'ALL GROUPS DONE!' : 'GROUP COMPLETE!'}
            </Text>
            {allGroupsDone && (
              <Text style={styles.subtitle}>Knockout stage incoming ⚡</Text>
            )}
          </View>

          {/* Advancing teams */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionTitle}>ADVANCING</Text>
            </View>
            <View style={styles.chipRow}>
              {top2.map(id => (
                <FlagChip key={id} teamId={id} size="md" highlighted />
              ))}
            </View>
          </View>

          {/* Eliminated teams */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, styles.sectionDotDanger]} />
              <Text style={styles.sectionTitleMuted}>ELIMINATED</Text>
            </View>
            <View style={styles.chipRow}>
              {eliminated.map(id => (
                <FlagChip key={id} teamId={id} size="md" />
              ))}
            </View>
          </View>

          {/* Group standings table */}
          <View style={styles.standingsCard}>
            <Text style={styles.standingsTitle}>PICKS SUMMARY</Text>
            {standings.map((s, i) => {
              const team = TEAMS[s.teamId];
              if (!team) return null;
              const isAdvancing = i < 2;
              return (
                <View key={s.teamId} style={[styles.standingRow, i < standings.length - 1 && styles.standingBorder]}>
                  <Text style={[styles.standingPos, isAdvancing && styles.standingPosAdvancing]}>
                    {i + 1}
                  </Text>
                  <Text style={styles.standingFlag}>{team.flag}</Text>
                  <Text style={[styles.standingName, isAdvancing && styles.standingNameAdvancing]}>
                    {team.name}
                  </Text>
                  <View style={styles.standingStats}>
                    <Text style={styles.standingW}>{s.wins}W</Text>
                    <Text style={styles.standingL}>{s.losses}L</Text>
                    <View style={[styles.ptsBadge, isAdvancing && styles.ptsBadgeGold]}>
                      <Text style={[styles.standingPts, isAdvancing && styles.standingPtsGold]}>
                        {s.points} pts
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Actions */}
      <Animated.View style={[styles.actions, contentStyle, { paddingBottom: insets.bottom + SPACING.md }]}>
        <GoldButton
          label={allGroupsDone ? 'TO THE KNOCKOUT STAGE →' : `CONTINUE TO ${GROUPS[currentGroupIndex + 1]?.label ?? 'Next Group'} →`}
          onPress={async () => {
            if (interstitialReady) await showInterstitial();
            acknowledgeStageComplete();
          }}
        />
        <RewardedShareButton
          label="SHARE MY PICKS"
          rewardLabel="Watch a short ad to share"
          onRewarded={handleShare}
          onFallback={handleShare}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    padding: SPACING.lg,
    gap: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  stampContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  stamp: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.gold,
    backgroundColor: COLORS.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  stampCheck: {
    fontSize: 40,
    color: COLORS.gold,
  },
  stampText: {
    fontFamily: FONTS.display,
    fontSize: 13,
    color: COLORS.gold,
    letterSpacing: 2,
  },
  content: {
    gap: SPACING.xl,
  },
  titleBlock: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  groupLabel: {
    fontFamily: FONTS.display,
    fontSize: 14,
    color: COLORS.textMuted,
    letterSpacing: 3,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 44,
    color: COLORS.textPrimary,
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
    color: COLORS.gold,
  },
  section: {
    gap: SPACING.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.win,
  },
  sectionDotDanger: {
    backgroundColor: COLORS.danger,
  },
  sectionTitle: {
    fontFamily: FONTS.display,
    fontSize: 13,
    color: COLORS.win,
    letterSpacing: 2,
  },
  sectionTitleMuted: {
    fontFamily: FONTS.display,
    fontSize: 13,
    color: COLORS.textMuted,
    letterSpacing: 2,
  },
  chipRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  standingsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  standingsTitle: {
    fontFamily: FONTS.display,
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 3,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  standingBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  standingPos: {
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    color: COLORS.textMuted,
    width: 20,
    textAlign: 'center',
  },
  standingPosAdvancing: {
    color: COLORS.gold,
  },
  standingFlag: {
    fontSize: 22,
  },
  standingName: {
    flex: 1,
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  standingNameAdvancing: {
    color: COLORS.textPrimary,
  },
  standingStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  standingW: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 12,
    color: COLORS.win,
  },
  standingL: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 12,
    color: COLORS.danger,
  },
  ptsBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ptsBadgeGold: {
    backgroundColor: COLORS.goldDim,
  },
  standingPts: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  standingPtsGold: {
    color: COLORS.gold,
  },
  actions: {
    padding: SPACING.lg,
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  shareBtn: {
    marginTop: SPACING.xs,
  },
});
