import { useQuery } from '@tanstack/react-query';

export interface TournamentOverview {
  Name: string;
  OverviewPage: string;
  Year: string;
}

export async function fetchActiveTournaments(year: string): Promise<TournamentOverview[]> {
  const url = `https://lol.fandom.com/api.php?action=cargoquery&tables=Tournaments&fields=Tournaments.Name,Tournaments.OverviewPage,Tournaments.Year&where=Tournaments.Year>="${year}"&limit=500&format=json&origin=*`;
  const response = await fetch(url);
  const data = await response.json();
  console.log('[DEBUG ACTIVE TOURNAMENTS API RESPONSE]', data);
  if (!data.cargoquery) return [];
  return data.cargoquery.map((item: any) => item.title as TournamentOverview);
}

export function useActiveTournaments(year: string) {
  return useQuery({
    queryKey: ['active-tournaments', year],
    queryFn: () => fetchActiveTournaments(year),
  });
}
