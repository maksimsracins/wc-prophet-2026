export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  groupId?: string;
  round: TournamentRound;
  matchIndex: number;
}

export interface Group {
  id: string;
  label: string;
  teams: string[];
  matches: Match[];
}

export type TournamentRound =
  | 'group'
  | 'round_of_32'
  | 'round_of_16'
  | 'quarter_final'
  | 'semi_final'
  | 'final';

export const ROUND_LABELS: Record<TournamentRound, string> = {
  group: 'Group Stage',
  round_of_32: 'Round of 32',
  round_of_16: 'Round of 16',
  quarter_final: 'Quarter-Finals',
  semi_final: 'Semi-Finals',
  final: 'The Final',
};

// Groups A–L with teams drawn to replicate a plausible 2026 draw
const GROUP_DATA: [string, string, string[]][] = [
  ['A', 'Group A', ['usa', 'portugal', 'morocco', 'ecuador']],
  ['B', 'Group B', ['canada', 'belgium', 'japan', 'paraguay']],
  ['C', 'Group C', ['mexico', 'france', 'south_korea', 'algeria']],
  ['D', 'Group D', ['brazil', 'spain', 'cameroon', 'honduras']],
  ['E', 'Group E', ['argentina', 'netherlands', 'senegal', 'australia']],
  ['F', 'Group F', ['england', 'germany', 'ghana', 'costa_rica']],
  ['G', 'Group G', ['italy', 'colombia', 'nigeria', 'iraq']],
  ['H', 'Group H', ['croatia', 'uruguay', 'egypt', 'iran']],
  ['I', 'Group I', ['switzerland', 'venezuela', 'jordan', 'ivory_coast']],
  ['J', 'Group J', ['denmark', 'south_africa', 'saudi_arabia', 'new_zealand']],
  ['K', 'Group K', ['austria', 'turkey', 'tunisia', 'uzbekistan']],
  ['L', 'Group L', ['poland', 'serbia', 'scotland', 'panama']],
];

function buildGroupMatches(groupId: string, teams: string[]): Match[] {
  // Round-robin: 6 matches per group
  const pairs: [number, number][] = [
    [0, 1], [2, 3],
    [0, 2], [1, 3],
    [0, 3], [1, 2],
  ];
  return pairs.map(([a, b], idx) => ({
    id: `${groupId}_${idx}`,
    teamA: teams[a],
    teamB: teams[b],
    groupId,
    round: 'group',
    matchIndex: idx,
  }));
}

export const GROUPS: Group[] = GROUP_DATA.map(([id, label, teams]) => ({
  id,
  label,
  teams,
  matches: buildGroupMatches(id, teams),
}));

export const ALL_GROUP_MATCHES: Match[] = GROUPS.flatMap(g => g.matches);

// Knockout match placeholders (teams filled in dynamically by store after group stage)
export function buildKnockoutMatches(): Match[] {
  const matches: Match[] = [];

  // Round of 32 — 16 matches
  for (let i = 0; i < 16; i++) {
    matches.push({
      id: `r32_${i}`,
      teamA: '',
      teamB: '',
      round: 'round_of_32',
      matchIndex: i,
    });
  }
  // Round of 16 — 8 matches
  for (let i = 0; i < 8; i++) {
    matches.push({
      id: `r16_${i}`,
      teamA: '',
      teamB: '',
      round: 'round_of_16',
      matchIndex: i,
    });
  }
  // Quarter-finals — 4 matches
  for (let i = 0; i < 4; i++) {
    matches.push({
      id: `qf_${i}`,
      teamA: '',
      teamB: '',
      round: 'quarter_final',
      matchIndex: i,
    });
  }
  // Semi-finals — 2 matches
  for (let i = 0; i < 2; i++) {
    matches.push({
      id: `sf_${i}`,
      teamA: '',
      teamB: '',
      round: 'semi_final',
      matchIndex: i,
    });
  }
  // Final — 1 match
  matches.push({
    id: 'final_0',
    teamA: '',
    teamB: '',
    round: 'final',
    matchIndex: 0,
  });

  return matches;
}

export interface GroupStanding {
  teamId: string;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  position: number; // 1-4
}

export function calculateGroupStandings(
  group: Group,
  picks: Record<string, string>,
): GroupStanding[] {
  const standings: Record<string, GroupStanding> = {};
  for (const teamId of group.teams) {
    standings[teamId] = { teamId, wins: 0, draws: 0, losses: 0, points: 0, position: 0 };
  }

  for (const match of group.matches) {
    const winner = picks[match.id];
    if (!winner) continue;
    const loser = winner === match.teamA ? match.teamB : match.teamA;
    standings[winner].wins += 1;
    standings[winner].points += 3;
    standings[loser].losses += 1;
  }

  const sorted = Object.values(standings).sort((a, b) => b.points - a.points || b.wins - a.wins);
  sorted.forEach((s, i) => { s.position = i + 1; });
  return sorted;
}

// Given all group results, determine 32 teams for knockout stage.
// Top 2 from each group (24) + best 8 third-place teams.
export function determineKnockoutTeams(
  picks: Record<string, string>,
): { qualifiers: string[]; thirdPlacers: GroupStanding[] } {
  const qualifiers: string[] = [];
  const allThirdPlacers: GroupStanding[] = [];

  for (const group of GROUPS) {
    const standings = calculateGroupStandings(group, picks);
    qualifiers.push(standings[0].teamId, standings[1].teamId);
    allThirdPlacers.push(standings[2]);
  }

  // Sort 3rd-place teams, take best 8
  const best8Third = allThirdPlacers
    .sort((a, b) => b.points - a.points || b.wins - a.wins)
    .slice(0, 8);

  return { qualifiers, thirdPlacers: best8Third };
}

// Seed 32 teams into R32 bracket
export function seedKnockoutBracket(teams: string[]): string[] {
  // Simple seeding: top seed vs bottom seed
  const top = teams.slice(0, 16);
  const bottom = [...teams.slice(16)].reverse();
  const seeded: string[] = [];
  for (let i = 0; i < 16; i++) {
    seeded.push(top[i], bottom[i]);
  }
  return seeded;
}
