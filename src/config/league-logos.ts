// Mapping des compétitions vers leurs identifiants
const LEAGUE_IDS: Record<string, string> = {
  // Ligues majeures
  'LEC': '1592516184297_LEC-01-FullonDark',
  'LCS': '1592516315279_LCS-01-FullonDark',
  'LCK': 'lck-color-on-black',
  'LPL': '1592516115322_LPL-01-FullonDark',
  'CBLOL': '1592516401726_CBLOL-01-FullonDark',
  'LLA': '1592516373353_LLA-01-FullonDark',
  'PCS': 'https://am-a.akamaihd.net/image?resize=32:&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1592515942679_PCS-01-FullonDark.png',
  'VCS': 'vcs-color-on-black',
  'LJL': 'https://am-a.akamaihd.net/image?resize=32:&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1733997208721_LJL_icon_white_724px.png',
  'TCL': 'https://static.lolesports.com/leagues/1740390007442_FULL_COLOR_FOR_DARK_BG.png',
  'SL': 'https://static.lolesports.com/leagues/SL21-V-white.png',
  'HLL': 'https://static.lolesports.com/leagues/1736361775356_HLL_FULL_COLOUR_DARKBG.png',
  'LRS': 'https://am-a.akamaihd.net/image?resize=32:&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1742460115671_FULL_COLOR_FOR_DARK_BG.png',
  'LRN': 'https://am-a.akamaihd.net/image?resize=32:&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1742461971444_FULL_COLOR_FOR_DARK_BG1.png',
  'LCP': 'https://am-a.akamaihd.net/image?resize=32:&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1733468139601_lcp-color-golden.png',
  'LCD': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/06/League_Championship_Denmark_logo.png/',
  'NES': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/4/45/Norwegian_Esports_Series_logo.png/',
  'HCC': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/1/19/Hellenic_Challengers_Cup_logo.png/',
  'RTV': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/29/Road_to_VCS_2025_Logo.png',
  'Road of Legends': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/94/TransIP_Road_Of_Legends_logo.png',
  'Liga NEXO': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/91/Liga_Nexo_2020.png',
  'Liga NEXO 2024': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/91/Liga_Nexo_2020.png',
  'Liga NEXO 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/91/Liga_Nexo_2020.png',
  'Liga NEXO Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/91/Liga_Nexo_2020.png',
  'Liga NEXO 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/91/Liga_Nexo_2020.png',
  // Ajout explicite LIT (toutes variantes)
  'LIT': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/8f/LIT_2024_Logo.png',
  'LIT 2024': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/8f/LIT_2024_Logo.png',
  'LIT 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/8f/LIT_2024_Logo.png',
  'LIT Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/8f/LIT_2024_Logo.png',
  'LIT 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/8f/LIT_2024_Logo.png',
  
  // Ajout explicite LPLOL (toutes variantes)
  'LPLOL': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/3/34/LPLOL_2025_logo.png',
  'LPLOL 2024': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/3/34/LPLOL_2025_logo.png',
  'LPLOL 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/3/34/LPLOL_2025_logo.png',
  'LPLOL Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/3/34/LPLOL_2025_logo.png',
  'LPLOL 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/3/34/LPLOL_2025_logo.png',
  
  // Ajout explicite POP Esports (toutes variantes)
  'POP Esports': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/0f/POP_Esports_Masters.png/',
  'POP Esports Masters': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/0f/POP_Esports_Masters.png/',
  'POP Esports 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/0f/POP_Esports_Masters.png/',
  'POP Esports Masters 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/0f/POP_Esports_Masters.png/',
  'POP Esports Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/0f/POP_Esports_Masters.png/',
  'POP Esports 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/0f/POP_Esports_Masters.png/',
  
  // Ajout explicite LigaGG (toutes variantes)
  'LigaGG': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/4/41/CELOL_SERIE_A_Logo.png',
  'LigaGG 2024': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/4/41/CELOL_SERIE_A_Logo.png',
  'LigaGG 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/4/41/CELOL_SERIE_A_Logo.png',
  'LigaGG Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/4/41/CELOL_SERIE_A_Logo.png',
  'LigaGG 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/4/41/CELOL_SERIE_A_Logo.png',
  
  // Événements internationaux
  'Worlds': '1592594612171_WorldsDark',
  'MSI': '1592594634248_MSIDark',
  
  // Ligues régionales européennes
  'LFL': 'https://static.lolesports.com/leagues/LFL_Logo_2020_black1.png',
  'Superliga': 'superliga-color-on-black',
  'Prime League': 'prime-league-color-on-black',
  'NLC': 'https://static.lolesports.com/leagues/1641490922073_nlc_logo.png',
  'Ultraliga': 'ultraliga-color-on-black',
  'Hitpoint Masters': 'hitpoint-masters-color-on-black',
  'Hitpoint Masters 2025 Spring': '1641465237186_HM_white',
  'PG Nationals': 'pg-nationals-color-on-black',
  'Elite Series': 'elite-series-color-on-black',
  'Greek Legends League': 'greek-legends-league-color-on-black',
  'LFL Division 2': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/80/LFL_Division_2.png/',
  'NACL': 'https://am-a.akamaihd.net/image?resize=120:&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1740390007442_FULL_COLOR_FOR_DARK_BG.png',
  'Rift Legends': 'https://am-a.akamaihd.net/image?resize=120:&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1736963779891_Logo_short_lightRL__.png',
  'PRM 1st Division': 'https://static.lolesports.com/leagues/PrimeLeagueResized.png',
  'PRM Pokal': 'https://static.lolesports.com/leagues/PrimeLeagueResized.png',
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
  
  if (leagueId.startsWith('https://')) {
    return leagueId;
  }
  
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
  'LCS': '/leagues/lcs.png',
  'LCS Spring 2025': '/leagues/lcs.png',
  'LCK': generateLogoUrl('LCK') || '',
  'LCK Spring 2025': generateLogoUrl('LCK Spring 2025') || '',
  'LPL': generateLogoUrl('LPL') || '',
  'LPL Spring 2025': generateLogoUrl('LPL Spring 2025') || '',
  'CBLOL': generateLogoUrl('CBLOL') || '',
  'CBLOL 2025': generateLogoUrl('CBLOL 2025') || '',
  'LLA': generateLogoUrl('LLA') || '',
  'LLA 2025': generateLogoUrl('LLA 2025') || '',
  'TCL': 'https://static.lolesports.com/leagues/1740390007442_FULL_COLOR_FOR_DARK_BG.png',
  'TCL 2025': 'https://static.lolesports.com/leagues/1740390007442_FULL_COLOR_FOR_DARK_BG.png',
  'SL': 'https://static.lolesports.com/leagues/SL21-V-white.png',
  'HLL': 'https://static.lolesports.com/leagues/1736361775356_HLL_FULL_COLOUR_DARKBG.png',
  'LRS': 'https://am-a.akamaihd.net/image?resize=32:&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1742460115671_FULL_COLOR_FOR_DARK_BG.png',
  'LRN': 'https://am-a.akamaihd.net/image?resize=32:&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1742461971444_FULL_COLOR_FOR_DARK_BG1.png',
  'LCP': 'https://am-a.akamaihd.net/image?resize=32:&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1733468139601_lcp-color-golden.png',
  'LCD': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/06/League_Championship_Denmark_logo.png/',
  'NES': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/4/45/Norwegian_Esports_Series_logo.png/',
  'HCC': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/1/19/Hellenic_Challengers_Cup_logo.png/',
  'RTV': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/29/Road_to_VCS_2025_Logo.png',
  'Road of Legends': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/94/TransIP_Road_Of_Legends_logo.png',
  'Road Of Legends 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/29/Road_to_VCS_2025_Logo.png',
  'Road of Legends 2025 Spring': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/29/Road_to_VCS_2025_Logo.png',
  'Road of Legends Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/29/Road_to_VCS_2025_Logo.png',
  'Road Of Legends Spring 2025': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/29/Road_to_VCS_2025_Logo.png',
  
  // Événements internationaux
  'Worlds': '/leagues/worlds.png',
  'Worlds 2025': '/leagues/worlds.png',
  'MSI': generateLogoUrl('MSI') || '',
  'MSI 2025': generateLogoUrl('MSI 2025') || '',
  
  // Ligues européennes majeures
  'LFL': 'https://static.lolesports.com/leagues/LFL_Logo_2020_black1.png',
  'LFL 2025': 'https://static.lolesports.com/leagues/LFL_Logo_2020_black1.png',
  'European Masters': generateLogoUrl('European Masters') || '',
  'European Masters Spring 2025': generateLogoUrl('European Masters Spring 2025') || '',
  'Hitpoint Masters': 'https://static.lolesports.com/leagues/1641465237186_HM_white.png',
  'Hitpoint Masters 2025 Spring': 'https://static.lolesports.com/leagues/1641465237186_HM_white.png',
  'NLC': 'https://static.lolesports.com/leagues/1641490922073_nlc_logo.png',
  'LFL Division 2': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/80/LFL_Division_2.png/',
  'NACL': 'https://am-a.akamaihd.net/image?resize=120:&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1740390007442_FULL_COLOR_FOR_DARK_BG.png',
  'Rift Legends': 'https://am-a.akamaihd.net/image?resize=120:&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1736963779891_Logo_short_lightRL__.png',
  'PRM 1st Division': 'https://static.lolesports.com/leagues/PrimeLeagueResized.png',
  'PRM Pokal': 'https://static.lolesports.com/leagues/PrimeLeagueResized.png',
  'PCS': 'https://am-a.akamaihd.net/image?resize=32:&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1592515942679_PCS-01-FullonDark.png',
  'LJL': 'https://am-a.akamaihd.net/image?resize=32:&f=http%3A%2F%2Fstatic.lolesports.com%2Fleagues%2F1733997208721_LJL_icon_white_724px.png',
};
