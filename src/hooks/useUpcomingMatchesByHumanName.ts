import { useActiveTournaments } from "@/services/active-tournaments-service";
import { useMemo } from "react";
import { useUpcomingMatchesForTournament } from "@/services/upcoming-matches-service";

const NOW_ISO = new Date().toISOString().slice(0, 19).replace("T", " ");

// Utilitaire pour matcher un OverviewPage proche d'un nom humain
function findClosestOverviewPage(humanName: string, tournaments: {Name: string, OverviewPage: string}[]): string | undefined {
  if (!humanName || !tournaments.length) return undefined;
  const normalized = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const target = normalized(humanName);
  // Privilégie la correspondance partielle sur Name ET OverviewPage
  const found = tournaments.find(t => normalized(t.Name).includes(target) || normalized(t.OverviewPage).includes(target));
  return found?.OverviewPage;
}

export function useUpcomingMatchesByHumanName(humanName: string, year: string = "2025") {
  const { data: tournaments = [], isLoading } = useActiveTournaments(year);
  // On cherche le plus proche
  const matchedOverview = useMemo(() => findClosestOverviewPage(humanName, tournaments), [humanName, tournaments]);
  // On requête les matchs uniquement si on a trouvé un OverviewPage
  const matchesQuery = useUpcomingMatchesForTournament(matchedOverview || "", NOW_ISO);
  return {
    overviewPage: matchedOverview,
    matches: matchesQuery.data || [],
    isLoading: isLoading || matchesQuery.isLoading
  };
}
