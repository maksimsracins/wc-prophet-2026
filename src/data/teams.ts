export type Confederation = 'UEFA' | 'CONMEBOL' | 'CAF' | 'AFC' | 'CONCACAF' | 'OFC';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  flag: string;
  confederation: Confederation;
  fifaRank: number;
  bestResult: string;
  wildFact: string;
  colors: [string, string]; // primary, secondary
}

export const TEAMS: Record<string, Team> = {
  // CONCACAF
  usa: {
    id: 'usa', name: 'United States', shortName: 'USA',
    flag: '🇺🇸', confederation: 'CONCACAF', fifaRank: 11,
    bestResult: '3rd place (1930)',
    wildFact: 'As co-hosts, the USA will play all group stage games at home stadiums across the country.',
    colors: ['#002868', '#BF0A30'],
  },
  canada: {
    id: 'canada', name: 'Canada', shortName: 'CAN',
    flag: '🇨🇦', confederation: 'CONCACAF', fifaRank: 43,
    bestResult: 'Group stage (1986)',
    wildFact: 'Canada qualified for 2022 for the first time in 36 years, ending the longest drought in the Americas.',
    colors: ['#FF0000', '#FFFFFF'],
  },
  mexico: {
    id: 'mexico', name: 'Mexico', shortName: 'MEX',
    flag: '🇲🇽', confederation: 'CONCACAF', fifaRank: 16,
    bestResult: 'Quarter-final (1970, 1986)',
    wildFact: 'Mexico has scored in every World Cup they\'ve participated in — a streak spanning over 90 years.',
    colors: ['#006847', '#CE1126'],
  },
  panama: {
    id: 'panama', name: 'Panama', shortName: 'PAN',
    flag: '🇵🇦', confederation: 'CONCACAF', fifaRank: 49,
    bestResult: 'Group stage (2018)',
    wildFact: 'Panama\'s first-ever World Cup goal in 2018 was celebrated so wildly that it became a national holiday.',
    colors: ['#FFFFFF', '#DA121A'],
  },
  costa_rica: {
    id: 'costa_rica', name: 'Costa Rica', shortName: 'CRC',
    flag: '🇨🇷', confederation: 'CONCACAF', fifaRank: 50,
    bestResult: 'Quarter-final (2014)',
    wildFact: 'In 2014 Costa Rica beat Uruguay, Italy, and England in the group stage — the greatest group stage upset in WC history.',
    colors: ['#002B7F', '#CE1126'],
  },
  honduras: {
    id: 'honduras', name: 'Honduras', shortName: 'HON',
    flag: '🇭🇳', confederation: 'CONCACAF', fifaRank: 74,
    bestResult: 'Group stage (1982, 2010, 2014)',
    wildFact: 'Honduras and El Salvador played the famous "Football War" of 1969 after a qualifying match sparked a 100-hour conflict.',
    colors: ['#0073CF', '#FFFFFF'],
  },
  // CONMEBOL
  brazil: {
    id: 'brazil', name: 'Brazil', shortName: 'BRA',
    flag: '🇧🇷', confederation: 'CONMEBOL', fifaRank: 5,
    bestResult: 'Winners (1958, 1962, 1970, 1994, 2002)',
    wildFact: 'Brazil is the only nation to have played in every single World Cup — all 23 editions.',
    colors: ['#009C3B', '#FFDF00'],
  },
  argentina: {
    id: 'argentina', name: 'Argentina', shortName: 'ARG',
    flag: '🇦🇷', confederation: 'CONMEBOL', fifaRank: 1,
    bestResult: 'Winners (1978, 1986, 2022)',
    wildFact: 'Argentina\'s 2022 World Cup win ended a 36-year drought, making Lionel Messi the only player to win the Golden Boot, Golden Ball, and the trophy in one career.',
    colors: ['#74ACDF', '#FFFFFF'],
  },
  colombia: {
    id: 'colombia', name: 'Colombia', shortName: 'COL',
    flag: '🇨🇴', confederation: 'CONMEBOL', fifaRank: 9,
    bestResult: 'Quarter-final (2014)',
    wildFact: 'James Rodríguez\'s 2014 World Cup goal against Uruguay was voted the best goal in tournament history.',
    colors: ['#FCD116', '#003087'],
  },
  uruguay: {
    id: 'uruguay', name: 'Uruguay', shortName: 'URU',
    flag: '🇺🇾', confederation: 'CONMEBOL', fifaRank: 14,
    bestResult: 'Winners (1930, 1950)',
    wildFact: 'Uruguay won the very first World Cup in 1930, hosted on their home soil, with a stadium built in just 8 months.',
    colors: ['#75AADB', '#FFFFFF'],
  },
  ecuador: {
    id: 'ecuador', name: 'Ecuador', shortName: 'ECU',
    flag: '🇪🇨', confederation: 'CONMEBOL', fifaRank: 37,
    bestResult: 'Round of 16 (2006)',
    wildFact: 'Ecuador sits on the equator — their national stadium in Quito is one of the highest-altitude football venues in the world at 2,800m.',
    colors: ['#FFD100', '#003087'],
  },
  paraguay: {
    id: 'paraguay', name: 'Paraguay', shortName: 'PAR',
    flag: '🇵🇾', confederation: 'CONMEBOL', fifaRank: 58,
    bestResult: 'Quarter-final (1930, 2010)',
    wildFact: 'Paraguay didn\'t concede a single goal in open play during the entire 2010 World Cup knockout stage.',
    colors: ['#D52B1E', '#FFFFFF'],
  },
  // UEFA
  france: {
    id: 'france', name: 'France', shortName: 'FRA',
    flag: '🇫🇷', confederation: 'UEFA', fifaRank: 2,
    bestResult: 'Winners (1998, 2018)',
    wildFact: 'France\'s squad for 2018 was so young that the average age was just 26 — the youngest World Cup-winning squad ever.',
    colors: ['#002395', '#ED2939'],
  },
  england: {
    id: 'england', name: 'England', shortName: 'ENG',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA', fifaRank: 4,
    bestResult: 'Winners (1966)',
    wildFact: 'England\'s only World Cup win came on home soil in 1966, and the winning goal is still disputed — the ball may never have fully crossed the line.',
    colors: ['#FFFFFF', '#CF081F'],
  },
  spain: {
    id: 'spain', name: 'Spain', shortName: 'ESP',
    flag: '🇪🇸', confederation: 'UEFA', fifaRank: 6,
    bestResult: 'Winners (2010)',
    wildFact: 'Spain\'s 2010 World Cup campaign featured a record 7 consecutive clean sheets — they let in only 2 goals the entire tournament.',
    colors: ['#AA151B', '#F1BF00'],
  },
  germany: {
    id: 'germany', name: 'Germany', shortName: 'GER',
    flag: '🇩🇪', confederation: 'UEFA', fifaRank: 13,
    bestResult: 'Winners (1954, 1974, 1990, 2014)',
    wildFact: 'Germany\'s 7-1 demolition of Brazil in the 2014 semi-final is the most-watched football match in history.',
    colors: ['#000000', '#DD0000'],
  },
  portugal: {
    id: 'portugal', name: 'Portugal', shortName: 'POR',
    flag: '🇵🇹', confederation: 'UEFA', fifaRank: 7,
    bestResult: '3rd place (1966)',
    wildFact: 'Cristiano Ronaldo has scored in every World Cup he\'s appeared in — a feat no other player in history has achieved.',
    colors: ['#006600', '#FF0000'],
  },
  netherlands: {
    id: 'netherlands', name: 'Netherlands', shortName: 'NED',
    flag: '🇳🇱', confederation: 'UEFA', fifaRank: 8,
    bestResult: 'Runners-up (1974, 1978, 2010)',
    wildFact: 'The Netherlands have never won a World Cup despite reaching three finals — the most finals without a trophy in WC history.',
    colors: ['#FF6600', '#002F6C'],
  },
  belgium: {
    id: 'belgium', name: 'Belgium', shortName: 'BEL',
    flag: '🇧🇪', confederation: 'UEFA', fifaRank: 3,
    bestResult: '3rd place (1986, 2018)',
    wildFact: 'Belgium\'s "golden generation" peaked at #1 in the world rankings for a record 27 months, yet never won a major trophy.',
    colors: ['#000000', '#EF3340'],
  },
  italy: {
    id: 'italy', name: 'Italy', shortName: 'ITA',
    flag: '🇮🇹', confederation: 'UEFA', fifaRank: 10,
    bestResult: 'Winners (1934, 1938, 1982, 2006)',
    wildFact: 'Italy failed to qualify for both 2018 and 2022 — the longest absence from the World Cup for a 4-time champion.',
    colors: ['#009246', '#CE2B37'],
  },
  croatia: {
    id: 'croatia', name: 'Croatia', shortName: 'CRO',
    flag: '🇭🇷', confederation: 'UEFA', fifaRank: 12,
    bestResult: 'Runners-up (2018)',
    wildFact: 'Croatia\'s squad has more players produced by the same youth academy (Dinamo Zagreb) than any other finalist in World Cup history.',
    colors: ['#FF0000', '#FFFFFF'],
  },
  switzerland: {
    id: 'switzerland', name: 'Switzerland', shortName: 'SUI',
    flag: '🇨🇭', confederation: 'UEFA', fifaRank: 20,
    bestResult: 'Quarter-final (1934, 1938, 1954)',
    wildFact: 'Switzerland has 4 official national languages — French, German, Italian, and Romansh — and their squad typically includes speakers of all four.',
    colors: ['#FF0000', '#FFFFFF'],
  },
  austria: {
    id: 'austria', name: 'Austria', shortName: 'AUT',
    flag: '🇦🇹', confederation: 'UEFA', fifaRank: 25,
    bestResult: '3rd place (1954)',
    wildFact: 'Austria won the "Miracle of Córdoba" — their 3-2 win over West Germany in 1978 eliminated them despite both sides wanting a score to keep them both through.',
    colors: ['#ED2939', '#FFFFFF'],
  },
  denmark: {
    id: 'denmark', name: 'Denmark', shortName: 'DEN',
    flag: '🇩🇰', confederation: 'UEFA', fifaRank: 21,
    bestResult: 'Quarter-final (1998)',
    wildFact: 'Denmark qualified for Euro 1992 as a late replacement — after being eliminated — and won the entire tournament.',
    colors: ['#C60C30', '#FFFFFF'],
  },
  poland: {
    id: 'poland', name: 'Poland', shortName: 'POL',
    flag: '🇵🇱', confederation: 'UEFA', fifaRank: 27,
    bestResult: '3rd place (1974, 1982)',
    wildFact: 'Robert Lewandowski scored Poland\'s first-ever World Cup hat-trick in 2022, 60+ years into their World Cup history.',
    colors: ['#DC143C', '#FFFFFF'],
  },
  serbia: {
    id: 'serbia', name: 'Serbia', shortName: 'SRB',
    flag: '🇷🇸', confederation: 'UEFA', fifaRank: 33,
    bestResult: 'Winners as Yugoslavia (1930, semi-final)',
    wildFact: 'Serbia has produced more top-level goalkeepers per capita than any other country in the world.',
    colors: ['#C6363C', '#0C4076'],
  },
  turkey: {
    id: 'turkey', name: 'Turkey', shortName: 'TUR',
    flag: '🇹🇷', confederation: 'UEFA', fifaRank: 29,
    bestResult: '3rd place (2002)',
    wildFact: 'Turkey\'s 2002 World Cup run is the only time a first-time semi-finalist has come 3rd — they were a true tournament Cinderella.',
    colors: ['#E30A17', '#FFFFFF'],
  },
  scotland: {
    id: 'scotland', name: 'Scotland', shortName: 'SCO',
    flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation: 'UEFA', fifaRank: 38,
    bestResult: 'Group stage (1974, 1978, 1982, 1986, 1990, 1998)',
    wildFact: 'Scotland appeared in 8 World Cups and never got past the group stage — but always scored at least one goal.',
    colors: ['#003F87', '#FFFFFF'],
  },
  // CAF
  morocco: {
    id: 'morocco', name: 'Morocco', shortName: 'MAR',
    flag: '🇲🇦', confederation: 'CAF', fifaRank: 17,
    bestResult: '4th place (2022)',
    wildFact: 'Morocco became the first African/Arab nation to reach a World Cup semi-final when they got to the last 4 in 2022.',
    colors: ['#C1272D', '#006233'],
  },
  senegal: {
    id: 'senegal', name: 'Senegal', shortName: 'SEN',
    flag: '🇸🇳', confederation: 'CAF', fifaRank: 23,
    bestResult: 'Quarter-final (2002)',
    wildFact: 'Senegal beat reigning champions France in their very first World Cup game in 2002, one of the greatest upsets in tournament history.',
    colors: ['#00853F', '#FDEF42'],
  },
  nigeria: {
    id: 'nigeria', name: 'Nigeria', shortName: 'NGA',
    flag: '🇳🇬', confederation: 'CAF', fifaRank: 35,
    bestResult: 'Round of 16 (1994, 1998, 2014)',
    wildFact: 'Nigeria\'s Super Eagles kit from 2018 was so popular that Nike sold 3 million shirts in under 24 hours.',
    colors: ['#008751', '#FFFFFF'],
  },
  egypt: {
    id: 'egypt', name: 'Egypt', shortName: 'EGY',
    flag: '🇪🇬', confederation: 'CAF', fifaRank: 42,
    bestResult: 'Group stage (1934, 1990)',
    wildFact: 'Egypt won the Africa Cup of Nations a record 7 times — more than any other nation — yet has only appeared at 3 World Cups.',
    colors: ['#CE1126', '#FFFFFF'],
  },
  ivory_coast: {
    id: 'ivory_coast', name: 'Côte d\'Ivoire', shortName: 'CIV',
    flag: '🇨🇮', confederation: 'CAF', fifaRank: 44,
    bestResult: 'Group stage (2006, 2010, 2014)',
    wildFact: 'Didier Drogba once brokered a ceasefire in the Ivorian civil war using his post-game speech after a qualifying win.',
    colors: ['#F77F00', '#009A44'],
  },
  algeria: {
    id: 'algeria', name: 'Algeria', shortName: 'ALG',
    flag: '🇩🇿', confederation: 'CAF', fifaRank: 36,
    bestResult: 'Round of 16 (2014)',
    wildFact: 'Algeria stunned Germany in 2014 with a spirited last-16 display, going to extra time before losing — one of the best Round-of-16 games ever played.',
    colors: ['#006233', '#FFFFFF'],
  },
  ghana: {
    id: 'ghana', name: 'Ghana', shortName: 'GHA',
    flag: '🇬🇭', confederation: 'CAF', fifaRank: 56,
    bestResult: 'Quarter-final (2010)',
    wildFact: 'Ghana came within a handball and a missed penalty of becoming the first African nation in a World Cup semi-final in 2010.',
    colors: ['#006B3F', '#FCD116'],
  },
  cameroon: {
    id: 'cameroon', name: 'Cameroon', shortName: 'CMR',
    flag: '🇨🇲', confederation: 'CAF', fifaRank: 48,
    bestResult: 'Quarter-final (1990)',
    wildFact: 'Roger Milla\'s iconic dancing goal celebration at the 1990 World Cup was so beloved that tournament organizers lowered the retirement age rule just for him.',
    colors: ['#007A5E', '#CE1126'],
  },
  south_africa: {
    id: 'south_africa', name: 'South Africa', shortName: 'RSA',
    flag: '🇿🇦', confederation: 'CAF', fifaRank: 60,
    bestResult: 'Group stage (1998, 2002, 2010)',
    wildFact: 'South Africa in 2010 became the only host nation to ever be eliminated in the group stage of a World Cup.',
    colors: ['#007749', '#FFB612'],
  },
  // AFC
  japan: {
    id: 'japan', name: 'Japan', shortName: 'JPN',
    flag: '🇯🇵', confederation: 'AFC', fifaRank: 18,
    bestResult: 'Round of 16 (2002, 2010, 2022)',
    wildFact: 'Japan\'s fans are famous for cleaning up the stadium after games — a tradition that began in 2014 and has since spread worldwide.',
    colors: ['#BC002D', '#FFFFFF'],
  },
  south_korea: {
    id: 'south_korea', name: 'South Korea', shortName: 'KOR',
    flag: '🇰🇷', confederation: 'AFC', fifaRank: 22,
    bestResult: '4th place (2002)',
    wildFact: 'South Korea\'s 2002 run to the semi-finals as co-host remains the greatest overachievement in World Cup history by any Asian nation.',
    colors: ['#003087', '#CD2E3A'],
  },
  australia: {
    id: 'australia', name: 'Australia', shortName: 'AUS',
    flag: '🇦🇺', confederation: 'AFC', fifaRank: 24,
    bestResult: 'Round of 16 (2006, 2022)',
    wildFact: 'Australia qualified for 2022 via an intercontinental playoff, beating Peru on penalties to end a 30-year wait to return to the tournament.',
    colors: ['#00843D', '#FFD700'],
  },
  iran: {
    id: 'iran', name: 'Iran', shortName: 'IRN',
    flag: '🇮🇷', confederation: 'AFC', fifaRank: 32,
    bestResult: 'Group stage (1978, 1998, 2006, 2014, 2018, 2022)',
    wildFact: 'Iran is the most qualified Asian team in World Cup history with 6 appearances, yet has never made it past the group stage.',
    colors: ['#239F40', '#FFFFFF'],
  },
  saudi_arabia: {
    id: 'saudi_arabia', name: 'Saudi Arabia', shortName: 'KSA',
    flag: '🇸🇦', confederation: 'AFC', fifaRank: 56,
    bestResult: 'Round of 16 (1994)',
    wildFact: 'Saudi Arabia\'s 2-1 win over Argentina in 2022 was voted the greatest upset in World Cup history in a fan poll.',
    colors: ['#006C35', '#FFFFFF'],
  },
  jordan: {
    id: 'jordan', name: 'Jordan', shortName: 'JOR',
    flag: '🇯🇴', confederation: 'AFC', fifaRank: 67,
    bestResult: 'First World Cup appearance (2026)',
    wildFact: 'Jordan qualified for their first-ever World Cup in 2026, ending decades of near-misses in Asian qualifying.',
    colors: ['#007A3D', '#CE1126'],
  },
  uzbekistan: {
    id: 'uzbekistan', name: 'Uzbekistan', shortName: 'UZB',
    flag: '🇺🇿', confederation: 'AFC', fifaRank: 63,
    bestResult: 'First World Cup appearance (2026)',
    wildFact: 'Uzbekistan\'s 2026 qualification ended Central Asia\'s 30-year absence from the World Cup stage.',
    colors: ['#1EB53A', '#0099B5'],
  },
  iraq: {
    id: 'iraq', name: 'Iraq', shortName: 'IRQ',
    flag: '🇮🇶', confederation: 'AFC', fifaRank: 71,
    bestResult: 'Group stage (1986)',
    wildFact: 'Iraq won the 2007 AFC Asian Cup against all odds during a period of civil conflict, uniting the country in celebration.',
    colors: ['#CE1126', '#FFFFFF'],
  },
  // OFC
  new_zealand: {
    id: 'new_zealand', name: 'New Zealand', shortName: 'NZL',
    flag: '🇳🇿', confederation: 'OFC', fifaRank: 98,
    bestResult: 'Group stage (1982, 2010)',
    wildFact: 'New Zealand went unbeaten in the 2010 World Cup group stage, drawing all three games — yet still were eliminated.',
    colors: ['#000000', '#FFFFFF'],
  },
  // Playoff qualifiers
  venezuela: {
    id: 'venezuela', name: 'Venezuela', shortName: 'VEN',
    flag: '🇻🇪', confederation: 'CONMEBOL', fifaRank: 41,
    bestResult: 'First World Cup appearance (2026)',
    wildFact: 'Venezuela finally broke their World Cup duck in 2026 qualification, ending the only CONMEBOL nation\'s drought with a dramatic playoff win.',
    colors: ['#CF142B', '#003893'],
  },
  tunisia: {
    id: 'tunisia', name: 'Tunisia', shortName: 'TUN',
    flag: '🇹🇳', confederation: 'CAF', fifaRank: 34,
    bestResult: 'Group stage (1978, 1998, 2002, 2006, 2018, 2022)',
    wildFact: 'Tunisia beat defending champions France 1-0 in the 2022 group stage but were still eliminated — mirroring their famous 1978 win over Mexico.',
    colors: ['#E70013', '#FFFFFF'],
  },
};
