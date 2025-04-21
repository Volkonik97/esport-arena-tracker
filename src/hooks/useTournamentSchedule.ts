import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Récupère le calendrier complet d'un tournoi (tous les matchs planifiés, passés et à venir)
 * @param tournamentName Nom exact du tournoi (id)
 * @param limit Limite de matchs à récupérer
 */
export function useTournamentSchedule(tournamentName: string, limit = 50) {
  return useQuery({
    queryKey: ['tournament-schedule', tournamentName, limit],
    queryFn: async () => {
      if (!tournamentName) return [];
      const { data, error } = await supabase.functions.invoke('leaguepedia', {
        body: {
          params: {
            tournamentName,
            limit: limit.toString(),
          },
        },
      });
      if (error) throw error;
      // On retourne tous les matchs (format LeagueMatch ou brut)
      return data?.cargoquery?.map((item: any) => item.title) || [];
    },
    enabled: !!tournamentName,
  });
}
