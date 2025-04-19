
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { MatchCard } from "@/components/ui/match-card";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUpcomingMatches } from "@/hooks/useLeagueMatches";

export default function Matches() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompetition, setSelectedCompetition] = useState("Tous");
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  const { data: matches = [], isLoading, isFallback } = useUpcomingMatches(20);

  console.log("Matches page data:", {
    matches: matches,
    count: matches?.length || 0,
    isFallback: isFallback,
    competitions: matches.map(m => m.Tournament).filter(Boolean)
  });

  // Filter matches based on search and competition
  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      match.Team1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.Team2?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompetition = selectedCompetition === "Tous" || match.Tournament === selectedCompetition;
    
    return matchesSearch && matchesCompetition;
  });

  // Get unique competitions from all matches
  const competitions = ["Tous", ...new Set(matches.map(m => m.Tournament).filter(Boolean))];
  
  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <h1 className="text-3xl font-bold mb-6">Matchs à venir</h1>
        
        {/* Search and filter */}
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
            </div>
          )}
        </div>
        
        {/* Matches list */}
        <div className="grid gap-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p>Chargement des matchs...</p>
            </div>
          ) : filteredMatches.length > 0 ? (
            filteredMatches.map((match, index) => (
              <MatchCard
                key={`${match.Team1}-${match.Team2}-${match.DateTime}-${index}`}
                id={`${match.Team1}-${match.Team2}-${match.DateTime}`}
                teams={[
                  { id: match.Team1, name: match.Team1 },
                  { id: match.Team2, name: match.Team2 }
                ]}
                competition={{
                  id: match.Tournament || "Unknown",
                  name: match.Tournament || "Unknown"
                }}
                date={match.DateTime}
                status="upcoming"
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>Aucun match trouvé {isFallback ? "(Mode de secours activé)" : ""}</p>
              <Button 
                variant="link" 
                className="mt-2"
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
      </div>
    </Layout>
  );
}
