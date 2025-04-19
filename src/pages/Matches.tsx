import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { MatchCard, MatchTeam } from "@/components/ui/match-card";
import { Button } from "@/components/ui/button";
import { Search, Filter, CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRecentResults, useUpcomingMatches, LeagueMatch } from "@/hooks/useLeagueMatches";

// Type pour un match groupé avec toutes ses manches
interface GroupedMatch {
  Tournament: string;
  Region: string;
  DateTime: string;
  Team1: string;
  Team2: string;
  Winner?: string;
  Team1Score: number;
  Team2Score: number;
  League: string;
  games: LeagueMatch[];
}

export default function Matches() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompetition, setSelectedCompetition] = useState("Tous");
  const [selectedGame, setSelectedGame] = useState("Tous");
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  const { data: upcomingMatches = [], isLoading: upcomingLoading } = useUpcomingMatches(20);
  const { data: recentMatches = [], isLoading: recentLoading } = useRecentResults(20);

  // Groupe les matches par équipes et date
  const groupMatches = (matches: LeagueMatch[]): GroupedMatch[] => {
    const grouped = matches.reduce((acc, match) => {
      const key = `${match.Team1}-${match.Team2}-${new Date(match.DateTime).toDateString()}`;
      if (!acc[key]) {
        acc[key] = {
          ...match,
          Team1Score: match.Team1Score || 0,
          Team2Score: match.Team2Score || 0,
          games: []
        };
      }
      acc[key].games.push(match);
      
      // Met à jour le score total
      if (match.Team1Score !== undefined && match.Team2Score !== undefined) {
        // Si c'est le dernier match joué, utiliser ses scores
        const matchTime = new Date(match.DateTime).getTime();
        const currentMatchTime = new Date(acc[key].DateTime).getTime();
        if (matchTime > currentMatchTime) {
          acc[key].Team1Score = match.Team1Score;
          acc[key].Team2Score = match.Team2Score;
          acc[key].DateTime = match.DateTime;
          acc[key].Winner = match.Winner;
        }
      }
      
      return acc;
    }, {} as Record<string, GroupedMatch>);
    
    return Object.values(grouped);
  };

  const liveMatches = groupMatches(upcomingMatches.filter(match => {
    const matchDate = new Date(match.DateTime);
    const now = new Date();
    return matchDate <= now && matchDate >= new Date(now.getTime() - 3 * 60 * 60 * 1000); // 3 hours window
  }));

  // Filter matches based on search and competition
  const filterMatches = (matches: GroupedMatch[]) => {
    return matches.filter(match => {
      const matchesSearch = 
        match.Team1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.Team2.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCompetition = selectedCompetition === "Tous" || match.Tournament === selectedCompetition;
      
      return matchesSearch && matchesCompetition;
    });
  };

  // Get unique competitions from all matches
  const competitions = ["Tous", ...new Set([
    ...upcomingMatches.map(m => m.Tournament),
    ...recentMatches.map(m => m.Tournament)
  ])];
  
  const filteredLiveMatches = filterMatches(liveMatches);
  const filteredUpcomingMatches = filterMatches(groupMatches(upcomingMatches.filter(match => 
    !liveMatches.some(liveMatch => 
      liveMatch.Team1 === match.Team1 && 
      liveMatch.Team2 === match.Team2 && 
      new Date(liveMatch.DateTime).toDateString() === new Date(match.DateTime).toDateString()
    )
  )));
  const filteredRecentMatches = filterMatches(groupMatches(recentMatches));

  // Generate a unique ID for a match
  const generateMatchId = (match: GroupedMatch): string => {
    const timestamp = new Date(match.DateTime).getTime();
    const hash = `${match.Team1}${match.Team2}${match.Tournament}${timestamp}`.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash).toString(36);
  };

  // Convert Leaguepedia match to MatchCard props
  const convertMatchToProps = (match: GroupedMatch) => {
    // Determine the match status
    let matchStatus: "upcoming" | "live" | "finished";
    const now = new Date();
    const matchDate = new Date(match.DateTime);
    
    if (match.Winner || 
        (match.Team1Score !== undefined && match.Team2Score !== undefined && 
         (match.Team1Score > 0 || match.Team2Score > 0))) {
      matchStatus = "finished";
    } else if (matchDate <= now && matchDate >= new Date(now.getTime() - 3 * 60 * 60 * 1000)) {
      matchStatus = "live";
    } else {
      matchStatus = "upcoming";
    }

    // Si le match est terminé mais n'a pas de scores, essayer de les déduire du gagnant
    if (matchStatus === "finished" && match.Team1Score === 0 && match.Team2Score === 0 && match.Winner) {
      if (match.Winner === match.Team1) {
        match.Team1Score = 1;
        match.Team2Score = 0;
      } else if (match.Winner === match.Team2) {
        match.Team1Score = 0;
        match.Team2Score = 1;
      }
    }

    return {
      id: generateMatchId(match),
      teams: [
        { 
          id: match.Team1,
          name: match.Team1,
          score: matchStatus === "finished" ? match.Team1Score : undefined
        },
        {
          id: match.Team2,
          name: match.Team2,
          score: matchStatus === "finished" ? match.Team2Score : undefined
        }
      ] as [MatchTeam, MatchTeam],
      competition: {
        id: match.Tournament,
        name: match.Tournament,
      },
      date: match.DateTime,
      status: matchStatus
    };
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <h1 className="text-3xl font-bold mb-6">Matchs</h1>
        
        {/* Search and filter */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher une équipe..."
                className="pl-10 bg-dark-800 border-dark-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="border-dark-700"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
          
          {filtersVisible && (
            <div className="p-4 bg-dark-800 rounded-lg border border-dark-700 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Compétition</label>
                <div className="flex flex-wrap gap-2">
                  {competitions.map(competition => (
                    <Button
                      key={competition}
                      variant={selectedCompetition === competition ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCompetition(competition)}
                      className={selectedCompetition === competition ? "bg-esport-600" : "border-dark-700"}
                    >
                      {competition}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Tabs for match status */}
        <Tabs defaultValue="live" className="mb-6">
          <TabsList className="grid grid-cols-3 w-full md:w-80">
            <TabsTrigger value="live" className="data-[state=active]:bg-esport-600">En Direct</TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-esport-600">À Venir</TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-esport-600">Récents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="live" className="mt-6">
            <div className="grid gap-3">
              {upcomingLoading ? (
                <div className="text-center py-8">
                  <p>Chargement des matchs en direct...</p>
                </div>
              ) : filteredLiveMatches.length > 0 ? (
                filteredLiveMatches.map(match => (
                  <MatchCard key={generateMatchId(match)} {...convertMatchToProps(match)} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Aucun match en direct actuellement</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-6">
            <div className="grid gap-3">
              {upcomingLoading ? (
                <div className="text-center py-8">
                  <p>Chargement des matchs à venir...</p>
                </div>
              ) : filteredUpcomingMatches.length > 0 ? (
                filteredUpcomingMatches.map(match => (
                  <MatchCard key={generateMatchId(match)} {...convertMatchToProps(match)} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Aucun match à venir avec les filtres actuels</p>
                  <Button 
                    variant="link" 
                    className="text-esport-400 mt-2"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCompetition("Tous");
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="mt-6">
            <div className="grid gap-3">
              {recentLoading ? (
                <div className="text-center py-8">
                  <p>Chargement des matchs récents...</p>
                </div>
              ) : filteredRecentMatches.length > 0 ? (
                filteredRecentMatches.map(match => (
                  <MatchCard key={generateMatchId(match)} {...convertMatchToProps(match)} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Aucun match récent avec les filtres actuels</p>
                  <Button 
                    variant="link" 
                    className="text-esport-400 mt-2"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCompetition("Tous");
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
