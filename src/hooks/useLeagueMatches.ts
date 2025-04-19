
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface LeagueMatch {
  Tournament?: string;
  Region?: string;
  DateTime: string;
  Team1: string;
  Team2: string;
  Winner?: string;
  Team1Score?: number;
  Team2Score?: number;
  League?: string;
  OverviewPage?: string;
  BestOf?: number;
}

interface MatchesQueryResult {
  data: LeagueMatch[];
  isLoading: boolean;
  error: unknown;
  isFallback: boolean;
}

export function useUpcomingMatches(limit = 5, tournamentFilter?: string): MatchesQueryResult {
  const result = useQuery({
    queryKey: ['upcoming-matches', limit, tournamentFilter],
    queryFn: async () => {
      try {
        console.log("Fetching upcoming matches with tournament filter:", tournamentFilter);
        
        const { data, error } = await supabase.functions.invoke('leaguepedia', {
          body: {
            params: {
              upcomingMatches: true,
              limit: limit.toString(),
              tournamentFilter
            }
          }
        });

        if (error) {
          console.error("Supabase function error:", error);
          throw error;
        }
        
        if (data?.cargoquery && Array.isArray(data.cargoquery)) {
          const matches = data.cargoquery.map(item => item.title as LeagueMatch);
          console.log("API returned upcoming matches:", matches.length);
          return { matches, isFallback: false };
        }

        if (data?.error) {
          console.error("Leaguepedia API error:", data.error);
          toast({
            title: "Erreur de l'API",
            description: "Impossible de récupérer les matchs depuis Leaguepedia.",
            variant: "destructive"
          });
        }
        
        // If we reach here, there's no matches data
        console.warn("No upcoming matches data returned");
        
        // Fallback to original match fetching if the new format fails
        return await fetchMatchesOriginalFormat(limit, tournamentFilter);
      } catch (error) {
        console.error('Error fetching upcoming matches:', error);
        toast({
          title: "Erreur de connexion",
          description: "Problème lors de la récupération des matchs.",
          variant: "destructive"
        });
        
        // Try fallback method on error
        return await fetchMatchesOriginalFormat(limit, tournamentFilter);
      }
    }
  });

  return {
    data: result.data?.matches || [],
    isLoading: result.isLoading,
    error: result.error,
    isFallback: result.data?.isFallback || false
  };
}

// Fallback method using original match format if the new format fails
async function fetchMatchesOriginalFormat(limit: number, tournamentFilter?: string) {
  try {
    console.log("Falling back to original match format");
    let whereConditions = [
      `SG.DateTime_UTC >= '${new Date().toISOString()}'`,
      'T.IsQualifier=0'
    ];
    
    if (tournamentFilter) {
      whereConditions.push(`T.Name = '${tournamentFilter}'`);
    }
    
    const { data, error } = await supabase.functions.invoke('leaguepedia', {
      body: {
        params: {
          where: whereConditions,
          limit: limit.toString(),
          order_by: "SG.DateTime_UTC ASC"
        }
      }
    });

    if (error) throw error;
    
    if (data?.cargoquery && Array.isArray(data.cargoquery)) {
      const matches = data.cargoquery.map(item => item.title as LeagueMatch);
      console.log("Fallback method returned matches:", matches.length);
      return { matches, isFallback: true };
    }
    
    return { matches: [], isFallback: true };
  } catch (error) {
    console.error('Error in fallback method:', error);
    return { matches: [], isFallback: true };
  }
}

export function useRecentResults(limit = 10, tournamentFilter?: string): MatchesQueryResult {
  const result = useQuery({
    queryKey: ['recent-results', limit, tournamentFilter],
    queryFn: async () => {
      try {
        console.log("Fetching recent results with tournament filter:", tournamentFilter);
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        let whereConditions = [
          `SG.DateTime_UTC < '${new Date().toISOString()}'`,
          `SG.DateTime_UTC >= '${oneWeekAgo.toISOString()}'`
        ];
        
        if (tournamentFilter) {
          whereConditions.push(`T.Name = '${tournamentFilter}'`);
        }
        
        const { data, error } = await supabase.functions.invoke('leaguepedia', {
          body: {
            params: {
              where: whereConditions,
              limit: limit.toString(),
              order_by: "SG.DateTime_UTC DESC"
            }
          }
        });

        if (error) {
          console.error("Supabase function error:", error);
          throw error;
        }
        
        if (data?.cargoquery && Array.isArray(data.cargoquery)) {
          const matches = data.cargoquery.map(item => item.title as LeagueMatch);
          console.log("API returned recent matches:", matches.length);
          return { matches, isFallback: false };
        }

        if (data?.error) {
          console.error("Leaguepedia API error:", data.error);
        }
        
        return { matches: [], isFallback: false };
      } catch (error) {
        console.error('Error fetching recent results:', error);
        return { matches: [], isFallback: false };
      }
    }
  });

  return {
    data: result.data?.matches || [],
    isLoading: result.isLoading,
    error: result.error,
    isFallback: result.data?.isFallback || false
  };
}
