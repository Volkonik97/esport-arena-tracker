import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { CompetitionCard } from "@/components/ui/competition-card";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data for competitions
const allCompetitions = [
  {
    id: "comp1",
    name: "LEC Spring 2025",
    game: "League of Legends",
    startDate: "2025-01-10",
    endDate: "2025-05-20",
    status: "ongoing" as const,
    prize: "€250,000",
  },
  {
    id: "comp2",
    name: "LCS Spring 2025",
    game: "League of Legends",
    startDate: "2025-01-15",
    endDate: "2025-04-25",
    status: "ongoing" as const,
    prize: "$200,000",
  },
  {
    id: "comp3",
    name: "VCT Americas 2025",
    game: "Valorant",
    startDate: "2025-03-01",
    endDate: "2025-06-15",
    status: "ongoing" as const,
    prize: "$500,000",
  },
  {
    id: "comp4",
    name: "LCK Spring 2025",
    game: "League of Legends",
    startDate: "2025-01-10",
    endDate: "2025-04-10",
    status: "finished" as const,
    prize: "₩400,000,000",
  },
  {
    id: "comp5",
    name: "IEM Cologne 2025",
    game: "CS2",
    startDate: "2025-07-15",
    endDate: "2025-07-28",
    status: "upcoming" as const,
    prize: "$1,000,000",
  },
  {
    id: "comp6",
    name: "PGL Major Stockholm 2025",
    game: "CS2",
    startDate: "2025-10-01",
    endDate: "2025-10-14",
    status: "upcoming" as const,
    prize: "$2,000,000",
  },
  {
    id: "comp7",
    name: "The International 2025",
    game: "Dota 2",
    startDate: "2025-08-15",
    endDate: "2025-08-30",
    status: "upcoming" as const,
    prize: "$30,000,000+",
  },
  {
    id: "comp8",
    name: "Worlds 2025",
    game: "League of Legends",
    startDate: "2025-09-25",
    endDate: "2025-11-05",
    status: "upcoming" as const,
    prize: "$2,500,000",
  },
  {
    id: "comp9",
    name: "VALORANT Champions 2025",
    game: "Valorant",
    startDate: "2025-08-31",
    endDate: "2025-09-19",
    status: "upcoming" as const,
    prize: "$1,000,000",
  },
];

// Filter options
const games = ["Tous", "League of Legends", "Valorant", "CS2", "Dota 2"];
const statuses = ["Tous", "En cours", "À venir", "Terminés"];

export default function Competitions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState("Tous");
  const [selectedStatus, setSelectedStatus] = useState("Tous");
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  // Filter competitions based on search term and filters
  const filteredCompetitions = allCompetitions.filter(competition => {
    const matchesSearch = competition.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = selectedGame === "Tous" || competition.game === selectedGame;
    
    let matchesStatus = true;
    if (selectedStatus === "En cours") matchesStatus = competition.status === "ongoing";
    if (selectedStatus === "À venir") matchesStatus = competition.status === "upcoming";
    if (selectedStatus === "Terminés") matchesStatus = competition.status === "finished";
    
    return matchesSearch && matchesGame && matchesStatus;
  });
  
  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <h1 className="text-3xl font-bold mb-6">Compétitions</h1>
        
        {/* Search and filter */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher une compétition..."
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Jeu</label>
                  <div className="flex flex-wrap gap-2">
                    {games.map(game => (
                      <Button
                        key={game}
                        variant={selectedGame === game ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedGame(game)}
                        className={selectedGame === game ? "bg-esport-600" : "border-dark-700"}
                      >
                        {game}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Statut</label>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map(status => (
                      <Button
                        key={status}
                        variant={selectedStatus === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedStatus(status)}
                        className={selectedStatus === status ? "bg-esport-600" : "border-dark-700"}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Competitions grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitions.map(competition => (
            <CompetitionCard key={competition.id} {...competition} />
          ))}
          
          {filteredCompetitions.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">Aucune compétition trouvée avec les filtres actuels.</p>
              <Button 
                variant="link" 
                className="text-esport-400 mt-2"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedGame("Tous");
                  setSelectedStatus("Tous");
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
