import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import AdBanner from '../components/AdBanner';
import { useTournamentStore } from '../store/tournamentStore';
import { GROUPS, ROUND_LABELS, type TournamentRound } from '../data/tournament';
import { TEAMS, type Team } from '../data/teams';
import { calculateGroupStandings } from '../data/tournament';

const ROUND_ORDER: TournamentRound[] = [
  'round_of_32', 'round_of_16', 'quarter_final', 'semi_final', 'final',
];

export default function BracketScreen() {
  const insets = useSafeAreaInsets();
  const { phase, picks, knockoutMatches, champion } = useTournamentStore();

  const groupsDone = phase === 'knockout' || phase === 'champion';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MY BRACKET</Text>
        <Text style={styles.headerSub}>Your 2026 tournament predictions</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Group stage summary */}
        <View style={styles.section}>
          <SectionHeader label="GROUP STAGE" done={groupsDone} />
          {groupsDone ? (
            <View style={styles.groupGrid}>
              {GROUPS.map((g, gi) => {
                const standings = calculateGroupStandings(GROUPS[gi], picks);
                const top2 = standings.slice(0, 2);
                return (
                  <View key={g.id} style={styles.groupCell}>
                    <Text style={styles.groupCellLabel}>{g.label}</Text>
                    {top2.map((s, i) => {
                      const team = TEAMS[s.teamId];
                      if (!team) return null;
                      return (
                        <View key={s.teamId} style={styles.groupTeamRow}>
                          <Text style={styles.groupTeamPos}>{i + 1}</Text>
                          <Text style={styles.groupTeamFlag}>{team.flag}</Text>
                          <Text style={styles.groupTeamName}>{team.shortName}</Text>
                          <Text style={styles.groupTeamPts}>{s.points}pt</Text>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.lockedBlock}>
              <Text style={styles.lockedEmoji}>🔒</Text>
              <Text style={styles.lockedText}>Complete all group stage picks to see bracket</Text>
              <View style={styles.groupProgress}>
                {GROUPS.map(g => {
                  const groupMatchesDone = g.matches.filter(m => picks[m.id]).length;
                  const done = groupMatchesDone >= g.matches.length;
                  return (
                    <View key={g.id} style={[styles.groupDot, done && styles.groupDotDone]}>
                      <Text style={styles.groupDotLabel}>{g.id}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* Knockout rounds */}
        {ROUND_ORDER.map(round => {
          const roundMatches = knockoutMatches.filter(m => m.round === round);
          const roundDone = roundMatches.every(m => picks[m.id]);
          const roundStarted = roundMatches.some(m => m.teamA && m.teamB);

          return (
            <View key={round} style={styles.section}>
              <SectionHeader label={ROUND_LABELS[round]} done={roundDone} />
              {roundStarted ? (
                <View style={styles.matchList}>
                  {roundMatches.map(m => {
                    const winner = picks[m.id];
                    const teamA = TEAMS[m.teamA];
                    const teamB = TEAMS[m.teamB];
                    return (
                      <View key={m.id} style={styles.bracketMatch}>
                        <BracketTeam
                          team={teamA}
                          isWinner={winner === m.teamA}
                          isLoser={!!winner && winner !== m.teamA}
                        />
                        <View style={styles.bracketVs}>
                          <Text style={styles.bracketVsText}>VS</Text>
                        </View>
                        <BracketTeam
                          team={teamB}
                          isWinner={winner === m.teamB}
                          isLoser={!!winner && winner !== m.teamB}
                        />
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.lockedBlock}>
                  <Text style={styles.lockedEmoji}>⏳</Text>
                  <Text style={styles.lockedText}>Unlocks after previous round</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Champion */}
        {champion && (
          <View style={[styles.section, styles.championSection]}>
            <View style={styles.championCard}>
              <Text style={styles.championEmoji}>👑</Text>
              <Text style={styles.championFlag}>{TEAMS[champion]?.flag}</Text>
              <Text style={styles.championName}>{TEAMS[champion]?.name.toUpperCase()}</Text>
              <Text style={styles.championLabel}>YOUR PREDICTED CHAMPION</Text>
            </View>
          </View>
        )}

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
      <AdBanner />
    </View>
  );
}

function SectionHeader({ label, done }: { label: string; done: boolean }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionDot, done && styles.sectionDotDone]} />
      <Text style={[styles.sectionLabel, done && styles.sectionLabelDone]}>{label}</Text>
      {done && <View style={styles.sectionCheckBadge}><Text style={styles.sectionCheck}>✓</Text></View>}
    </View>
  );
}

function BracketTeam({
  team,
  isWinner,
  isLoser,
}: {
  team: Team | undefined;
  isWinner: boolean;
  isLoser: boolean;
}) {
  if (!team) {
    return (
      <View style={[styles.bracketTeam, styles.bracketTeamEmpty]}>
        <Text style={styles.bracketTeamEmptyText}>TBD</Text>
      </View>
    );
  }
  return (
    <View style={[
      styles.bracketTeam,
      isWinner && styles.bracketTeamWinner,
      isLoser && styles.bracketTeamLoser,
    ]}>
      <Text style={styles.bracketTeamFlag}>{team.flag}</Text>
      <Text style={[
        styles.bracketTeamName,
        isWinner && styles.bracketTeamNameWinner,
        isLoser && styles.bracketTeamNameLoser,
      ]}>
        {team.shortName}
      </Text>
      {isWinner && <Text style={styles.bracketWinCheck}>✓</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 2,
  },
  headerTitle: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  headerSub: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  section: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textMuted,
  },
  sectionDotDone: {
    backgroundColor: COLORS.gold,
  },
  sectionLabel: {
    fontFamily: FONTS.display,
    fontSize: 13,
    color: COLORS.textMuted,
    letterSpacing: 2,
    flex: 1,
  },
  sectionLabelDone: {
    color: COLORS.gold,
  },
  sectionCheckBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCheck: {
    fontSize: 11,
    color: COLORS.gold,
  },
  lockedBlock: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  lockedEmoji: { fontSize: 28 },
  lockedText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  groupProgress: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  groupDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupDotDone: {
    backgroundColor: COLORS.goldDim,
    borderColor: COLORS.borderGold,
  },
  groupDotLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  groupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  groupCell: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  groupCellLabel: {
    fontFamily: FONTS.display,
    fontSize: 11,
    color: COLORS.gold,
    letterSpacing: 1,
    marginBottom: 2,
  },
  groupTeamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  groupTeamPos: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.textMuted,
    width: 12,
  },
  groupTeamFlag: { fontSize: 14 },
  groupTeamName: {
    flex: 1,
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  groupTeamPts: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.gold,
  },
  matchList: {
    gap: SPACING.sm,
  },
  bracketMatch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  bracketTeam: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: 6,
  },
  bracketTeamWinner: {
    backgroundColor: COLORS.goldDim,
  },
  bracketTeamLoser: {
    opacity: 0.4,
  },
  bracketTeamEmpty: {
    justifyContent: 'center',
  },
  bracketTeamFlag: { fontSize: 20 },
  bracketTeamName: {
    flex: 1,
    fontFamily: FONTS.bodySemiBold,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  bracketTeamNameWinner: { color: COLORS.gold },
  bracketTeamNameLoser: { color: COLORS.textMuted },
  bracketTeamEmptyText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  bracketWinCheck: {
    fontSize: 12,
    color: COLORS.gold,
  },
  bracketVs: {
    width: 36,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
  },
  bracketVsText: {
    fontFamily: FONTS.display,
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  championSection: {
    marginTop: SPACING.xxl,
  },
  championCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.borderGold,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  championEmoji: { fontSize: 40 },
  championFlag: { fontSize: 56 },
  championName: {
    fontFamily: FONTS.display,
    fontSize: 36,
    color: COLORS.gold,
    letterSpacing: 2,
    textAlign: 'center',
  },
  championLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 2,
  },
});
