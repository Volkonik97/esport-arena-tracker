
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { PlayerCard } from "@/components/ui/player-card";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data for players
const allPlayers = [
  {
    id: "caps",
    name: "Caps",
    photo: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/d3/G2_Caps_2023_Split_1.png",
    team: {
      id: "g2",
      name: "G2 Esports",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/34/G2_Esports_logo.svg/1200px-G2_Esports_logo.svg.png",
    },
    role: "mid" as const,
    country: "Denmark",
  },
  {
    id: "yike",
    name: "Yike",
    photo: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/3/35/G2_Yike_2023_Split_1.png",
    team: {
      id: "g2",
      name: "G2 Esports",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/34/G2_Esports_logo.svg/1200px-G2_Esports_logo.svg.png",
    },
    role: "jungle" as const,
    country: "France",
  },
  {
    id: "faker",
    name: "Faker",
    photo: "https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/82/T1_Faker_2023_WC.png",
    team: {
      id: "t1",
      name: "T1",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/T1_logo.svg/1200px-T1_logo.svg.png",
    },
    role: "mid" as const,
    country: "South Korea",
  },
];

const roles = ["Tous", "top", "jungle", "mid", "adc", "support"];
const regions = ["Tous", "Europe", "North America", "South Korea", "China"];

export default function Players() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("Tous");
  const [selectedRegion, setSelectedRegion] = useState("Tous");
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  const filteredPlayers = allPlayers.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "Tous" || player.role === selectedRole;
    const matchesRegion = selectedRegion === "Tous" || player.country === selectedRegion;
    
    return matchesSearch && matchesRole && matchesRegion;
  });
  
  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <h1 className="text-3xl font-bold mb-6">Joueurs</h1>
        
        {/* Search and filter */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher un joueur..."
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
                  <label className="block text-sm font-medium text-gray-400 mb-2">Rôle</label>
                  <div className="flex flex-wrap gap-2">
                    {roles.map(role => (
                      <Button
                        key={role}
                        variant={selectedRole === role ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedRole(role)}
                        className={selectedRole === role ? "bg-esport-600" : "border-dark-700"}
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Région</label>
                  <div className="flex flex-wrap gap-2">
                    {regions.map(region => (
                      <Button
                        key={region}
                        variant={selectedRegion === region ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedRegion(region)}
                        className={selectedRegion === region ? "bg-esport-600" : "border-dark-700"}
                      >
                        {region}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Players grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredPlayers.map(player => (
            <PlayerCard key={player.id} {...player} />
          ))}
          
          {filteredPlayers.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">Aucun joueur trouvé avec les filtres actuels.</p>
              <Button 
                variant="link" 
                className="text-esport-400 mt-2"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRole("Tous");
                  setSelectedRegion("Tous");
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
