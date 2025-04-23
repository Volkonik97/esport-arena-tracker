import { useQuery } from '@tanstack/react-query';

export interface UpcomingMatch {
  DateTime_UTC: string;
  Team1: string;
  Team2: string;
  Team1Score: string;
  Team2Score: string;
  OverviewPage: string;
}

export async function fetchUpcomingMatchesForTournament(overviewPage: string, now: string): Promise<UpcomingMatch[]> {
  const url = `https://lol.fandom.com/api.php?action=cargoquery&tables=MatchSchedule&fields=MatchSchedule.DateTime_UTC,MatchSchedule.Team1,MatchSchedule.Team2,MatchSchedule.Team1Score,MatchSchedule.Team2Score,MatchSchedule.OverviewPage&where=MatchSchedule.OverviewPage="${encodeURIComponent(overviewPage)}"%20AND%20MatchSchedule.DateTime_UTC>"${now}"&limit=500&format=json&origin=*`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data.cargoquery) return [];
  return data.cargoquery.map((item: any) => item.title as UpcomingMatch);
}

export function useUpcomingMatchesForTournament(overviewPage: string, now: string) {
  return useQuery({
    queryKey: ['upcoming-matches', overviewPage, now],
    queryFn: () => fetchUpcomingMatchesForTournament(overviewPage, now),
    enabled: !!overviewPage && !!now,
  });
}
