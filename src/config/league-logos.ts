// Mapping des compétitions vers leurs identifiants
const LEAGUE_IDS: Record<string, string> = {
  // Ligues majeures
  'LEC': '1592516184297_LEC-01-FullonDark',
  'LCS': '1592516315279_LCS-01-FullonDark',
  'LCK': 'lck-color-on-black',
  'LPL': '1592516115322_LPL-01-FullonDark',
  'CBLOL': '1592516401726_CBLOL-01-FullonDark',
  'LLA': '1592516373353_LLA-01-FullonDark',
  'PCS': 'pcs-color-on-black',
  'VCS': 'vcs-color-on-black',
  'LJL': 'ljl-color-on-black',
  
  // Événements internationaux
  'Worlds': '1592594612171_WorldsDark',
  'MSI': '1592594634248_MSIDark',
  
  // Ligues régionales européennes
  'LFL': 'lfl-color-on-black',
  'Superliga': 'superliga-color-on-black',
  'Prime League': 'prime-league-color-on-black',
  'NLC': 'nlc-color-on-black',
  'Ultraliga': 'ultraliga-color-on-black',
  'Hitpoint Masters': 'hitpoint-masters-color-on-black',
  'PG Nationals': 'pg-nationals-color-on-black',
  'Elite Series': 'elite-series-color-on-black',
  'Greek Legends League': 'greek-legends-league-color-on-black',
  
  // Ligues de développement
  'LCS Academy': 'lcs-academy-color-on-black',
  'LFL Division 2': 'lfl-division-2-color-on-black',
  'European Masters': 'european-masters-color-on-black',
};

/**
 * Extrait le nom de base de la compétition (ex: "LEC Spring 2025" -> "LEC")
 */
function getBaseLeagueName(fullName: string): string {
  // Liste des compétitions connues
  const knownLeagues = Object.keys(LEAGUE_IDS);
  
  // Trie les noms par longueur décroissante pour matcher d'abord les noms les plus longs
  // Ex: "LFL Division 2" doit être testé avant "LFL"
  const sortedLeagues = knownLeagues.sort((a, b) => b.length - a.length);
  
  // Trouve la première correspondance
  const match = sortedLeagues.find(league => fullName.includes(league));
  return match || fullName;
}

/**
 * Génère l'URL du logo pour une compétition
 */
function generateLogoUrl(leagueName: string): string | null {
  const baseName = getBaseLeagueName(leagueName);
  const leagueId = LEAGUE_IDS[baseName];
  
  if (!leagueId) return null;
  
  return `https://am-a.akamaihd.net/image?resize=120:120&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F${leagueId}.png`;
}

/**
 * Vérifie si une chaîne correspond à une compétition connue
 */
export function isKnownLeague(name: string): boolean {
  return getBaseLeagueName(name) in LEAGUE_IDS;
}

/**
 * Obtient l'URL du logo pour une compétition
 * Retourne null si la compétition n'est pas connue
 */
export function getLeagueLogo(name: string): string | null {
  return generateLogoUrl(name);
}

// Map des logos pré-générés pour les compétitions actuelles
export const LEAGUE_LOGOS: Record<string, string> = {
  // Ligues majeures
  'LEC': generateLogoUrl('LEC') || '',
  'LEC Spring 2025': generateLogoUrl('LEC Spring 2025') || '',
  'LCS': generateLogoUrl('LCS') || '',
  'LCS Spring 2025': generateLogoUrl('LCS Spring 2025') || '',
  'LCK': generateLogoUrl('LCK') || '',
  'LCK Spring 2025': generateLogoUrl('LCK Spring 2025') || '',
  'LPL': generateLogoUrl('LPL') || '',
  'LPL Spring 2025': generateLogoUrl('LPL Spring 2025') || '',
  'CBLOL': generateLogoUrl('CBLOL') || '',
  'CBLOL 2025': generateLogoUrl('CBLOL 2025') || '',
  'LLA': generateLogoUrl('LLA') || '',
  'LLA 2025': generateLogoUrl('LLA 2025') || '',
  
  // Événements internationaux
  'Worlds': generateLogoUrl('Worlds') || '',
  'Worlds 2025': generateLogoUrl('Worlds 2025') || '',
  'MSI': generateLogoUrl('MSI') || '',
  'MSI 2025': generateLogoUrl('MSI 2025') || '',
  
  // Ligues européennes majeures
  'LFL': generateLogoUrl('LFL') || '',
  'LFL 2025': generateLogoUrl('LFL 2025') || '',
  'European Masters': generateLogoUrl('European Masters') || '',
  'European Masters Spring 2025': generateLogoUrl('European Masters Spring 2025') || '',
};
