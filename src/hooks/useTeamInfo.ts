
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TeamInfo {
  Name: string;
  Short: string;
  Region: string;
  League: string;
  Image: string;
  RosterLinks?: any;
  Location?: string;
  Twitter?: string;
  Facebook?: string;
  Youtube?: string;
  Discord?: string;
  Website?: string;
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

        if (error) {
          console.error(`Erreur API Leaguepedia pour l'équipe ${teamName}:`, error);
          toast.error(`Impossible de récupérer les infos pour ${teamName}`);
          throw error;
        }

        // Si nous avons une réponse valide avec des données
        if (data?.cargoquery && data.cargoquery.length > 0) {
          console.log(`[useTeamInfo] Données reçues pour ${teamName}:`, data.cargoquery[0].title);
          return data.cargoquery[0].title as TeamInfo;
        }

        // Gérer le cas où l'API retourne une erreur
        if (data?.error) {
          console.warn(`Erreur API Leaguepedia pour l'équipe ${teamName}:`, data.error);
          toast.error(`Erreur lors de la récupération des informations de ${teamName}`);
          return null;
        }

        // Retourner null si aucune équipe n'est trouvée
        console.warn(`Aucune donnée trouvée pour l'équipe ${teamName}`);
        return null;
      } catch (err) {
        console.error(`Erreur lors de la récupération des infos pour l'équipe ${teamName}:`, err);
        toast.error(`Erreur lors de la récupération des informations de ${teamName}`);
        return null;
      }
    },
    enabled: !!teamName,
    retry: 1, // Limiter le nombre de retry pour éviter trop de requêtes en cas d'erreur
    staleTime: 1000 * 60 * 60, // Cache d'une heure pour éviter de surcharger l'API
  });
};
