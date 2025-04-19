
/**
 * Utilitaire pour obtenir l'URL du logo d'une équipe via l'Edge Function Leaguepedia
 */
export async function fetchTeamLogo(teamName: string): Promise<string | null> {
  try {
    console.log(`[fetchTeamLogo] Requesting logo for: ${teamName}`);
    
    // Cas spéciaux directs pour les équipes problématiques
    const directMappings: Record<string, string> = {
      "Karmine Corp": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/2d/Karmine_Corplogo_square.png?format=original",
      "Rogue": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a4/Rogue_%28European_Team%29logo_square.png?format=original",
      "Talon": "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/66/TALON_%28Hong_Kong_Team%29logo_profile.png?format=original"
    };
    
    if (directMappings[teamName]) {
      console.log(`[fetchTeamLogo] Using direct mapping for ${teamName}`);
      return directMappings[teamName];
    }
    
    // Use the full Supabase project URL
    const res = await fetch('https://dtddoxxazhmfudrvpszu.supabase.co/functions/v1/leaguepedia', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGRveHhhemhtZnVkcnZwc3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMjMwNjUsImV4cCI6MjA1ODU5OTA2NX0.50-_KqnPLuy33vrh7qZbRHy8lHzC6nOPGJstjUi56dA`,
        'apikey': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGRveHhhemhtZnVkcnZwc3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMjMwNjUsImV4cCI6MjA1ODU5OTA2NX0.50-_KqnPLuy33vrh7qZbRHy8lHzC6nOPGJstjUi56dA`
      },
      body: JSON.stringify({ params: { teamName } }),
    });
  
    if (!res.ok) {
      console.error(`[fetchTeamLogo] HTTP error: ${res.status}`);
      return null;
    }
    
    const json = await res.json();
    const logoUrl = json?.cargoquery?.[0]?.title?.logoUrl;
    
    if (logoUrl) {
      console.log(`[fetchTeamLogo] Success: Got logo URL for ${teamName}`);
      
      // Assurer que l'URL utilise HTTPS
      let secureUrl = logoUrl.replace(/^http:/, 'https:');
      
      // Optimiser les URLs de Wikia
      if (secureUrl.includes('wikia.nocookie.net') || secureUrl.includes('static.wikia.nocookie.net')) {
        // Supprimer les paramètres existants
        if (secureUrl.includes('/revision/latest')) {
          secureUrl = secureUrl.split('/revision/')[0] + `?format=original&nocache=${Date.now()}`;
        }
      }
      
      return secureUrl;
    } else {
      console.warn(`[fetchTeamLogo] No logo URL found for ${teamName}`);
    }
    
    return logoUrl;
  } catch (error) {
    console.error(`[fetchTeamLogo] Error:`, error);
    return null;
  }
}
