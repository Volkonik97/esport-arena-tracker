import { supabase } from "@/integrations/supabase/client";
import { getTeamLogoUrl } from "./leaguepedia-service";
import { getLeagueLogo, isKnownLeague } from "@/config/league-logos";

interface LogoResponse {
  logoUrl: string | null;
  cached?: boolean;
}

// Logos connus en fallback si l'API échoue
const FALLBACK_LOGOS: Record<string, string> = {
  // Équipes majeures LEC
  'G2 Esports': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FG2-FullonDark.png',
  'Fnatic': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1631819669850_fnatic-2021-worlds.png',
  'MAD Lions': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FMad-Lions-Logo-FullonDark.png',
  'Team BDS': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1704455868712_BDS_2024_FullColor.png',
  'Excel': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FXL-FullonDark.png',
  'SK Gaming': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FSK-FullonDark.png',
  
  // Ajouts spéciaux pour les équipes problématiques
  'Karmine Corp': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/2d/Karmine_Corplogo_square.png?format=original',
  'Rogue': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a4/Rogue_%28European_Team%29logo_square.png?format=original',
  'Talon': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/66/TALON_%28Hong_Kong_Team%29logo_profile.png?format=original',
  
  // Équipes majeures LCK
  'T1': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1631819360134_t1-2021-worlds.png',
  'Gen.G': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1631819238354_geng-2021-worlds.png',
  'Dplus KIA': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FDPLUS_KIA.png',
  'KT Rolster': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2Fkt_darkbg.png',
  
  // Équipes majeures LPL
  'JD Gaming': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1627457924722_JDG_Logo_200407-05.png',
  'Bilibili Gaming': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FBLG-FullonDark.png',
  'Weibo Gaming': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FWBG-FullonDark.png',
  'LNG Esports': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FLNG-FullonDark.png',
  
  // Équipes majeures LCS
  'Cloud9': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1631819887391_cloud9-2021-worlds.png',
  'Team Liquid': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1631819843362_tl-2021-worlds.png',
  '100 Thieves': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F100T-FullonDark.png',
  'NRG': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FNRG-FullonDark.png',
  
  // Équipes majeures LFL
  'LDLC OL': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FLDLC-FullonDark.png',
  'Vitality.Bee': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FVIT-FullonDark.png',
  'BK ROG': 'https://am-a.akamaihd.net/image?resize=60:60&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2FBKROG-FullonDark.png',
};

// Normalise le nom d'une équipe pour la recherche de fallback
function normalizeTeamName(name: string): string {
  // Supprime les caractères spéciaux et met en minuscules
  const normalized = name.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/esports?/g, '')
    .replace(/gaming/g, '')
    .trim();
  
  // Map des alias connus
  const aliases: Record<string, string> = {
    'geng': 'gen.g',
    'dpk': 'dplus kia',
    'dk': 'dplus kia',
    'blg': 'bilibili gaming',
    'c9': 'cloud9',
    'tl': 'team liquid',
    '100t': '100 thieves',
    'kcorp': 'karmine corp',
    'karmineorp': 'karmine corp',
    'bds': 'team bds',
    'rge': 'rogue',
  };
  
  return aliases[normalized] || normalized;
}

/**
 * Sauvegarde une URL de logo dans Supabase
 */
async function saveLogoToCache(
  entityType: 'team' | 'tournament',
  name: string,
  logoUrl: string,
  isFallback: boolean = false
): Promise<void> {
  // Ne pas sauvegarder les fallbacks codés en dur
  if (isFallback) return;
  
  try {
    // Utiliser upsert pour éviter les conflits, mais ne pas inclure le champ updated_at
    // car il peut ne pas exister dans toutes les installations de Supabase
    const { error } = await supabase
      .from('assets')
      .upsert({
        entity_type: entityType,
        name,
        logo_url: logoUrl
      }, {
        onConflict: 'entity_type,name'
      });

    if (error) {
      console.warn('[Logo] Failed to save to cache:', error);
      return;
    }

    console.log(`[Logo] Saved to cache: ${name}`);
  } catch (error) {
    console.warn('[Logo] Error saving to cache:', error);
  }
}

// Vérifie si une URL est celle de Wikia/Fandom et la nettoie si nécessaire
function cleanWikiaUrl(url: string): string {
  if (!url) return url;
  
  // Si l'URL est déjà propre, la retourner telle quelle
  if (!url.includes('wikia.nocookie.net') && !url.includes('static.wikia.nocookie.net')) {
    return url;
  }
  
  try {
    // Nettoyer l'URL pour éviter les problèmes de cache et de redirection
    let cleanedUrl = url.replace(/^http:/, 'https:');
    
    // Supprimer les paramètres /revision/latest qui causent des problèmes
    if (cleanedUrl.includes('/revision/latest')) {
      // Retirer la partie revision et tout ce qui suit
      cleanedUrl = cleanedUrl.split('/revision/')[0];
      // Ajouter un timestamp pour éviter le cache
      cleanedUrl += `?format=original&nocache=${Date.now()}`;
    }
    
    console.log(`[Logo] Cleaned Wikia URL from ${url} to ${cleanedUrl}`);
    return cleanedUrl;
  } catch (e) {
    console.error('[Logo] Error cleaning Wikia URL:', e);
    return url;
  }
}

export async function getLogo(
  entityType: 'team' | 'tournament',
  name: string,
  defaultLogo?: string
): Promise<string> {
  console.log(`[Logo] Fetching ${entityType} logo for: ${name}`);
  
  try {
    // Vérifier les cas spéciaux directs en premier
    const specialCases = {
      'Karmine Corp': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/2d/Karmine_Corplogo_square.png?format=original',
      'Rogue': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a4/Rogue_%28European_Team%29logo_square.png?format=original',
      'Talon': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/66/TALON_%28Hong_Kong_Team%29logo_profile.png?format=original',
      'Rogue (European Team)': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a4/Rogue_%28European_Team%29logo_square.png?format=original',
      'TALON (Hong Kong Team)': 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/66/TALON_%28Hong_Kong_Team%29logo_profile.png?format=original'
    };
    
    if (entityType === 'team' && specialCases[name]) {
      console.log(`[Logo] Using special case direct URL for ${name}`);
      return specialCases[name];
    }
    
    // 1. Si c'est une compétition, vérifier si on peut générer son logo
    if (entityType === 'tournament' && isKnownLeague(name)) {
      const logoUrl = getLeagueLogo(name);
      if (logoUrl) {
        console.log(`[Logo] Generated logo URL for ${name}`);
        return logoUrl;
      }
    }

    // 2. Vérifier dans Supabase
    const { data: cachedLogo, error: cacheError } = await supabase
      .from('assets')
      .select('logo_url')
      .eq('entity_type', entityType)
      .eq('name', name)
      .maybeSingle();

    if (!cacheError && cachedLogo?.logo_url) {
      console.log(`[Logo] Cache hit for ${entityType} ${name}`);
      return cleanWikiaUrl(cachedLogo.logo_url);
    }
    
    console.log(`[Logo] Not in cache, fetching from API...`);

    // 3. Vérifier les logos connus en fallback
    if (entityType === 'team') {
      // Vérifier le nom exact
      if (FALLBACK_LOGOS[name]) {
        console.log(`[Logo] Using known fallback for ${name}`);
        return FALLBACK_LOGOS[name];
      }
      
      // Vérifier avec le nom normalisé
      const normalizedName = normalizeTeamName(name);
      const fallbackKey = Object.keys(FALLBACK_LOGOS).find(key => 
        normalizeTeamName(key) === normalizedName
      );
      
      if (fallbackKey) {
        console.log(`[Logo] Using fallback logo for ${name} (matched ${fallbackKey})`);
        return FALLBACK_LOGOS[fallbackKey];
      }
    }

    // 4. Si c'est une équipe, essayer l'API Leaguepedia
    if (entityType === 'team') {
      console.log(`[Logo] Fetching from Leaguepedia API for ${name}`);
      try {
        const logoUrl = await getTeamLogoUrl(name);
        
        if (logoUrl) {
          // Nettoyer l'URL si nécessaire
          const cleanedUrl = cleanWikiaUrl(logoUrl);
          
          // Sauvegarder dans Supabase pour la prochaine fois
          await saveLogoToCache(entityType, name, cleanedUrl);
          return cleanedUrl;
        }
      } catch (error) {
        console.error(`[Logo] API internal error for team ${name}:`, error);
      }
    }

    // 5. En dernier recours, utiliser le logo par défaut
    console.log(`[Logo] No logo found for ${name}, using default`);
    return defaultLogo || '/placeholder.svg';
    
  } catch (error) {
    console.error('[Logo] Error fetching logo:', error);
    return defaultLogo || '/placeholder.svg';
  }
}
