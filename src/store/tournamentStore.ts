import { create } from 'zustand';
import {
  GROUPS,
  ALL_GROUP_MATCHES,
  buildKnockoutMatches,
  calculateGroupStandings,
  determineKnockoutTeams,
  seedKnockoutBracket,
  type Match,
  type GroupStanding,
  type TournamentRound,
} from '../data/tournament';

export type AppPhase =
  | 'splash'
  | 'group_stage'
  | 'stage_complete'
  | 'knockout'
  | 'knockout_complete'
  | 'champion';

interface TournamentState {
  phase: AppPhase;
  currentGroupIndex: number;
  currentMatchIndex: number;
  picks: Record<string, string>; // matchId → winnerId
  knockoutMatches: Match[];
  currentKnockoutMatchIndex: number;
  champion: string | null;

  // Actions
  startGame: () => void;
  pickWinner: (matchId: string, winnerId: string) => void;
  acknowledgeStageComplete: () => void;
  resetGame: () => void;

  // Derived getters
  getCurrentMatch: () => Match | null;
  getCurrentGroupLabel: () => string;
  getGroupStandings: (groupIndex: number) => GroupStanding[];
  getGroupProgress: () => { completed: number; total: number };
  getKnockoutProgress: () => { completed: number; total: number };
  getCurrentKnockoutRound: () => TournamentRound;
  getAllGroupMatches: () => Match[];
}

export const useTournamentStore = create<TournamentState>((set, get) => ({
  phase: 'splash',
  currentGroupIndex: 0,
  currentMatchIndex: 0,
  picks: {},
  knockoutMatches: buildKnockoutMatches(),
  currentKnockoutMatchIndex: 0,
  champion: null,

  startGame: () => set({ phase: 'group_stage', currentGroupIndex: 0, currentMatchIndex: 0 }),

  pickWinner: (matchId: string, winnerId: string) => {
    const state = get();
    const newPicks = { ...state.picks, [matchId]: winnerId };

    if (state.phase === 'group_stage') {
      const group = GROUPS[state.currentGroupIndex];
      const nextMatchIndex = state.currentMatchIndex + 1;

      if (nextMatchIndex >= group.matches.length) {
        // Group complete
        const isLastGroup = state.currentGroupIndex >= GROUPS.length - 1;
        if (isLastGroup) {
          // All groups done — build knockout bracket
          const { qualifiers, thirdPlacers } = determineKnockoutTeams(newPicks);
          const allAdvancing = [
            ...qualifiers,
            ...thirdPlacers.map(t => t.teamId),
          ];
          const seeded = seedKnockoutBracket(allAdvancing);
          const knockoutMatches = buildKnockoutMatches();
          // Fill R32 teams
          for (let i = 0; i < 16; i++) {
            knockoutMatches[i].teamA = seeded[i * 2];
            knockoutMatches[i].teamB = seeded[i * 2 + 1];
          }
          set({
            picks: newPicks,
            phase: 'stage_complete',
            currentGroupIndex: state.currentGroupIndex,
            currentMatchIndex: nextMatchIndex,
            knockoutMatches,
          });
        } else {
          set({
            picks: newPicks,
            phase: 'stage_complete',
            currentGroupIndex: state.currentGroupIndex,
            currentMatchIndex: nextMatchIndex,
          });
        }
      } else {
        set({ picks: newPicks, currentMatchIndex: nextMatchIndex });
      }
      return;
    }

    if (state.phase === 'knockout') {
      const nextIdx = state.currentKnockoutMatchIndex + 1;
      const km = [...state.knockoutMatches];
      const currentMatch = km[state.currentKnockoutMatchIndex];

      // Propagate winner to next round
      const nextRoundMatches = propagateWinner(km, currentMatch.round, currentMatch.matchIndex, winnerId);

      // Check if final was just picked
      if (currentMatch.round === 'final') {
        set({ picks: newPicks, knockoutMatches: nextRoundMatches, champion: winnerId, phase: 'champion' });
        return;
      }

      set({
        picks: newPicks,
        knockoutMatches: nextRoundMatches,
        currentKnockoutMatchIndex: nextIdx,
      });
    }
  },

  acknowledgeStageComplete: () => {
    const state = get();
    if (state.phase !== 'stage_complete') return;

    // Check if we just finished all groups
    const allGroupsDone = Object.keys(state.picks).length >= ALL_GROUP_MATCHES.length;
    if (allGroupsDone) {
      set({ phase: 'knockout', currentKnockoutMatchIndex: 0 });
    } else {
      set({
        phase: 'group_stage',
        currentGroupIndex: state.currentGroupIndex + 1,
        currentMatchIndex: 0,
      });
    }
  },

  resetGame: () =>
    set({
      phase: 'splash',
      currentGroupIndex: 0,
      currentMatchIndex: 0,
      picks: {},
      knockoutMatches: buildKnockoutMatches(),
      currentKnockoutMatchIndex: 0,
      champion: null,
    }),

  getCurrentMatch: () => {
    const state = get();
    if (state.phase === 'group_stage' || state.phase === 'stage_complete') {
      const group = GROUPS[state.currentGroupIndex];
      if (!group) return null;
      return group.matches[Math.min(state.currentMatchIndex, group.matches.length - 1)] ?? null;
    }
    if (state.phase === 'knockout') {
      return state.knockoutMatches[state.currentKnockoutMatchIndex] ?? null;
    }
    return null;
  },

  getCurrentGroupLabel: () => {
    const { currentGroupIndex } = get();
    return GROUPS[currentGroupIndex]?.label ?? '';
  },

  getGroupStandings: (groupIndex: number) => {
    const { picks } = get();
    return calculateGroupStandings(GROUPS[groupIndex], picks);
  },

  getGroupProgress: () => {
    const state = get();
    const completed = state.currentGroupIndex * 6 + state.currentMatchIndex;
    const total = GROUPS.length * 6;
    return { completed, total };
  },

  getKnockoutProgress: () => {
    const { currentKnockoutMatchIndex, knockoutMatches } = get();
    return { completed: currentKnockoutMatchIndex, total: knockoutMatches.length };
  },

  getCurrentKnockoutRound: () => {
    const { knockoutMatches, currentKnockoutMatchIndex } = get();
    return knockoutMatches[currentKnockoutMatchIndex]?.round ?? 'round_of_32';
  },

  getAllGroupMatches: () => ALL_GROUP_MATCHES,
}));

// Propagate winner to the next round's match slot
function propagateWinner(
  matches: Match[],
  round: TournamentRound,
  matchIndex: number,
  winner: string,
): Match[] {
  const updated = matches.map(m => ({ ...m }));

  const roundOrder: TournamentRound[] = [
    'round_of_32', 'round_of_16', 'quarter_final', 'semi_final', 'final',
  ];
  const roundCounts = [16, 8, 4, 2, 1];
  const roundOffsets = [0, 16, 24, 28, 30];

  const roundIdx = roundOrder.indexOf(round);
  if (roundIdx === -1 || roundIdx >= roundOrder.length - 1) return updated;

  const nextRound = roundOrder[roundIdx + 1];
  const nextMatchIndex = Math.floor(matchIndex / 2);
  const isTeamA = matchIndex % 2 === 0;
  const nextOffset = roundOffsets[roundIdx + 1];
  const nextMatch = updated[nextOffset + nextMatchIndex];
  if (!nextMatch) return updated;

  if (isTeamA) {
    nextMatch.teamA = winner;
  } else {
    nextMatch.teamB = winner;
  }

  return updated;
}
