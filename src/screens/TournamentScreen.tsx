import React, { useEffect, useRef, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';
import { useTournamentStore } from '../store/tournamentStore';
import { GROUPS, ROUND_LABELS } from '../data/tournament';
import { getFactForMatch } from '../data/facts';
import MatchCard from '../components/MatchCard';
import ProgressBar from '../components/ProgressBar';
import ConfirmModal from '../components/ConfirmModal';

export default function TournamentScreen() {
  const insets = useSafeAreaInsets();
  const {
    phase,
    currentGroupIndex,
    currentMatchIndex,
    pickWinner,
    getCurrentMatch,
    getCurrentKnockoutRound,
    getGroupProgress,
    getKnockoutProgress,
    resetGame,
  } = useTournamentStore();

  const [showResetModal, setShowResetModal] = useState(false);
  const confirmReset = () => setShowResetModal(true);

  const match = getCurrentMatch();
  const isKnockout = phase === 'knockout';

  // Global match index for fact rotation (group matches 0–71, knockout after)
  const globalMatchIndex = useMemo(() => {
    if (!isKnockout) return currentGroupIndex * 6 + currentMatchIndex;
    const { completed } = getKnockoutProgress();
    return 72 + completed;
  }, [isKnockout, currentGroupIndex, currentMatchIndex]);

  // Card entrance animation
  const cardY = useSharedValue(60);
  const cardOpacity = useSharedValue(0);

  const matchKey = match?.id ?? 'none';
  const prevMatchKey = useRef(matchKey);

  useEffect(() => {
    if (matchKey !== prevMatchKey.current) {
      prevMatchKey.current = matchKey;
      cardY.value = 60;
      cardOpacity.value = 0;
    }
    cardY.value = withDelay(50, withSpring(0, { damping: 16, stiffness: 180 }));
    cardOpacity.value = withDelay(50, withTiming(1, { duration: 300 }));
  }, [matchKey]);

  const cardAnimStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardY.value }],
  }));

  const progress = isKnockout
    ? getKnockoutProgress()
    : getGroupProgress();

  const progressFraction = progress.total > 0
    ? progress.completed / progress.total
    : 0;

  let stageLabel = '';
  let matchLabel = '';
  if (!isKnockout) {
    const group = GROUPS[currentGroupIndex];
    stageLabel = group?.label ?? '';
    matchLabel = `Match ${currentMatchIndex + 1} of ${group?.matches.length ?? 6}`;
  } else {
    const round = getCurrentKnockoutRound();
    stageLabel = ROUND_LABELS[round] ?? '';
    matchLabel = '';
  }

  // Progress dots for group matches
  const groupMatchCount = !isKnockout ? (GROUPS[currentGroupIndex]?.matches.length ?? 6) : 0;

  if (!match) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.noMatch}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.sm }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.stageRow}>
          <View style={styles.stagePill}>
            <Text style={styles.stageText}>{stageLabel}</Text>
          </View>
          {matchLabel ? (
            <Text style={styles.matchLabel}>{matchLabel}</Text>
          ) : null}
          <Pressable onPress={confirmReset} style={styles.resetBtn} hitSlop={12}>
            <Text style={styles.resetLabel}>↺ Reset</Text>
          </Pressable>
        </View>

        {/* Dots for group stage */}
        {!isKnockout && groupMatchCount > 0 && (
          <View style={styles.dots}>
            {Array.from({ length: groupMatchCount }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i < currentMatchIndex ? styles.dotDone :
                  i === currentMatchIndex ? styles.dotActive : styles.dotPending,
                ]}
              />
            ))}
          </View>
        )}

        {/* Progress bar */}
        <View style={styles.progressRow}>
          <ProgressBar progress={progressFraction} height={3} />
          <Text style={styles.progressText}>
            {progress.completed}/{progress.total}
          </Text>
        </View>
      </View>

      {/* Match card */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={cardAnimStyle}>
          <MatchCard key={matchKey} match={match} onPick={pickWinner} />
        </Animated.View>

        {/* Did You Know ticker */}
        <View style={styles.factCard}>
          <View style={styles.factHeader}>
            <Text style={styles.factBulb}>💡</Text>
            <Text style={styles.factLabel}>DID YOU KNOW?</Text>
          </View>
          <Text style={styles.factText}>{getFactForMatch(globalMatchIndex)}</Text>
        </View>

        {/* Bottom hint */}
        <View style={styles.hintRow}>
          <Text style={styles.hintText}>
            Tap the team you think will win ↑
          </Text>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showResetModal}
        title="START OVER?"
        message="All your picks will be lost. This cannot be undone."
        confirmLabel="START OVER"
        onConfirm={() => { setShowResetModal(false); resetGame(); }}
        onCancel={() => setShowResetModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  topBar: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  stagePill: {
    backgroundColor: COLORS.goldDim,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
  },
  stageText: {
    fontFamily: FONTS.display,
    fontSize: 14,
    color: COLORS.gold,
    letterSpacing: 1,
  },
  matchLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    color: COLORS.textMuted,
    flex: 1,
  },
  resetBtn: {
    marginLeft: 'auto',
  },
  resetLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotDone: {
    backgroundColor: COLORS.gold,
  },
  dotActive: {
    backgroundColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  dotPending: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  progressText: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textMuted,
    minWidth: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    gap: SPACING.xl,
  },
  hintRow: {
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  hintText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  noMatch: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 16,
    textAlign: 'center',
    marginTop: SPACING.xxl,
  },
  factCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  factBulb: { fontSize: 13 },
  factLabel: {
    fontFamily: FONTS.display,
    fontSize: 11,
    color: COLORS.gold,
    letterSpacing: 2,
  },
  factText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
