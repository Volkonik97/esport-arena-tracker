/**
 * Service pour interagir avec l'API Leaguepedia
 */

const LEAGUEPEDIA_API_URL = 'https://lol.fandom.com/api.php';

interface ImageInfo {
  url: string;
  thumburl?: string;
  timestamp?: string;
}

/**
 * Nettoie le nom de l'équipe pour la recherche d'image
 */
function sanitizeTeamName(teamName: string): string {
  // Supprimer tout ce qui est entre parenthèses
  const nameWithoutParentheses = teamName.replace(/\s*\([^)]*\)/g, '');
  
  return nameWithoutParentheses
    .replace(/\./g, '') // Supprimer les points
    .replace(/\s+/g, '_') // Remplacer les espaces par des underscores
    .replace(/'/g, '') // Supprimer les apostrophes
    .replace(/&/g, 'and') // Remplacer & par and
    .replace(/[^\w\-]/g, '') // Supprimer tous les caractères spéciaux restants
    .trim();
}

/**
 * Formatte le nom selon la convention Leaguepedia Teamnames
 * Dans Leaguepedia, les noms de fichiers suivent souvent {{#var:teamLink}}logo_square.png
 * où teamLink est défini dans les modèles Teamnames
 */
function formatTeamLinkName(teamName: string): string {
  // Règles de base pour team link (simplifiées des modèles Teamnames de Leaguepedia)
  teamName = teamName.toLowerCase()
    .replace(/\s+esports?$/i, '') // Enlever "Esports" ou "Esport" à la fin
    .replace(/\s+gaming$/i, '')   // Enlever "Gaming" à la fin
    .replace(/^team\s+/i, '')     // Enlever "Team" au début
    .replace(/[.\s']/g, '')       // Enlever les espaces, points et apostrophes
    .replace(/&/g, 'and');        // Remplacer & par and
  
  // Traiter les cas spéciaux connus
  const specialCases: Record<string, string> = {
    'g2': 'g2',
    'fnatic': 'fnc',
    'rogue': 'rogue_(european_team)', // Corriger: Utiliser nom complet pour Rogue
    'karminecorp': 'karmine_corp', // Correction pour Karmine Corp
    'karmineorp': 'karmine_corp', // Alternative pour Karmine Corp
    'kcorp': 'karmine_corp', // Alternative pour K-Corp
    'excellondon': 'xl',
    'madlions': 'mad',
    'teamliquid': 'tl',
    'cloud9': 'c9',
    'skgaming': 'sk',
    'teambds': 'bds',
    'geng': 'gen',
    'dpluskia': 'dk',
    't1': 't1',
    'ktrolster': 'kt',
    'hanwhalifesports': 'hle',
    'drx': 'drx',
    'bilibiligaming': 'blg',
    'weibogaming': 'wbg',
    'jdgaming': 'jdg',
    'lgdesports': 'ldg',
    'topesports': 'tes',
    'edwardgaming': 'edg',
    '100thieves': '100',
    'flyquest': 'fly',
    'evilgeniuses': 'eg',
    'nrg': 'nrg',
    'talon': 'talon_(hong_kong_team)', // Correction pour Talon
  };
  
  // Vérifier si nous avons un cas spécial
  for (const [key, value] of Object.entries(specialCases)) {
    if (teamName.includes(key)) {
      return value;
    }
  }
  
  // Sinon retourner les 3-4 premiers caractères ou le nom complet si court
  return teamName.length <= 4 ? teamName : teamName.substring(0, 4);
}

/**
 * Génère différentes variantes du nom d'une équipe
 */
function generateTeamNameVariants(teamName: string): string[] {
  const baseNameWithoutParentheses = teamName.replace(/\s*\([^)]*\)/g, '').trim();
  const baseName = sanitizeTeamName(teamName);
  const teamLinkName = formatTeamLinkName(teamName);
  
  return [
    // Format teamLink (prioritaire selon la convention Leaguepedia)
    teamLinkName,
    
    // Cas spécifiques pour certaines équipes
    teamName === "Karmine Corp" ? "karmine_corp" : null,
    teamName === "Rogue" ? "rogue_(european_team)" : null,
    teamName === "Talon" ? "talon_(hong_kong_team)" : null,
    
    // Variantes du nom complet
    baseName,
    baseName.toLowerCase(),
    baseName.replace(/_/g, ''),
    
    // Variantes sans parenthèses
    sanitizeTeamName(baseNameWithoutParentheses),
    sanitizeTeamName(baseNameWithoutParentheses).toLowerCase(),
    baseNameWithoutParentheses.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
    
    // Variantes avec casse différente
    teamName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
    baseNameWithoutParentheses.toUpperCase(),
    baseNameWithoutParentheses.toLowerCase()
  ].filter(Boolean) as string[]; // Filtrer les valeurs null
}

/**
 * Génère différents formats de noms de fichiers pour un nom d'équipe
 */
function generatePossibleFilenames(variant: string): string[] {
  const formats = [
    // Format selon la convention Leaguepedia (prioritaire)
    `${variant}logo_square.png`,
    
    // Formats standards
    `${variant}_logo_square.png`,
    `${variant}logo.png`,
    `${variant}_logo.png`,
    
    // Format profile (utilisé par certaines équipes comme Talon)
    `${variant}logo_profile.png`,
    `${variant}_logo_profile.png`,
    
    // Formats avec année
    `${variant}_2024_logo_square.png`,
    `${variant}_2023_logo_square.png`,
    
    // Formats alternatifs
    `${variant}_standard.png`,
    `${variant}_icon.png`,
    
    // Formats avec casse différente
    `${variant.toUpperCase()}logo_square.png`,
    `${variant.toLowerCase()}logo_square.png`
  ];
  
  // Pour les cas spéciaux comme "(European_Team)" ou "(Hong_Kong_Team)"
  // où le format peut être différent
  if (variant.includes("_team)")) {
    formats.push(`${variant.replace(/\)$/, "")}logo_square.png)`);
    formats.push(`${variant.replace(/\)$/, "")}logo_profile.png)`);
    
    // Ajouter des variantes sans parenthèses
    const baseNameWithoutParentheses = variant.replace(/\([^)]*\)/g, '').trim();
    if (baseNameWithoutParentheses) {
      formats.push(`${baseNameWithoutParentheses}logo_square.png`);
      formats.push(`${baseNameWithoutParentheses}_logo_square.png`);
    }
  }
  
  return formats;
}

/**
 * Nettoie l'URL de l'image pour éviter les problèmes de cache
 */
function cleanImageUrl(url: string): string {
  // Supprimer les paramètres existants
  const baseUrl = url.split('/revision/')[0];
  // Ajouter nos propres paramètres
  return `${baseUrl}?format=original&nocache=${Date.now()}`;
}

/**
 * Récupère l'URL du logo d'une équipe depuis Leaguepedia en utilisant l'API pageimages
 */
export async function getTeamLogoUrl(teamName: string): Promise<string | null> {
  try {
    // Cas spéciaux pour les équipes problématiques
    const specialCases: Record<string, string> = {
      "Talon": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/66/TALON_%28Hong_Kong_Team%29logo_profile.png",
      "TALON (Hong Kong Team)": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/66/TALON_%28Hong_Kong_Team%29logo_profile.png",
      // Cas spécial pour Lyon
      "LYON (2024 American Team)": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/01/LYON_%282024_American_Team%29logo_profile.png/revision/latest/scale-to-width-down/220?cb=20250109185841",
      "Lyon (2024 American Team)": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/01/LYON_%282024_American_Team%29logo_profile.png/revision/latest/scale-to-width-down/220?cb=20250109185841",
      "Lyon": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/01/LYON_%282024_American_Team%29logo_profile.png/revision/latest/scale-to-width-down/220?cb=20250109185841",
      "LYON": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/01/LYON_%282024_American_Team%29logo_profile.png/revision/latest/scale-to-width-down/220?cb=20250109185841",
      // Cas spécial pour Rogue
      "Rogue": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a4/Rogue_%28European_Team%29logo_square.png/revision/latest/scale-to-width-down/220?cb=20231125191715",
      "ROGUE": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a4/Rogue_%28European_Team%29logo_square.png/revision/latest/scale-to-width-down/220?cb=20231125191715",
      "Rogue (European Team)": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a4/Rogue_%28European_Team%29logo_square.png/revision/latest/scale-to-width-down/220?cb=20231125191715",
      "ROGUE (EUROPEAN TEAM)": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a4/Rogue_%28European_Team%29logo_square.png/revision/latest/scale-to-width-down/220?cb=20231125191715",
    };
    
    if (specialCases[teamName]) {
      console.log(`[Leaguepedia][DEBUG] Cas spécial utilisé pour ${teamName} : ${specialCases[teamName]}`);
      return cleanImageUrl(specialCases[teamName]);
    }
    
    console.log(`[Leaguepedia] Searching logo for "${teamName}" using pageimages API`);
    
    // Utiliser axios pour la requête
    const response = await fetch(`${LEAGUEPEDIA_API_URL}?${new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: teamName,
      prop: 'pageimages',
      piprop: 'original',
      origin: '*'
    })}`);
    
    if (!response.ok) {
      console.warn(`[Leaguepedia] API returned ${response.status} for ${teamName}`);
      return null;
    }
    
    const data = await response.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    
    const page = Object.values(pages)[0] as any;
    
    if (page.original) {
      const logoUrl = page.original.source;
      console.log(`[Leaguepedia] Found logo for ${teamName}: ${logoUrl}`);
      // Ajout log spécifique pour Lyon
      if (/lyon/i.test(teamName)) {
        console.log(`[Leaguepedia][DEBUG] Pour LYON, URL trouvée: ${logoUrl}`);
      }
      return cleanImageUrl(logoUrl);
    }
    
    // Si nous n'avons pas trouvé de logo, essayons avec le modèle TeamPart
    try {
      console.log(`[Leaguepedia] Attempting to search team directly: ${teamName}`);
      // Essayer une requête directe avec le modèle TeamPart
      const params = new URLSearchParams({
        action: 'parse',
        format: 'json',
        text: `{{TeamPart|${teamName}}}`,
        contentmodel: 'wikitext',
        origin: '*'
      });

      const teamPartResponse = await fetch(`${LEAGUEPEDIA_API_URL}?${params}`);
      if (teamPartResponse.ok) {
        const teamPartData = await teamPartResponse.json();
        const html = teamPartData.parse?.text?.['*'];
        
        // Extraire l'URL de l'image si elle existe dans la réponse
        if (html && typeof html === 'string') {
          const imageMatch = html.match(/src="([^"]+)"/);
          if (imageMatch && imageMatch[1]) {
            const imageUrl = imageMatch[1].replace(/^\/\//, 'https://');
            console.log(`[Leaguepedia] Found logo through TeamPart: ${imageUrl}`);
            return cleanImageUrl(imageUrl);
          }
        }
      }
    } catch (error) {
      console.warn(`[Leaguepedia] Failed to use TeamPart template:`, error);
    }
    
    console.warn(`[Leaguepedia] No logo found for team: ${teamName}`);
    return null;
  } catch (error) {
    console.error(`[Leaguepedia] Error fetching logo for ${teamName}:`, error);
    return null;
  }
}
