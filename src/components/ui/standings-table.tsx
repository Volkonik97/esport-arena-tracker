import React, { useEffect, useState } from "react";
import { fetchStandings, Standing } from "@/services/standings-service";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveTournaments } from "@/services/active-tournaments-service";
import { useLogo } from "@/hooks/useLogo";
import { useUpcomingMatches } from "@/hooks/useLeagueMatches";

interface StandingsTableProps {
  tournamentName: string;
  overviewPageFromUpcoming?: string; // Optionnel : OverviewPage exact utilisé pour les matchs à venir
}

function normalize(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // retire tout sauf lettres/chiffres
    .replace(/split|season|playoffs|qualifier|groupstage|promotion|finals/g, '');
}

function normalizeForMatching(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findClosestOverviewPage(humanName: string, tournaments: {Name: string, OverviewPage: string}[]) {
  if (!humanName || !tournaments.length) return undefined;
  const target = normalizeForMatching(humanName);
  // 1. Match exact sur Name ou OverviewPage (normalisé)
  let found = tournaments.find(t => normalizeForMatching(t.Name) === target || normalizeForMatching(t.OverviewPage) === target);
  if (found) return found.OverviewPage;
  // 2. Match partiel sur Name ou OverviewPage (normalisé)
  found = tournaments.find(t => normalizeForMatching(t.Name).includes(target) || normalizeForMatching(t.OverviewPage).includes(target));
  if (found) return found.OverviewPage;
  // 3. Match partiel inversé (target inclus dans Name/OverviewPage)
  found = tournaments.find(t => target.includes(normalizeForMatching(t.Name)) || target.includes(normalizeForMatching(t.OverviewPage)));
  if (found) return found.OverviewPage;
  // 4. Matching souple par mots communs (comme pour les matchs à venir)
  const wordsTarget = new Set(target.split(/\s+/).filter(Boolean));
  found = tournaments.find(t => {
    const wordsName = new Set(normalizeForMatching(t.Name).split(/\s+/));
    let common = 0;
    wordsTarget.forEach(w => { if (wordsName.has(w)) common++; });
    return common >= Math.min(wordsTarget.size, wordsName.size) && common > 0;
  });
  if (found) return found.OverviewPage;
  return undefined;
}

function toOverviewPageName(humanName: string): string {
  // Pour LEC/LFL/LCK/LPL 2025 Spring/Summer
  // Ex: "2025 lec spring" => "LEC/2025 Season/Spring Season"
  const match = humanName.match(/(\d{4})\s+(lec|lfl|lcs|lpl|lck)\s+(spring|summer)/i);
  if (!match) return humanName;
  const [_, year, league, split] = match;
  return `${league.toUpperCase()}/${year} Season/${split.charAt(0).toUpperCase() + split.slice(1).toLowerCase()} Season`;
}

// Nouvelle stratégie : récupérer le bon OverviewPage comme pour les matchs à venir
function findBestOverviewPageFromMatches(tournamentName: string, year: string = "2025") {
  // Utilise le même filtrage que useUpcomingMatches pour trouver l'OverviewPage du premier match à venir
  const { data: matches } = useUpcomingMatches(500, { tournamentFilter: tournamentName });
  if (matches && matches.length > 0) {
    // Correction : chercher le premier match dont le champ Tournament ressemble à un OverviewPage Leaguepedia
    const validMatch = matches.find(m => typeof m.Tournament === 'string' && m.Tournament.includes('/') && /^[A-Za-z0-9]+\/[0-9]{4} Season\//.test(m.Tournament));
    if (validMatch) {
      return validMatch.Tournament;
    }
  }
  return undefined;
}

const StandingsTable: React.FC<StandingsTableProps> = ({ tournamentName, overviewPageFromUpcoming }) => {
  const [standings, setStandings] = useState<Standing[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupère tous les tournois actifs pour l'année courante (pour matcher OverviewPage)
  const { data: tournaments = [], isLoading: tournamentsLoading } = useActiveTournaments("2025");

  // DEBUG: Log all tournament names and OverviewPages for troubleshooting
  useEffect(() => {
    if (tournaments && tournaments.length) {
      console.log('[DEBUG TOURNAMENTS]', tournaments.map(t => ({ Name: t.Name, OverviewPage: t.OverviewPage })));
    }
  }, [tournaments]);

  // Essayer de trouver l'OverviewPage via les matchs à venir (ou récents)
  let overviewPage = overviewPageFromUpcoming;
  if (!overviewPage) {
    overviewPage = findBestOverviewPageFromMatches(tournamentName);
    if (!overviewPage) {
      overviewPage = toOverviewPageName(tournamentName);
      if (!overviewPage) {
        overviewPage = findClosestOverviewPage(tournamentName, tournaments);
      }
    }
  }

  useEffect(() => {
    console.log('[StandingsTable] DEBUG tournaments', tournaments);
    console.log('[StandingsTable] tournamentName', tournamentName, 'overviewPage', overviewPage);
    if (!overviewPage) {
      setStandings(null);
      setLoading(false);
      setError("Aucun OverviewPage trouvé pour ce tournoi.");
      return;
    }
    setLoading(true);
    setError(null);
    fetchStandings(overviewPage)
      .then((data) => {
        console.log('[StandingsTable] fetchStandings response', data);
        setStandings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[StandingsTable] fetchStandings error', err);
        setError("Erreur lors du chargement du classement.");
        setLoading(false);
      });
  }, [overviewPage, tournamentName, tournaments]);

  // DEBUG: Log the OverviewPage actually used for standings
  useEffect(() => {
    if (overviewPage) {
      console.log('[DEBUG STANDINGS OVERVIEWPAGE]', overviewPage);
      const url = `https://lol.fandom.com/api.php?action=cargoquery&tables=Standings&fields=Standings.OverviewPage,Standings.Team,Standings.Place,Standings.WinGames,Standings.WinSeries,Standings.LossGames,Standings.LossSeries,Standings.Points,Standings.Streak,Standings.StreakDirection&where=Standings.OverviewPage=%22${encodeURIComponent(overviewPage)}%22&limit=500&format=json`;
      console.log('[DEBUG STANDINGS URL]', url);
    }
  }, [overviewPage]);

  // DEBUG: Log the selected overview page used for standings
  useEffect(() => {
    if (standings && standings.length === 0 && tournamentName) {
      const overview = findClosestOverviewPage(tournamentName, tournaments || []);
      console.log('[DEBUG SELECTED OVERVIEWPAGE]', overview, 'for', tournamentName);
    }
  }, [standings, tournamentName, tournaments]);

  // DEBUG: Log the prop received for overviewPageFromUpcoming
  useEffect(() => {
    if (overviewPageFromUpcoming) {
      console.log('[DEBUG PROP overviewPageFromUpcoming]', overviewPageFromUpcoming);
    }
  }, [overviewPageFromUpcoming]);

  // DEBUG: Log the computed overviewPage actually used for standings
  useEffect(() => {
    if (overviewPage) {
      console.log('[DEBUG FINAL STANDINGS OVERVIEWPAGE]', overviewPage);
    }
  }, [overviewPage]);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array(8).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center py-4">{error}</div>;
  }

  if (!standings || standings.length === 0) {
    return <div className="text-gray-400 text-center py-4">Aucun classement trouvé pour cette compétition.</div>;
  }

  // Trie les standings par Place croissant (classement officiel)
  const sortedStandings = [...standings].sort((a, b) => (parseInt(a.Place) || 99) - (parseInt(b.Place) || 99));

  // Filtrer standings pour n'afficher que les entrées "réelles" (WinGames, WinSeries, LossGames, LossSeries non tous à zéro)
  const filteredStandings = sortedStandings.filter(s => {
    // Si l'équipe n'a aucune victoire/défaite ET Place=1 => c'est probablement une ligne placeholder
    const wins = Number(s.WinGames ?? 0) + Number(s.WinSeries ?? 0);
    const losses = Number(s.LossGames ?? 0) + Number(s.LossSeries ?? 0);
    // Si tout est zéro, on ignore
    if (wins === 0 && losses === 0) return false;
    // Sinon on garde
    return true;
  });

  // --- Composant enfant pour une ligne de standings avec hook logo ---
  const StandingRow: React.FC<{ standing: Standing }> = ({ standing }) => {
    const wins = Number(standing.WinSeries ?? standing.WinGames ?? 0);
    const losses = Number(standing.LossSeries ?? standing.LossGames ?? 0);
    const streak = standing.Streak ?? '';
    const gamesWin = Number(standing.WinGames ?? 0);
    const gamesLoss = Number(standing.LossGames ?? 0);
    const gamesDiff = gamesWin - gamesLoss;
    const gamesDiffColor = gamesDiff > 0 ? 'text-green-400 font-bold' : gamesDiff < 0 ? 'text-red-400 font-bold' : 'text-gray-300';
    const streakColor = standing.StreakDirection === 'W' ? 'text-green-400 font-bold' : standing.StreakDirection === 'L' ? 'text-red-400 font-bold' : '';
    const { data: logoUrl } = useLogo('team', standing.Team);
    return (
      <tr key={standing.Team + '-' + standing.Place + '-' + gamesWin}
          className={
            `even:bg-dark-900 odd:bg-dark-800 hover:bg-dark-700 transition-colors duration-100`
          }
      >
        <td className="py-2 px-4 text-center font-bold text-esport-400">{standing.Place}</td>
        <td className="py-2 px-4 text-left font-semibold whitespace-nowrap flex items-center gap-2">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={standing.Team}
              className="w-7 h-7 rounded-full bg-dark-600 border border-dark-400 object-contain p-0.5"
              style={{ background: 'linear-gradient(135deg, #222 60%, #333 100%)' }}
            />
          ) : (
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-dark-600 border border-dark-400 text-xs text-gray-400">
              {standing.Team.split(' ').map(word => word[0]).join('').substring(0,3).toUpperCase()}
            </span>
          )}
          <span>{standing.Team}</span>
        </td>
        <td className="py-2 px-4 text-center">{wins}</td>
        <td className="py-2 px-4 text-center">{losses}</td>
        <td className={"py-2 px-4 text-center " + streakColor}>{streak}</td>
        <td className="py-2 px-4 text-center">{gamesWin}</td>
        <td className="py-2 px-4 text-center">{gamesLoss}</td>
        <td className={"py-2 px-4 text-center " + gamesDiffColor}>{gamesDiff > 0 ? `+${gamesDiff}` : gamesDiff}</td>
      </tr>
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg border border-dark-700">
      <table className="min-w-full text-sm text-gray-200">
        <thead>
          <tr className="bg-dark-700">
            <th className="py-3 px-4 text-left sticky left-0 bg-dark-700 z-10">#</th>
            <th className="py-3 px-4 text-left">Team</th>
            <th className="py-3 px-4 text-center">Wins</th>
            <th className="py-3 px-4 text-center">Losses</th>
            <th className="py-3 px-4 text-center">Streak</th>
            <th className="py-3 px-4 text-center">Wins</th>
            <th className="py-3 px-4 text-center">Losses</th>
            <th className="py-3 px-4 text-center">+/-</th>
          </tr>
        </thead>
        <tbody>
          {filteredStandings.map((standing, idx) => (
            <StandingRow
              key={
                (standing.Team || 'unknown') +
                '-' +
                (standing.Place || idx) +
                '-' +
                (Number(standing.WinGames) ?? 0)
              }
              standing={standing}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsTable;
