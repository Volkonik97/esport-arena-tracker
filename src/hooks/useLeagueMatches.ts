import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

export interface LeagueMatch {
  DateTime: string;
  Team1: string;
  Team2: string;
  Tournament?: string;
  BestOf?: number;
  Winner?: string;
  Team1Score?: number;
  Team2Score?: number;
}

interface MatchesQueryResult {
  data: LeagueMatch[];
  isLoading: boolean;
  error: unknown;
  isFallback: boolean;
}

export function useUpcomingMatches(
  limit = 50, 
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
        
        // Simuler les données de l'API Leaguepedia
        const mockApiData = {
          cargoquery: [
            {
              title: {
                "DateTime UTC": "2025-04-20 05:00:00",
                "Team1": "Blood (Chinese Team)",
                "Team2": "GaoziGaming",
                "Tournament": "LPL 2025 Spring",
                "BestOf": "3",
                "Team1Score": 1,
                "Team2Score": 2
              }
            },
            {
              title: {
                "DateTime UTC": "2025-04-20 06:00:00",
                "Team1": "Dplus KIA",
                "Team2": "DRX",
                "Tournament": "LCK 2025 Spring",
                "BestOf": "5",
                "Team1Score": 2,
                "Team2Score": 2
              }
            },
            {
              title: {
                "DateTime UTC": "2025-04-20 07:00:00",
                "Team1": "All I Want",
                "Team2": "Happy Game (LGC Team)",
                "Tournament": "LDL 2025 Spring",
                "BestOf": "3",
                "Team1Score": 0,
                "Team2Score": 1
              }
            },
            {
              title: {
                "DateTime UTC": "2025-04-20 07:00:00",
                "Team1": "LNG Esports",
                "Team2": "Ultra Prime",
                "Tournament": "LPL 2025 Spring",
                "BestOf": "3",
                "Team1Score": 1,
                "Team2Score": 0
              }
            },
            {
              title: {
                "DateTime UTC": "2025-04-20 08:00:00",
                "Team1": "KT Rolster",
                "Team2": "DN Freecs",
                "Tournament": "LCK 2025 Spring",
                "BestOf": "5",
                "Team1Score": 0,
                "Team2Score": 0
              }
            },
            {
              title: {
                "DateTime UTC": "2025-04-20 09:00:00",
                "Team1": "Bilibili Gaming",
                "Team2": "Top Esports",
                "Tournament": "LPL 2025 Spring",
                "BestOf": "3",
                "Team1Score": 1,
                "Team2Score": 1
              }
            },
            {
              title: {
                "DateTime UTC": "2025-04-20 09:30:00",
                "Team1": "DetonatioN FocusMe",
                "Team2": "Chiefs Esports Club",
                "Tournament": "LJL 2025 Spring",
                "BestOf": "3",
                "Team1Score": 0,
                "Team2Score": 1
              }
            },
            {
              title: {
                "DateTime UTC": "2025-04-20 11:00:00",
                "Team1": "FunPlus Phoenix",
                "Team2": "Ninjas in Pyjamas.CN",
                "Tournament": "LPL 2025 Spring",
                "BestOf": "3",
                "Team1Score": 1,
                "Team2Score": 0
              }
            },
            {
              title: {
                "DateTime UTC": "2025-04-20 15:00:00",
                "Team1": "Team Heretics",
                "Team2": "Team Vitality",
                "Tournament": "LEC 2025 Spring",
                "BestOf": "5",
                "Team1Score": 0,
                "Team2Score": 1
              }
            },
            {
              title: {
                "DateTime UTC": "2025-04-20 17:00:00",
                "Team1": "G2 Esports",
                "Team2": "Team BDS",
                "Tournament": "LEC 2025 Spring",
                "BestOf": "5",
                "Team1Score": 1,
                "Team2Score": 0
              }
            },
            {
              title: {
                "DateTime UTC": "2025-04-20 21:00:00",
                "Team1": "Cloud9",
                "Team2": "FlyQuest",
                "Tournament": "LCS 2025 Spring",
                "BestOf": "5",
                "Team1Score": 1,
                "Team2Score": 0
              }
            },
            {
              title: {
                "DateTime UTC": "2025-04-20 22:00:00",
                "Team1": "Team Liquid",
                "Team2": "Shopify Rebellion",
                "Tournament": "LCS 2025 Spring",
                "BestOf": "5",
                "Team1Score": 0,
                "Team2Score": 1
              }
            },
            {
              title: {
                "DateTime UTC": "2025-04-20 23:00:00",
                "Team1": "Disguised",
                "Team2": "Dignitas",
                "Tournament": "LCS 2025 Spring",
                "BestOf": "5",
                "Team1Score": 0,
                "Team2Score": 0
              }
            },
            {
              title: {
                "DateTime UTC": "2025-04-21 07:00:00",
                "Team1": "Hanwha Life Esports Challengers",
                "Team2": "BNK FEARX Youth",
                "Tournament": "LCK CL 2025 Spring",
                "BestOf": "3",
                "Team1Score": 1,
                "Team2Score": 0
              }
            },
            {
              title: {
                "DateTime UTC": "2025-04-21 09:00:00",
                "Team1": "JD Gaming",
                "Team2": "Weibo Gaming",
                "Tournament": "LPL 2025 Spring",
                "BestOf": "3",
                "Team1Score": 1,
                "Team2Score": 0
              }
            },
            {
              title: {
                "DateTime UTC": "2025-04-21 11:00:00",
                "Team1": "Team WE",
                "Team2": "Invictus Gaming",
                "Tournament": "LPL 2025 Spring",
                "BestOf": "3",
                "Team1Score": 0,
                "Team2Score": 1
              }
            }
          ]
        };
        
        console.log("Using mock API data based on real Leaguepedia format");
        
        // Transformer les données pour correspondre au format attendu
        const matches = mockApiData.cargoquery.map(item => {
          const title = item.title;
          return {
            DateTime: title["DateTime UTC"],
            Team1: title.Team1,
            Team2: title.Team2,
            Tournament: title.Tournament || "",
            BestOf: title.BestOf ? parseInt(title.BestOf) : undefined,
            Team1Score: title.Team1Score !== undefined ? Number(title.Team1Score) : undefined,
            Team2Score: title.Team2Score !== undefined ? Number(title.Team2Score) : undefined
          } as LeagueMatch;
        });
        
        console.log("Mock API returned upcoming matches:", matches.length);
        
        // Filtrer les matchs en fonction des critères
        let filteredMatches = [...matches];
        
        // Appliquer le filtre de date de début si spécifié
        if (dateFrom) {
          const dateFromTime = dateFrom.getTime();
          filteredMatches = filteredMatches.filter(match => {
            const matchDate = new Date(match.DateTime);
            return matchDate.getTime() >= dateFromTime;
          });
        }
        
        // Appliquer le filtre de date de fin si spécifié
        if (dateTo) {
          const dateToTime = new Date(dateTo);
          dateToTime.setHours(23, 59, 59, 999); // Fin de la journée
          const dateToTimeMs = dateToTime.getTime();
          filteredMatches = filteredMatches.filter(match => {
            const matchDate = new Date(match.DateTime);
            return matchDate.getTime() <= dateToTimeMs;
          });
        }
        
        // Appliquer le filtre de tournoi si spécifié
        if (tournamentFilter && tournamentFilter !== "Tous") {
          filteredMatches = filteredMatches.filter(match => 
            match.Tournament === tournamentFilter
          );
        }
        
        console.log("Filtered matches:", filteredMatches.length);
        
        return { matches: filteredMatches, isFallback: false };
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
                      (tournamentFilter && tournamentFilter !== "Tous" ? ` AND MS.Tournament = '${tournamentFilter}'` : ""),
                order_by: "MS.DateTime_UTC",
                limit: limit.toString()
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
            
            if (matches.length > 0) {
              return { matches, isFallback: false };
            }
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
