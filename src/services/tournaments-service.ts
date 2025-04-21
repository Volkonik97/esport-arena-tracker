// Service pour récupérer dynamiquement les compétitions League of Legends depuis Leaguepedia (Cargo API)

export interface Tournament {
  Name: string;
  OverviewPage: string;
  DateStart: string;
  Date: string;
  League: string;
  Region: string;
  Prizepool: string;
  Currency: string;
  Country: string;
  EventType: string;
  Year: string;
  LeagueIconKey: string;
}

export async function fetchLeagueTournaments(year = '2025'): Promise<Tournament[]> {
  // On cible toutes les compétitions de l'année donnée
  // On récupère jusqu'à 500 compétitions (limite API)
  const url = `https://lol.fandom.com/api.php?action=cargoquery&tables=Tournaments&fields=Name,OverviewPage,DateStart,Date,League,Region,Prizepool,Currency,Country,EventType,Year,LeagueIconKey&where=Year%3D%22${year}%22&format=json&origin=*&limit=500`;

  const response = await fetch(url);
  const data = await response.json();
  if (!data.cargoquery) return [];
  // Les résultats sont dans data.cargoquery[].title
  return data.cargoquery.map((item: any) => item.title as Tournament);
}
