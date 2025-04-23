import { useQuery } from '@tanstack/react-query';

export interface OverviewPageEntry {
  OverviewPage: string;
}

export async function fetchAllActiveOverviewPages(now: string): Promise<OverviewPageEntry[]> {
  const url = `https://lol.fandom.com/api.php?action=cargoquery&tables=MatchSchedule&fields=MatchSchedule.OverviewPage&where=MatchSchedule.DateTime_UTC >= \"${now}\"&limit=500&format=json&origin=*`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data.cargoquery) return [];
  // On déduplique les OverviewPage
  const seen = new Set();
  return data.cargoquery
    .map((item: any) => item.title as OverviewPageEntry)
    .filter(entry => {
      if (seen.has(entry.OverviewPage)) return false;
      seen.add(entry.OverviewPage);
      return true;
    });
}

export function useAllActiveOverviewPages(now: string) {
  return useQuery({
    queryKey: ['all-active-overview-pages', now],
    queryFn: () => fetchAllActiveOverviewPages(now),
  });
}
