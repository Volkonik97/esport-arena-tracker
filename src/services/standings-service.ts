import axios from 'axios';

export interface Standing {
  OverviewPage: string;
  Team: string;
  Place: string;
  WinGames: string;
  WinSeries: string;
  LossGames: string;
  LossSeries: string;
  Points: string;
  Streak: string;
  StreakDirection: string;
}

/**
 * Fetch standings for a given tournament from Leaguepedia Cargo API.
 * @param overviewPage The exact tournament name (e.g. "LEC 2025 Spring")
 */
export async function fetchStandings(overviewPage: string): Promise<Standing[]> {
  // Utilise allorigins pour contourner le CORS
  const apiUrl = `https://lol.fandom.com/api.php?action=cargoquery&tables=Standings&fields=Standings.OverviewPage,Standings.Team,Standings.Place,Standings.WinGames,Standings.WinSeries,Standings.LossGames,Standings.LossSeries,Standings.Points,Standings.Streak,Standings.StreakDirection&where=Standings.OverviewPage="${overviewPage}"&limit=500&format=json`;
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
  console.log('[fetchStandings] API URL (with allorigins):', url);
  const { data } = await axios.get(url);
  // allorigins retourne { contents: "...json..." }
  const json = JSON.parse(data.contents);
  if (!json.cargoquery) return [];
  // Correction : parser chaque champ explicitement
  return json.cargoquery.map((item: any) => {
    const t = item.title;
    return {
      OverviewPage: t.OverviewPage || '',
      Team: t.Team || '',
      Place: t.Place || '',
      WinGames: t.WinGames || '',
      WinSeries: t.WinSeries || '',
      LossGames: t.LossGames || '',
      LossSeries: t.LossSeries || '',
      Points: t.Points || '',
      Streak: t.Streak || '',
      StreakDirection: t.StreakDirection || '',
    };
  });
}
