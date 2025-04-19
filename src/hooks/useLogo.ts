
import { useQuery } from '@tanstack/react-query';
import { getLogo } from '@/services/logo-service';
import { toast } from "sonner";

/**
 * Hook pour récupérer le logo d'une entité (équipe ou tournoi)
 * 
 * @param type - Type d'entité ('team' ou 'tournament')
 * @param name - Nom de l'entité
 * @param defaultLogo - Logo par défaut à utiliser en cas d'échec
 * @returns Résultat de la requête avec l'URL du logo
 */
export function useLogo(type: 'team' | 'tournament', name: string, defaultLogo?: string) {
  return useQuery({
    queryKey: ['logo', type, name],
    queryFn: async () => {
      console.log(`[useLogo] Fetching logo for ${type}: ${name}`);
      
      try {
        // Ajout d'un délai aléatoire entre 0 et 200ms pour éviter les requêtes simultanées
        // qui pourraient surcharger l'API Leaguepedia
        const randomDelay = Math.floor(Math.random() * 200);
        await new Promise(resolve => setTimeout(resolve, randomDelay));
        
        const result = await getLogo(type, name, defaultLogo);
        console.log(`[useLogo] Result for ${name}: ${result ? "✅ Got URL" : "❌ No URL found"}`);
        
        if (!result) {
          throw new Error(`No logo found for ${type} ${name}`);
        }
        
        return result;
      } catch (error) {
        console.error(`[useLogo] Error fetching logo for ${name}:`, error);
        
        // Notification d'erreur (une seule fois par session)
        const errorId = `logo-error-${type}-${name}`;
        if (!localStorage.getItem(errorId)) {
          toast.error(`Impossible de charger le logo pour ${name}`, {
            id: errorId,
            duration: 3000
          });
          localStorage.setItem(errorId, "true");
        }
        
        // En cas d'erreur, utiliser l'URL par défaut si disponible
        if (defaultLogo) {
          return defaultLogo;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 heures
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 jours
    retry: 1, // Réduire le nombre de tentatives
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
    refetchOnWindowFocus: false, // Éviter les rechargements inutiles
    refetchOnMount: false,
  });
}
