import { useState, useEffect, useCallback } from "react";
import Layout from "@/components/layout/Layout";
import { MatchCard, MatchTeam } from "@/components/ui/match-card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUpcomingMatches, useRecentResults } from "@/hooks/useLeagueMatches";
import { DateRangePicker } from "@/components/ui/date-picker";
import { addDays, isAfter, isBefore, isEqual, startOfDay } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export default function Matches() {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'recent'>('live');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompetition, setSelectedCompetition] = useState("Tous");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  
  // État pour gérer les filtres appliqués
  const [appliedFilters, setAppliedFilters] = useState({
    competition: "Tous",
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined
  });
  
  // Accès au queryClient pour invalider les requêtes
  const queryClient = useQueryClient();
  
  // Utiliser les hooks avec les options de filtrage appliquées
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
  
  // Fonction pour appliquer les filtres
  const applyFilters = useCallback(() => {
    setAppliedFilters({
      competition: selectedCompetition,
      dateFrom: dateRange.from,
      dateTo: dateRange.to
    });
    
    // Invalider les requêtes pour forcer un rafraîchissement
    queryClient.invalidateQueries({ queryKey: ['upcoming-matches'] });
    queryClient.invalidateQueries({ queryKey: ['recent-results'] });
    
    // Fermer le panneau des filtres
    setFiltersVisible(false);
    
    // Notification
    toast({
      title: "Filtres appliqués",
      description: "Les résultats ont été mis à jour avec vos filtres.",
    });
  }, [selectedCompetition, dateRange, queryClient]);
  
  // Fonction pour réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCompetition("Tous");
    setDateRange({ from: undefined, to: undefined });
    
    // Appliquer immédiatement les filtres réinitialisés
    setAppliedFilters({
      competition: "Tous",
      dateFrom: undefined,
      dateTo: undefined
    });
    
    // Invalider les requêtes pour forcer un rafraîchissement
    queryClient.invalidateQueries({ queryKey: ['upcoming-matches'] });
    queryClient.invalidateQueries({ queryKey: ['recent-results'] });
    
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été réinitialisés.",
    });
  }, [queryClient]);
  
  // --- LOGIQUE SYNCHRONISÉE AVEC Home.tsx ---
  // Même logique pour déterminer les matchs en direct (durée réelle, ex: 2h)
  const MATCH_DURATION_MINUTES = 120; // 2 heures
  const liveMatches = upcomingMatches.filter(match => {
    const matchDate = new Date(match.DateTime + (match.DateTime.match(/T|Z|\+/) ? '' : ' UTC'));
    const now = new Date();
    const matchEnd = new Date(matchDate.getTime() + MATCH_DURATION_MINUTES * 60 * 1000);
    return now >= matchDate && now <= matchEnd;
  });

  // Générer un ID unique pour chaque match (identique à Home)
  const generateMatchId = (match: any, index: number): string => {
    return `${match.Team1}-${match.Team2}-${match.DateTime?.substring(0, 10) || ''}-${index}`;
  };

  // Conversion des données de match en props pour MatchCard (copie exacte de Home.tsx)
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

    // DEBUG: Log pour comprendre le mismatch
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
    // Déterminer si le match a un premier score officiel (dans recentResults)
    let hasOfficialScore = false;
    let team1Score = match.Team1Score;
    let team2Score = match.Team2Score;
    // Correction : Pour un match à venir, il ne faut JAMAIS afficher les scores de la source, même s'ils sont non-nuls
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
        // Pas de score officiel trouvé pour ce live : afficher 0-0
        team1Score = 0;
        team2Score = 0;
      }
    }
    // Pour les matchs à venir, n'affiche un score que si un score officiel existe dans recentResults
    if (matchStatus === 'upcoming' && !hasOfficialScore) {
      team1Score = 0;
      team2Score = 0;
    }

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
  
  // Filtrer les matchs selon l'onglet actif et les critères de recherche
  const getFilteredMatches = () => {
    let matches: any[] = [];
    
    switch (activeTab) {
      case 'live':
        matches = liveMatches;
        break;
      case 'upcoming':
        matches = upcomingMatches
          // On ne garde que les matchs dont la date de début est strictement dans le futur (comme Home.tsx)
          .filter(match => {
            const matchDate = new Date(match.DateTime + (match.DateTime.match(/T|Z|\+/) ? '' : ' UTC'));
            const now = new Date();
            return matchDate > now;
          })
          // On exclut les matchs déjà considérés comme "live"
          .filter(match => !liveMatches.some(liveMatch =>
            liveMatch.Team1 === match.Team1 &&
            liveMatch.Team2 === match.Team2 &&
            liveMatch.DateTime === match.DateTime
          ));
        break;
      case 'recent':
        // Pour les résultats récents, éliminer les doublons potentiels
        const uniqueMatches: any[] = [];
        const matchKeys = new Set();
        
        recentMatches.forEach(match => {
          // Créer une clé unique pour chaque paire d'équipes
          const teams = [match.Team1, match.Team2].sort().join('_');
          const tournamentKey = match.Tournament || 'unknown';
          const dateKey = new Date(match.DateTime).toDateString();
          const matchKey = `${teams}_${tournamentKey}_${dateKey}`;
          
          // Si nous n'avons pas encore vu cette paire d'équipes pour ce tournoi et cette date
          if (!matchKeys.has(matchKey)) {
            matchKeys.add(matchKey);
            uniqueMatches.push(match);
          } else {
            // Si nous avons déjà vu ce match, vérifier si celui-ci a un gagnant
            // et remplacer l'ancien match par celui-ci si c'est le cas
            const existingMatchIndex = uniqueMatches.findIndex(m => {
              const mTeams = [m.Team1, m.Team2].sort().join('_');
              const mTournament = m.Tournament || 'unknown';
              const mDate = new Date(m.DateTime).toDateString();
              const mKey = `${mTeams}_${mTournament}_${mDate}`;
              return mKey === matchKey;
            });
            
            if (existingMatchIndex !== -1) {
              const existingMatch = uniqueMatches[existingMatchIndex];
              // Si le match actuel a un gagnant et l'existant n'en a pas, ou si le match actuel est plus récent
              if ((match.Winner && !existingMatch.Winner) || 
                  (new Date(match.DateTime) > new Date(existingMatch.DateTime))) {
                uniqueMatches[existingMatchIndex] = match;
              }
            }
          }
        });
        
        matches = uniqueMatches;
        break;
    }
    
    // Appliquer les filtres de recherche par nom d'équipe et par compétition
    return matches.filter(match => {
      if (!searchTerm) return true;
      // Filtre par compétition si sélectionnée (hors "Tous")
      if (selectedCompetition && selectedCompetition !== "Tous") {
        if (!match.Tournament || match.Tournament.toLowerCase().trim() !== selectedCompetition.toLowerCase().trim()) {
          return false;
        }
      }
      return match.Team1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             match.Team2?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  // Obtenir toutes les compétitions uniques de tous les matchs
  const allMatches = [...upcomingMatches, ...recentMatches];
  const competitions = ["Tous", ...new Set(allMatches.map(m => m.Tournament).filter(Boolean))];
  
  const filteredMatches = getFilteredMatches();

  // Ajout : Spoiler toggle (même logique que Home.tsx)
  const [spoiler, setSpoiler] = useState(true);
  const toggleSpoiler = () => setSpoiler(v => !v);

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <h1 className="text-3xl font-bold mb-6">Matchs</h1>
        
        {/* Onglets pour basculer entre les différentes catégories */}
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
        
        {/* Recherche et filtres */}
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
                    <Button
                      key={competition}
                      variant={selectedCompetition === competition ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCompetition(competition)}
                    >
                      {competition}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Dates</label>
                <DateRangePicker
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  placeholder="Filtrer par période"
                />
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
        
        {/* Liste des matchs */}
        <div className="grid gap-4">
          {/* Affichage des matchs selon l'onglet actif */}
          {(activeTab === 'live' && upcomingLoading) || 
           (activeTab === 'upcoming' && upcomingLoading) || 
           (activeTab === 'recent' && recentLoading) ? (
            <div className="text-center py-8">
              <p>Chargement des matchs...</p>
            </div>
          ) : filteredMatches.length > 0 ? (
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
          )}
        </div>
      </div>
    </Layout>
  );
}
