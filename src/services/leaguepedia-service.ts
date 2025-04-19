
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
    'rogue': 'rge',
    'karmineorp': 'kcorp',
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
    'nrg': 'nrg'
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
  ];
}

/**
 * Génère différents formats de noms de fichiers pour un nom d'équipe
 */
function generatePossibleFilenames(variant: string): string[] {
  return [
    // Format selon la convention Leaguepedia (prioritaire)
    `${variant}logo_square.png`,
    
    // Formats standards
    `${variant}_logo_square.png`,
    `${variant}logo.png`,
    `${variant}_logo.png`,
    
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
 * Récupère l'URL du logo d'une équipe depuis Leaguepedia
 */
export async function getTeamLogoUrl(teamName: string): Promise<string | null> {
  try {
    // Générer toutes les variantes possibles du nom
    const variants = generateTeamNameVariants(teamName);
    console.log(`[Leaguepedia] Searching logo for "${teamName}"`);
    console.log(`[Leaguepedia] Generated variants:`, variants);
    
    // Essayer chaque variante
    for (const variant of variants) {
      const filenames = generatePossibleFilenames(variant);
      
      // Essayer chaque format de nom de fichier possible
      for (const filename of filenames) {
        try {
          console.log(`[Leaguepedia] Trying filename: ${filename}`);
          const params = new URLSearchParams({
            action: 'query',
            format: 'json',
            titles: `File:${filename}`,
            prop: 'imageinfo',
            iiprop: 'url|timestamp',
            origin: '*'
          });

          const response = await fetch(`${LEAGUEPEDIA_API_URL}?${params}`, {
            headers: {
              'Accept': 'application/json'
            }
          });
          
          if (!response.ok) {
            console.warn(`[Leaguepedia] API returned ${response.status} for ${filename}`);
            continue;
          }

          const data = await response.json();
          const pages = data.query?.pages;
          if (!pages) continue;

          const pageId = Object.keys(pages)[0];
          if (pageId === '-1') continue;

          const imageInfo: ImageInfo = pages[pageId]?.imageinfo?.[0];
          if (!imageInfo?.url) continue;

          const finalUrl = cleanImageUrl(imageInfo.url);
          console.log(`[Leaguepedia] Found logo for ${teamName}: ${finalUrl}`);
          return finalUrl;

        } catch (error) {
          console.warn(`[Leaguepedia] Failed to fetch ${filename}:`, error);
          continue;
        }
      }
    }

    // Si nous n'avons pas trouvé de logo, essayons de chercher directement par équipe
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

      const response = await fetch(`${LEAGUEPEDIA_API_URL}?${params}`);
      if (response.ok) {
        const data = await response.json();
        const html = data.parse?.text?.['*'];
        
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
    console.error('[Leaguepedia] Error fetching team logo:', error);
    return null;
  }
}
