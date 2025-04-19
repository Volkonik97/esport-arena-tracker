
/**
 * Utilitaire pour obtenir l'URL du logo d'une équipe via l'Edge Function Leaguepedia
 */
export async function fetchTeamLogo(teamName: string): Promise<string | null> {
  try {
    console.log(`[fetchTeamLogo] Requesting logo for: ${teamName}`);
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
      // Make sure the URL uses HTTPS
      return logoUrl.replace(/^http:/, 'https:');
    } else {
      console.warn(`[fetchTeamLogo] No logo URL found for ${teamName}`);
    }
    
    return logoUrl;
  } catch (error) {
    console.error(`[fetchTeamLogo] Error:`, error);
    return null;
  }
}
