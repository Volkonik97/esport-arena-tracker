import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

export interface LeagueMatch {
  DateTime: string;
  DateTime_UTC?: string;
  Team1: string;
  Team2: string;
  Tournament?: string;
  BestOf?: number;
  Winner?: string;
  Team1Score?: number;
  Team2Score?: number;
  OverviewPage?: string;
}

interface MatchesQueryResult {
  data: LeagueMatch[];
  isLoading: boolean;
  error: unknown;
  isFallback: boolean;
}

export function useUpcomingMatches(
  limit = 5000, 
  options: { 
    tournamentFilter?: string;
    dateFrom?: Date;
    dateTo?: Date;
  } = {}
): MatchesQueryResult {
  const { tournamentFilter, dateFrom, dateTo } = options;
  
  const result = useQuery({
    queryKey: ['upcoming-matches', limit, tournamentFilter, dateFrom?.toISOString(), dateTo?.toISOString()],
    queryFn: async () => {
      try {
        console.log("Fetching upcoming matches with filters:", { tournamentFilter, dateFrom, dateTo });
        
        // Nouvelle stratégie : récupérer tous les matchs à venir sans filtre OverviewPage
        let matches = [];
        const pageSize = 500;
        const maxPages = Math.ceil(limit / pageSize); // Calcul dynamique selon la limite demandée
        let offset = 0;
        for (let page = 0; page < maxPages; page++) {
          // Construction du filtre WHERE
          let whereClauses = [`MatchSchedule.DateTime_UTC >= '${new Date().toISOString().slice(0, 19).replace('T', ' ')}'`];
          if (tournamentFilter && tournamentFilter !== "Tous") {
            // Si un filtre tournoi est fourni, on tente de matcher exactement l'OverviewPage (plus robuste)
            whereClauses.push(`MatchSchedule.OverviewPage = '${tournamentFilter.replace(/'/g, "''")}'`);
          }
          let where = whereClauses.join(' AND ');
          let apiUrl = 'https://lol.fandom.com/api.php?action=cargoquery&tables=MatchSchedule&fields=MatchSchedule.DateTime_UTC,MatchSchedule.Team1,MatchSchedule.Team2,MatchSchedule.Team1Score,MatchSchedule.Team2Score,MatchSchedule.OverviewPage&where=' + encodeURIComponent(where) + `&limit=${pageSize}&offset=${offset}&format=json&origin=*`;
          let response = await fetch(apiUrl);
          let apiData = await response.json();
          let pageMatches = [];
          if (apiData?.cargoquery && Array.isArray(apiData.cargoquery)) {
            pageMatches = apiData.cargoquery
              .map((item) => {
                const m = item.title;
                return {
                  DateTime: m["DateTime UTC"] || m["DateTime_UTC"] || m["MatchSchedule.DateTime_UTC"],
                  Team1: m.Team1,
                  Team2: m.Team2,
                  Team1Score: m.Team1Score,
                  Team2Score: m.Team2Score,
                  Tournament: m.OverviewPage
                };
              })
              .filter(match => {
                if (!match.DateTime) return false;
                const matchDate = new Date(match.DateTime);
                return matchDate.getTime() > new Date().getTime();
              });
            matches = matches.concat(pageMatches);
            console.log(`[DEBUG PAGE ${page}]`, {
              count: pageMatches.length,
              first: pageMatches[0]?.DateTime,
              last: pageMatches[pageMatches.length-1]?.DateTime
            });
            if (pageMatches.length < pageSize) break; // Dernière page
          } else {
            break;
          }
          offset += pageSize;
        }
        // Filtrage automatique des matchs à venir par similarité avec le nom de la compétition (comme pour les résultats récents)
        function similarTournament(a: string, b: string) {
          if (!a || !b) return false;
          const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, ' ');
          const wordsA = new Set(norm(a).split(/\s+/).filter(Boolean));
          const wordsB = new Set(norm(b).split(/\s+/).filter(Boolean));
          let common = 0;
          wordsA.forEach(w => { if (wordsB.has(w)) common++; });
          // Si tous les mots du filtre sont dans le Tournament, ou l'inverse, on considère que c'est un match
          return (common >= Math.min(wordsA.size, wordsB.size) && common > 0);
        }
        if (tournamentFilter && tournamentFilter !== "Tous") {
          matches = matches.filter(m => similarTournament(m.Tournament || '', tournamentFilter));
        }
        console.log('[DEBUG FILTERED MATCHES FINAL]', matches);
        return { matches, isFallback: false };
      } catch (error) {
        console.error('Error in useUpcomingMatches:', error);
        toast({
          title: "Erreur",
          description: "Problème lors du traitement des matchs.",
          variant: "destructive"
        });
        
        return { matches: [], isFallback: true };
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

async function fetchCurrentMatchesAlternative(limit: number, tournamentFilter?: string) {
  try {
    console.log("Trying alternative current matches approach");
    
    const { data, error } = await supabase.functions.invoke('leaguepedia', {
      body: {
        params: {
          directMatchQuery: true,
          limit: limit.toString(),
          ...(tournamentFilter ? { tournamentFilter } : {})
        }
      }
    });

    if (error) {
      console.error("Alternative fetch error:", error);
      throw error;
    }
    
    if (data?.cargoquery && Array.isArray(data.cargoquery)) {
      const matches = data.cargoquery.map(item => item.title as LeagueMatch);
      console.log("Alternative method returned matches:", matches.length);
      return { matches, isFallback: true };
    }
    
    return await fetchMatchesOriginalFormat(limit, tournamentFilter);
  } catch (error) {
    console.error('Error in alternative fetch method:', error);
    return await fetchMatchesOriginalFormat(limit, tournamentFilter);
  }
}

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

export function useRecentResults(
  limit = 10, 
  options: { 
    tournamentFilter?: string;
    dateFrom?: Date;
    dateTo?: Date;
  } = {}
): MatchesQueryResult {
  const { tournamentFilter, dateFrom, dateTo } = options;
  
  const result = useQuery({
    queryKey: ['recent-results', limit, tournamentFilter, dateFrom?.toISOString(), dateTo?.toISOString()],
    queryFn: async () => {
      try {
        console.log("Fetching recent results with filters:", { tournamentFilter, dateFrom, dateTo });
        
        const oneWeekAgo = dateFrom || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        let whereConditions = [
          `SG.DateTime_UTC < '${new Date().toISOString()}'`,
          `SG.DateTime_UTC >= '${oneWeekAgo.toISOString()}'`
        ];
        
        if (dateTo) {
          whereConditions.push(`SG.DateTime_UTC <= '${dateTo.toISOString()}'`);
        }
        
        if (tournamentFilter && tournamentFilter !== "Tous") {
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

export function useTournamentSchedule(tournamentName: string, limit = 50) {
  return useQuery({
    queryKey: ['tournament-schedule', tournamentName, limit],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('leaguepedia', {
        body: {
          params: {
            tournamentName,
            limit: limit.toString(),
          },
        },
      });
      if (error) throw error;
      return data?.cargoquery?.map((item: any) => item.title) || [];
    },
    enabled: !!tournamentName,
  });
}

export function useFilteredMatches(
  type: 'upcoming' | 'recent' | 'all',
  options: {
    limit?: number;
    tournamentFilter?: string;
    dateFrom?: Date;
    dateTo?: Date;
  } = {}
): MatchesQueryResult {
  const { limit = 20, tournamentFilter, dateFrom, dateTo } = options;
  
  const result = useQuery({
    queryKey: ['filtered-matches', type, limit, tournamentFilter, dateFrom?.toISOString(), dateTo?.toISOString()],
    queryFn: async () => {
      try {
        console.log(`Fetching ${type} matches with filters:`, { tournamentFilter, dateFrom, dateTo });
        
        if (type === 'upcoming') {
          const { data, error } = await supabase.functions.invoke('leaguepedia', {
            body: {
              params: {
                action: "cargoquery",
                format: "json",
                tables: "MatchScheduleGame=MSG,MatchSchedule=MS",
                join_on: "MSG.MatchId=MS.MatchId",
                fields: "MSG.Team1,MSG.Team2,MS.OverviewPage,MS.DateTime_UTC=DateTime,MS.Tournament,MS.BestOf",
                where: "MS.DateTime_UTC>NOW()" + (dateFrom ? ` AND MS.DateTime_UTC >= '${dateFrom.toISOString()}'` : "") + 
                      (dateTo ? ` AND MS.DateTime_UTC <= '${dateTo.toISOString()}'` : "") +
                      (tournamentFilter && tournamentFilter !== "Tous" ? ` AND MS.OverviewPage = '${tournamentFilter.replace(/'/g, "''")}'` : ""),
                order_by: "MS.DateTime_UTC",
                limit: limit.toString()
              }
            }
          });

          if (error) {
            console.error("Supabase function error:", error);
            throw error;
          }
          
          console.log('[DEBUG API RAW]', data);
          if (data?.cargoquery && Array.isArray(data.cargoquery)) {
            console.log('[DEBUG ALL MATCHES RAW]', data.cargoquery);
            const matches = data.cargoquery
              .map((item) => {
                const m = item.title;
                return {
                  DateTime: m["DateTime UTC"],
                  Team1: m.Team1,
                  Team2: m.Team2,
                  Team1Score: m.Team1Score,
                  Team2Score: m.Team2Score,
                  Tournament: m.OverviewPage
                };
              })
              .filter(match => {
                if (!match.DateTime) return false;
                const matchDate = new Date(match.DateTime);
                console.log('[DEBUG COMPARE]', { matchDate: matchDate.toISOString(), now: new Date().toISOString(), raw: match.DateTime });
                return matchDate.getTime() > new Date().getTime();
              });
            console.log('[DEBUG FILTERED MATCHES]', matches);
            return { matches, isFallback: false };
          }
          
          return await fetchCurrentMatchesAlternative(limit, tournamentFilter);
        } 
        else if (type === 'recent') {
          const oneWeekAgo = dateFrom || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          
          let whereConditions = [
            `SG.DateTime_UTC < '${new Date().toISOString()}'`,
            `SG.DateTime_UTC >= '${oneWeekAgo.toISOString()}'`
          ];
          
          if (dateTo) {
            whereConditions.push(`SG.DateTime_UTC <= '${dateTo.toISOString()}'`);
          }
          
          if (tournamentFilter && tournamentFilter !== "Tous") {
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
        }
        
        return { matches: [], isFallback: true };
      } catch (error) {
        console.error(`Error fetching ${type} matches:`, error);
        toast({
          title: "Erreur de connexion",
          description: "Problème lors de la récupération des matchs.",
          variant: "destructive"
        });
        
        return { matches: [], isFallback: true };
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
