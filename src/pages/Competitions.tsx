import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { CompetitionCard } from "@/components/ui/competition-card";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchLeagueTournaments, Tournament } from '@/services/tournaments-service';

// Filter options
const games = ["Tous", "League of Legends", "Valorant", "CS2", "Dota 2"];
const statuses = ["Tous", "En cours", "À venir", "Terminés"];

export default function Competitions() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState("Tous");
  const [selectedStatus, setSelectedStatus] = useState("En cours");
  const [filtersVisible, setFiltersVisible] = useState(false);

  useEffect(() => {
    fetchLeagueTournaments('2025').then((data) => {
      // On filtre pour ne garder que les compétitions ayant une date de début définie
      setTournaments(data.filter(t => t.DateStart));
      setLoading(false);
    });
  }, []);

  // Filter competitions based on search term and filters
  const filteredCompetitions = tournaments.filter(competition => {
    const matchesSearch = competition.Name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = selectedGame === "Tous" || competition.League === selectedGame;
    
    let matchesStatus = true;
    if (selectedStatus === "En cours") matchesStatus = new Date(competition.DateStart) <= new Date() && new Date(competition.Date) > new Date();
    if (selectedStatus === "À venir") matchesStatus = new Date(competition.DateStart) > new Date();
    if (selectedStatus === "Terminés") matchesStatus = new Date(competition.Date) < new Date();
    
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
        
        {loading ? (
          <div>Chargement des compétitions...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompetitions.map((comp) => (
              <CompetitionCard
                key={comp.Name}
                id={comp.Name}
                name={comp.Name}
                logo={undefined}
                game="League of Legends"
                startDate={comp.DateStart}
                endDate={comp.Date}
                status={new Date(comp.Date) < new Date() ? 'finished' : (new Date(comp.DateStart) > new Date() ? 'upcoming' : 'ongoing')}
                prize={comp.Prizepool ? `${comp.Prizepool} ${comp.Currency}` : undefined}
              />
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
        )}
      </div>
    </Layout>
  );
}
