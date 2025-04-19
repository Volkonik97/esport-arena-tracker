
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TeamInfo {
  Name: string;
  Short: string;
  Region: string;
  League: string;
  Image: string;
}

export const useTeamInfo = (teamName: string) => {
  return useQuery({
    queryKey: ['team-info', teamName],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('leaguepedia', {
          body: {
            params: {
              teamName
            }
          }
        });

        if (error) throw error;

        // Si nous avons une réponse valide avec des données
        if (data?.cargoquery && data.cargoquery.length > 0) {
          return data.cargoquery[0].title as TeamInfo;
        }

        // Gérer le cas où l'API retourne une erreur
        if (data?.error) {
          console.warn(`Erreur API Leaguepedia pour l'équipe ${teamName}:`, data.error);
          return null;
        }

        // Retourner null si aucune équipe n'est trouvée
        return null;
      } catch (err) {
        console.error(`Erreur lors de la récupération des infos pour l'équipe ${teamName}:`, err);
        return null;
      }
    },
    enabled: !!teamName,
    retry: 1, // Limiter le nombre de retry pour éviter trop de requêtes en cas d'erreur
    staleTime: 1000 * 60 * 60, // Cache d'une heure pour éviter de surcharger l'API
  });
};
