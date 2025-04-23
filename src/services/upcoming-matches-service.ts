
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
  const response = await fetch(url);
  const data = await response.json();
  if (!data.cargoquery) return [];
  
  // Add Tournament field to each match for compatibility and map DateTime_UTC to DateTime
  return data.cargoquery.map((item: any) => {
    const match = item.title as UpcomingMatch;
    match.Tournament = match.OverviewPage; // Set Tournament to OverviewPage
    match.DateTime = match.DateTime_UTC; // Set DateTime to DateTime_UTC for compatibility
    return match;
  });
}

export function useUpcomingMatchesForTournament(overviewPage: string, now: string) {
  return useQuery({
    queryKey: ['upcoming-matches', overviewPage, now],
    queryFn: () => fetchUpcomingMatchesForTournament(overviewPage, now),
    enabled: !!overviewPage && !!now,
  });
}
