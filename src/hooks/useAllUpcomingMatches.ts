
import { useActiveTournaments } from "@/services/active-tournaments-service";
import { useUpcomingMatchesForTournament } from "@/services/upcoming-matches-service";

const NOW_ISO = new Date().toISOString().slice(0, 19).replace("T", " ");
const LIMIT = 500;

export function useAllUpcomingMatches(year: string) {
  const { data: tournaments, isLoading: tournamentsLoading } = useActiveTournaments(year);

  // Pour chaque tournoi, on récupère ses matchs à venir
  const matchesQueries = (tournaments || []).map(t =>
    useUpcomingMatchesForTournament(t.OverviewPage, NOW_ISO)
  );

  // Agrège tous les matchs (par compétition)
  const allMatches = matchesQueries.map((q, i) => ({
    tournament: tournaments?.[i],
    matches: q.data || [],
    isLoading: q.isLoading
  }));

  return {
    allMatches,
    isLoading: tournamentsLoading || matchesQueries.some(q => q.isLoading)
  };
}
