import { useQuery } from '@tanstack/react-query';
import { getLogo } from '@/services/logo-service';

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
    queryFn: async ({ signal }) => {
      console.log(`[useLogo] Fetching logo for ${type}: ${name}`);
      const result = await getLogo(type, name, defaultLogo);
      console.log(`[useLogo] Result for ${name}: ${result ? "✅ Got URL" : "❌ No URL found"}`);
      
      if (!result) {
        throw new Error(`No logo found for ${type} ${name}`);
      }
      
      return result;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 heures
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 jours
    retry: 1, // Réduire le nombre de tentatives
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
    refetchOnWindowFocus: false, // Éviter les rechargements inutiles
    refetchOnMount: false,
  });
}
