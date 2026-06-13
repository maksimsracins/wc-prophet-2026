import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { TEAMS, type Team, type Confederation } from '../data/teams';
import AdBanner from '../components/AdBanner';

type SortKey = 'rank' | 'name' | 'confederation';
type Filter = 'all' | Confederation;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'UEFA', label: 'UEFA' },
  { key: 'CONMEBOL', label: 'CONMEBOL' },
  { key: 'CAF', label: 'CAF' },
  { key: 'AFC', label: 'AFC' },
  { key: 'CONCACAF', label: 'CONCACAF' },
  { key: 'OFC', label: 'OFC' },
];

const CONFEDERATION_COLORS: Record<Confederation, string> = {
  UEFA: '#003F87',
  CONMEBOL: '#009C3B',
  CAF: '#EF3340',
  AFC: '#BC002D',
  CONCACAF: '#002868',
  OFC: '#00843D',
};

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('rank');
  const [filter, setFilter] = useState<Filter>('all');

  const allTeams = Object.values(TEAMS);

  const filtered = allTeams
    .filter(t => filter === 'all' || t.confederation === filter)
    .filter(t =>
      !query ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.shortName.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => {
      if (sort === 'rank') return a.fifaRank - b.fifaRank;
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'confederation') return a.confederation.localeCompare(b.confederation);
      return 0;
    });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TEAMS & STATS</Text>
        <Text style={styles.headerSub}>All 48 nations — 2026 World Cup</Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search teams..."
            placeholderTextColor={COLORS.textMuted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Sort pills */}
      <View style={styles.sortRow}>
        {(['rank', 'name', 'confederation'] as SortKey[]).map(k => (
          <Pressable
            key={k}
            style={[styles.sortPill, sort === k && styles.sortPillActive]}
            onPress={() => setSort(k)}
          >
            <Text style={[styles.sortLabel, sort === k && styles.sortLabelActive]}>
              {k === 'rank' ? 'By Ranking' : k === 'name' ? 'A–Z' : 'By Conf.'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Confederation filter */}
      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={f => f.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        renderItem={({ item: f }) => (
          <Pressable
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterLabel, filter === f.key && styles.filterLabelActive]}>
              {f.label}
            </Text>
          </Pressable>
        )}
        style={styles.filterScroll}
      />

      {/* Team count */}
      <Text style={styles.teamCount}>{filtered.length} teams</Text>

      {/* Team list */}
      <FlatList
        data={filtered}
        keyExtractor={t => t.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: team }) => <TeamCard team={team} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No teams found</Text>
          </View>
        }
      />
      <AdBanner />
    </View>
  );
}

function TeamCard({ team }: { team: Team }) {
  const [expanded, setExpanded] = useState(false);
  const confColor = CONFEDERATION_COLORS[team.confederation];

  return (
    <Pressable onPress={() => setExpanded(e => !e)} style={styles.teamCard}>
      {/* Confederation color strip */}
      <View style={[styles.confStrip, { backgroundColor: confColor }]} />

      <View style={styles.teamCardInner}>
        {/* Top row */}
        <View style={styles.teamTop}>
          <Text style={styles.teamFlag}>{team.flag}</Text>
          <View style={styles.teamMeta}>
            <Text style={styles.teamName}>{team.name}</Text>
            <View style={styles.teamSubRow}>
              <Text style={styles.teamShort}>{team.shortName}</Text>
              <View style={[styles.confBadge, { backgroundColor: confColor + '22', borderColor: confColor + '66' }]}>
                <Text style={[styles.confLabel, { color: confColor }]}>{team.confederation}</Text>
              </View>
            </View>
          </View>
          <View style={styles.rankBlock}>
            <Text style={styles.rankNum}>#{team.fifaRank}</Text>
            <Text style={styles.rankLabel}>RANK</Text>
          </View>
        </View>

        {/* Best result */}
        <View style={styles.bestRow}>
          <Text style={styles.bestLabel}>BEST WC RESULT</Text>
          <Text style={styles.bestValue}>{team.bestResult}</Text>
        </View>

        {/* Expandable fact */}
        {expanded && (
          <View style={styles.factBlock}>
            <View style={styles.factBar} />
            <Text style={styles.factText}>{team.wildFact}</Text>
          </View>
        )}

        {/* Expand hint */}
        <Text style={styles.expandHint}>{expanded ? '▲ less' : '▼ wild fact'}</Text>
      </View>
    </Pressable>
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
  searchRow: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  searchIcon: { fontSize: 14 },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textPrimary,
    padding: 0,
  },
  sortRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    gap: SPACING.sm,
  },
  sortPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortPillActive: {
    backgroundColor: COLORS.goldDim,
    borderColor: COLORS.borderGold,
  },
  sortLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  sortLabelActive: { color: COLORS.gold },
  filterScroll: {
    maxHeight: 44,
    marginTop: SPACING.sm,
  },
  filterList: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.goldDim,
    borderColor: COLORS.borderGold,
  },
  filterLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  filterLabelActive: { color: COLORS.gold },
  teamCount: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    gap: SPACING.sm,
  },
  teamCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  confStrip: {
    width: 4,
  },
  teamCardInner: {
    flex: 1,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  teamTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  teamFlag: { fontSize: 32 },
  teamMeta: { flex: 1, gap: 2 },
  teamName: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  teamSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  teamShort: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  confBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  confLabel: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  rankBlock: { alignItems: 'center' },
  rankNum: {
    fontFamily: FONTS.display,
    fontSize: 22,
    color: COLORS.gold,
    lineHeight: 26,
  },
  rankLabel: {
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  bestRow: {
    gap: 2,
  },
  bestLabel: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 9,
    color: COLORS.textMuted,
    letterSpacing: 2,
  },
  bestValue: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  factBlock: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  factBar: {
    width: 2,
    backgroundColor: COLORS.gold,
    borderRadius: 1,
    opacity: 0.6,
  },
  factText: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  expandHint: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
    gap: SPACING.md,
  },
  emptyEmoji: { fontSize: 40 },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
  },
});
