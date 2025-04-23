
import { useState, useEffect, useCallback } from "react";
import Layout from "@/components/layout/Layout";
import { MatchCard, MatchTeam } from "@/components/ui/match-card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUpcomingMatches, useRecentResults } from "@/hooks/useLeagueMatches";
import { addDays, isAfter, isBefore, isEqual, startOfDay } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import StandingsTable from "@/components/ui/standings-table";

export default function Matches() {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'recent'>('live');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompetition, setSelectedCompetition] = useState("Tous");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  
  const [appliedFilters, setAppliedFilters] = useState({
    competition: "Tous",
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined
  });
  
  const queryClient = useQueryClient();
  
  const { 
    data: upcomingMatches = [], 
    isLoading: upcomingLoading, 
    isFallback: upcomingFallback 
  } = useUpcomingMatches(50, {
    tournamentFilter: appliedFilters.competition !== "Tous" ? appliedFilters.competition : undefined,
    dateFrom: appliedFilters.dateFrom,
    dateTo: appliedFilters.dateTo
  });
  
  const { 
    data: recentMatches = [], 
    isLoading: recentLoading, 
    isFallback: recentFallback 
  } = useRecentResults(50, {
    tournamentFilter: appliedFilters.competition !== "Tous" ? appliedFilters.competition : undefined,
    dateFrom: appliedFilters.dateFrom,
    dateTo: appliedFilters.dateTo
  });
  
  const applyFilters = useCallback(() => {
    setAppliedFilters({
      competition: selectedCompetition,
      dateFrom: dateRange.from,
      dateTo: dateRange.to
    });
    
    queryClient.invalidateQueries({ queryKey: ['upcoming-matches'] });
    queryClient.invalidateQueries({ queryKey: ['recent-results'] });
    
    setFiltersVisible(false);
    
    toast({
      title: "Filtres appliqués",
      description: "Les résultats ont été mis à jour avec vos filtres.",
    });
  }, [selectedCompetition, dateRange, queryClient]);
  
  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCompetition("Tous");
    setDateRange({ from: undefined, to: undefined });
    
    setAppliedFilters({
      competition: "Tous",
      dateFrom: undefined,
      dateTo: undefined
    });
    
    queryClient.invalidateQueries({ queryKey: ['upcoming-matches'] });
    queryClient.invalidateQueries({ queryKey: ['recent-results'] });
    
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été réinitialisés.",
    });
  }, [queryClient]);
  
  const MATCH_DURATION_MINUTES: number = 120;
  
  const AUTO_LIVE_LEAGUES = [
    'LEC',
    'LFL',
    'LTA North',
    'LPL'
  ];

  const getLeagueFromTournament = (tournament: string) => {
    if (!tournament) return '';
    if (tournament.includes('LEC')) return 'LEC';
    if (tournament.includes('LFL')) return 'LFL';
    if (tournament.includes('LTA North')) return 'LTA North';
    if (tournament.includes('LPL')) return 'LPL';
    return '';
  };

  const liveMatchesBase = upcomingMatches.filter(match => {
    const matchDateStr = match.DateTime || match.DateTime_UTC || '';
    if (!matchDateStr) return false;
    
    try {
      const matchDate = new Date(matchDateStr);
      if (isNaN(matchDate.getTime())) return false;
      
      const now = new Date();
      
      const matchDateMs = matchDate.getTime();
      const durationMs = MATCH_DURATION_MINUTES * 60 * 1000;
      const matchEndMs = matchDateMs + durationMs;
      const matchEnd = new Date(matchEndMs);
      
      return now >= matchDate && now <= matchEnd;
    } catch (error) {
      console.error('Error parsing date:', matchDateStr, error);
      return false;
    }
  });

  const extraLiveMatches: any[] = [];
  AUTO_LIVE_LEAGUES.forEach(league => {
    const upcoming = upcomingMatches.filter(m => getLeagueFromTournament(m.Tournament).toLowerCase() === league.toLowerCase());
    if (!upcoming.length) return;
    const finished = recentMatches.filter(m => getLeagueFromTournament(m.Tournament).toLowerCase() === league.toLowerCase() && m.Winner);
    if (!finished.length) return;
    const sortByDate = (a: any, b: any) => new Date(a.DateTime) - new Date(b.DateTime);
    upcoming.sort(sortByDate);
    finished.sort(sortByDate);
    const lastFinished = finished[finished.length - 1];
    const nextUpcoming = upcoming[0];
    const dateNext = new Date(nextUpcoming.DateTime);
    const dateLastFinished = new Date(lastFinished.DateTime);
    const sameDay = dateNext.getFullYear() === dateLastFinished.getFullYear() && dateNext.getMonth() === dateLastFinished.getMonth() && dateNext.getDate() === dateLastFinished.getDate();
    if (lastFinished && nextUpcoming && dateLastFinished < dateNext && sameDay) {
      const alreadyLive = liveMatchesBase.some(m => getLeagueFromTournament(m.Tournament).toLowerCase() === league.toLowerCase());
      if (!alreadyLive) {
        extraLiveMatches.push(nextUpcoming);
      }
    }
  });

  const liveMatches = [...liveMatchesBase, ...extraLiveMatches.filter(m => !liveMatchesBase.includes(m))];

  const generateMatchId = (match: any, index: number): string => {
    return `${match.Team1}-${match.Team2}-${match.DateTime?.substring(0, 10) || ''}-${index}`;
  };

  const convertMatchToProps = (match: any, index: number) => {
    let matchStatus: "upcoming" | "live" | "finished";
    if (match.Winner) {
      matchStatus = "finished";
    } else if (liveMatches.some(liveMatch =>
      liveMatch.Team1 === match.Team1 &&
      liveMatch.Team2 === match.Team2 &&
      liveMatch.DateTime === match.DateTime
    )) {
      matchStatus = "live";
    } else {
      matchStatus = "upcoming";
    }

    if (matchStatus === 'live') {
      console.log('MATCH LIVE:', match);
      recentMatches.forEach(m => {
        const teamsLive = [match.Team1?.toLowerCase().trim(), match.Team2?.toLowerCase().trim()].sort();
        const teamsFinished = [m.Team1?.toLowerCase().trim(), m.Team2?.toLowerCase().trim()].sort();
        const dateLive = new Date(match.DateTime);
        const dateFinished = new Date(m.DateTime || m["DateTime UTC"]);
        const sameDay = dateLive.getFullYear() === dateFinished.getFullYear() && dateLive.getMonth() === dateFinished.getMonth() && dateLive.getDate() === dateFinished.getDate();
        if (
          JSON.stringify(teamsLive) === JSON.stringify(teamsFinished)
          && m.Tournament?.toLowerCase().trim() === match.Tournament?.toLowerCase().trim()
          && sameDay
          && (
            m.BestOf == null || match.BestOf == null || m.BestOf == match.BestOf
          )
        ) {
          console.log('POTENTIAL FINISHED MATCH (FULL):', m);
        }
      });
    }

    let hasOfficialScore = false;
    let team1Score = match.Team1Score;
    let team2Score = match.Team2Score;
    if (matchStatus === 'upcoming') {
      team1Score = 0;
      team2Score = 0;
    }
    if (matchStatus === 'live') {
      const dateLive = new Date(match.DateTime);
      const finished = recentMatches.find(
        m => {
          const teamsLive = [match.Team1?.toLowerCase().trim(), match.Team2?.toLowerCase().trim()].sort();
          const teamsFinished = [m.Team1?.toLowerCase().trim(), m.Team2?.toLowerCase().trim()].sort();
          const dateFinished = new Date(m.DateTime || m["DateTime UTC"]);
          const sameDay = dateLive.getFullYear() === dateFinished.getFullYear() && dateLive.getMonth() === dateFinished.getMonth() && dateLive.getDate() === dateFinished.getDate();
          if (
            JSON.stringify(teamsLive) === JSON.stringify(teamsFinished)
            && m.Tournament?.toLowerCase().trim() === match.Tournament?.toLowerCase().trim()
            && sameDay
            && (
              m.BestOf == null || match.BestOf == null || m.BestOf == match.BestOf
            )
          ) {
            return true;
          } else {
            return false;
          }
        }
      );
      if (finished) {
        hasOfficialScore = true;
        const getScore = (teamName: string) => {
          if (finished.Team1?.toLowerCase().trim() === teamName.toLowerCase().trim()) return Number(finished.Team1Score);
          if (finished.Team2?.toLowerCase().trim() === teamName.toLowerCase().trim()) return Number(finished.Team2Score);
          return undefined;
        };
        team1Score = getScore(match.Team1);
        team2Score = getScore(match.Team2);
      } else {
        team1Score = 0;
        team2Score = 0;
      }
    }
    if (matchStatus === 'upcoming' && !hasOfficialScore) {
      team1Score = 0;
      team2Score = 0;
    }

    console.log('[DEBUG LOGO TEAM NAME]', match.Team1, match.Team2);

    return {
      id: generateMatchId(match, index),
      teams: [
        {
          id: match.Team1,
          name: match.Team1,
          logo: `/placeholder.svg`,
          score: team1Score
        },
        {
          id: match.Team2,
          name: match.Team2,
          logo: `/placeholder.svg`,
          score: team2Score
        }
      ] as [MatchTeam, MatchTeam],
      competition: {
        id: match.Tournament || "Unknown",
        name: match.Tournament || "Unknown",
      },
      date: match.DateTime,
      status: matchStatus
    };
  };

  const liveMatchIds = new Set(liveMatches.map(m => generateMatchId(m, 0)));
  const upcomingMatchesFiltered = upcomingMatches.filter((m, i) => !liveMatchIds.has(generateMatchId(m, i)));

  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const upcomingMatches24h = upcomingMatchesFiltered.filter(match => {
    const matchDateStr = match.DateTime || match.DateTime_UTC || '';
    if (!matchDateStr) return false;
    
    try {
      const matchDate = new Date(matchDateStr);
      if (isNaN(matchDate.getTime())) return false;
      
      return matchDate > now && matchDate <= in24h;
    } catch (error) {
      console.error('Error parsing date:', matchDateStr, error);
      return false;
    }
  });

  const getFilteredMatches = () => {
    let matches: any[] = [];
    switch (activeTab) {
      case 'live':
        matches = liveMatches;
        break;
      case 'upcoming':
        matches = upcomingMatches24h;
        break;
      case 'recent':
        matches = recentMatches;
        break;
    }
    return matches.filter(match => {
      if (!searchTerm) return true;
      if (selectedCompetition && selectedCompetition !== "Tous") {
        if (!match.Tournament || match.Tournament.toLowerCase().trim() !== selectedCompetition.toLowerCase().trim()) {
          return false;
        }
      }
      return match.Team1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             match.Team2?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const allMatches = [...upcomingMatches, ...recentMatches];
  const competitions = ["Tous", ...new Set(allMatches.map(m => m.Tournament).filter(Boolean))];

  const formatCompetitionName = (overviewPage: string) =>
    overviewPage.replace(/_/g, ' ').replace(/\//g, ' ');

  const filteredMatches = getFilteredMatches();

  console.log('[DEBUG upcomingMatches]', upcomingMatches);
  console.log('[DEBUG appliedFilters]', appliedFilters);
  console.log('[DEBUG selectedCompetition]', selectedCompetition);
  console.log('[DEBUG allMatches]', allMatches);
  console.log('[DEBUG competitions]', competitions);
  console.log('[DEBUG filteredMatches]', filteredMatches);

  const [spoiler, setSpoiler] = useState(true);
  const toggleSpoiler = () => setSpoiler(v => !v);

  const overviewPageFromUpcoming = upcomingMatches && upcomingMatches.length > 0 ? upcomingMatches[0].Tournament : undefined;

  console.log('[DEBUG UPCOMING TOURNAMENTS]', upcomingMatches.map(m => m.Tournament));
  console.log('[DEBUG overviewPageFromUpcoming]', overviewPageFromUpcoming);

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <h1 className="text-3xl font-bold mb-6">Matchs</h1>
        
        <div className="flex border-b border-dark-700 mb-6">
          <button 
            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'live' ? 'border-esport-500 text-esport-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('live')}
          >
            En Direct
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'upcoming' ? 'border-esport-500 text-esport-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            À Venir
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'recent' ? 'border-esport-500 text-esport-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('recent')}
          >
            Résultats Récents
          </button>
          <label className="ml-4 flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={spoiler} onChange={toggleSpoiler} className="accent-esport-400" />
            <span className="text-sm">Spoiler</span>
          </label>
        </div>
        
        <div className="mb-8 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher une équipe..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setFiltersVisible(!filtersVisible)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
          
          {filtersVisible && (
            <div className="p-4 bg-background rounded-lg border animate-in">
              <div>
                <label className="block text-sm font-medium mb-2">Compétition</label>
                <div className="flex flex-wrap gap-2">
                  {competitions.map(competition => (
                    <button
                      key={competition}
                      className={`px-3 py-1 rounded ${selectedCompetition === competition ? 'bg-esport-500 text-white' : 'bg-dark-700 text-gray-300'}`}
                      onClick={() => setSelectedCompetition(competition)}
                    >
                      {competition === "Tous" ? "Tous" : formatCompetitionName(competition)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="default"
                  className="flex items-center gap-2"
                  onClick={applyFilters}
                >
                  <RefreshCw className="h-4 w-4" />
                  Appliquer les filtres
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid gap-4">
          {(activeTab === 'live' && upcomingLoading) || 
           (activeTab === 'upcoming' && upcomingLoading) || 
           (activeTab === 'recent' && recentLoading) ? (
            <div className="text-center py-8">
              <p>Chargement des matchs...</p>
            </div>
          ) : (
            filteredMatches.length > 0 ? (
              filteredMatches.map((match, index) => (
                <MatchCard
                  key={`${activeTab}-${index}-${match.Team1}-${match.Team2}`}
                  {...convertMatchToProps(match, index)}
                  spoiler={spoiler}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>
                  Aucun match trouvé 
                  {activeTab === 'live' && upcomingFallback && " (Mode de secours activé)"}
                  {activeTab === 'upcoming' && upcomingFallback && " (Mode de secours activé)"}
                  {activeTab === 'recent' && recentFallback && " (Mode de secours activé)"}
                </p>
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={resetFilters}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )
          )}
        </div>
        <StandingsTable tournamentName={appliedFilters.competition} overviewPageFromUpcoming={overviewPageFromUpcoming} />
      </div>
    </Layout>
  );
}
