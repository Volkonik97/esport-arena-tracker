
import { useQuery } from '@tanstack/react-query';

export interface UpcomingMatch {
  DateTime_UTC: string;
  DateTime?: string; // Add this field for compatibility
  Team1: string;
  Team2: string;
  Team1Score: string;
  Team2Score: string;
  OverviewPage: string;
  Tournament?: string; // Add this field for compatibility with the code using it
}

export async function fetchUpcomingMatchesForTournament(overviewPage: string, now: string): Promise<UpcomingMatch[]> {
  const url = `https://lol.fandom.com/api.php?action=cargoquery&tables=MatchSchedule&fields=MatchSchedule.DateTime_UTC,MatchSchedule.Team1,MatchSchedule.Team2,MatchSchedule.Team1Score,MatchSchedule.Team2Score,MatchSchedule.OverviewPage&where=MatchSchedule.OverviewPage="${encodeURIComponent(overviewPage)}"%20AND%20MatchSchedule.DateTime_UTC>"${now}"&limit=500&format=json&origin=*`;
  
  console.log('[DEBUG upcoming-matches-service] Fetching URL:', url);
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.cargoquery) {
    console.error('[DEBUG upcoming-matches-service] No cargoquery in response:', data);
    return [];
  }
  
  // Logging raw data to debug date issues
  console.log('[DEBUG upcoming-matches-service] Raw matches data:', data.cargoquery);
  
  // Map DateTime_UTC to DateTime for compatibility and ensure both fields exist
  const matches = data.cargoquery.map((item: any) => {
    // Extract the title object which contains our match data
    const match = item.title as UpcomingMatch;
    
    // Log individual match date before processing
    console.log('[DEBUG upcoming-matches-service] Match raw date:', match.DateTime_UTC);
    
    // Ensure both DateTime fields are set correctly
    if (!match.DateTime && match.DateTime_UTC) {
      match.DateTime = match.DateTime_UTC;
    }
    
    // Set Tournament to OverviewPage for compatibility with the code using it
    match.Tournament = match.OverviewPage;
    
    return match;
  });
  
  // Log processed matches with dates
  console.log('[DEBUG upcoming-matches-service] Processed matches:', 
    matches.map(m => ({
      teams: `${m.Team1} vs ${m.Team2}`,
      date: m.DateTime_UTC
    }))
  );
  
  return matches;
}

export function useUpcomingMatchesForTournament(overviewPage: string, now: string) {
  return useQuery({
    queryKey: ['upcoming-matches', overviewPage, now],
    queryFn: () => fetchUpcomingMatchesForTournament(overviewPage, now),
    enabled: !!overviewPage && !!now,
  });
}
