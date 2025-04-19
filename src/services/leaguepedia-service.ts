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
 * Génère différentes variantes du nom d'une équipe
 */
function generateTeamNameVariants(teamName: string): string[] {
  const baseNameWithoutParentheses = teamName.replace(/\s*\([^)]*\)/g, '').trim();
  const baseName = sanitizeTeamName(teamName);
  
  return [
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
    // Formats standards
    `${variant}logo_square.png`,
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

    console.warn(`[Leaguepedia] No logo found for team: ${teamName}`);
    return null;

  } catch (error) {
    console.error('[Leaguepedia] Error fetching team logo:', error);
    return null;
  }
}
