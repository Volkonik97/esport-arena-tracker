
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Users, Globe, Twitter, Facebook, Youtube, Info, ChevronRight, Shield } from "lucide-react";
import { useTeamInfo } from "@/hooks/useTeamInfo";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogo } from "@/hooks/useLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlayerCard } from "@/components/ui/player-card";

// Données statiques pour la démo (à remplacer par des données dynamiques quand disponibles)
const teamData = {
  id: "team1",
  name: "G2 Esports",
  logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/34/G2_Esports_logo.svg/1200px-G2_Esports_logo.svg.png",
  country: "Europe",
  game: "League of Legends",
  foundedYear: 2014,
  description: "G2 Esports est l'une des organisations esportives les plus titrées d'Europe.",
  achievements: [
    "Champions LEC Spring 2023",
    "Finalistes MSI 2022",
    "Champions LEC Summer 2022"
  ],
  roster: [
    { id: "player1", name: "BrokenBlade", role: "Top", country: "Allemagne" },
    { id: "player2", name: "Yike", role: "Jungle", country: "France" },
    { id: "player3", name: "Caps", role: "Mid", country: "Danemark" },
    { id: "player4", name: "Hans Sama", role: "ADC", country: "France" },
    { id: "player5", name: "Mikyx", role: "Support", country: "Slovénie" }
  ],
  history: [
    { year: 2023, event: "Champions LEC Spring", position: "1er" },
    { year: 2022, event: "Worlds", position: "Demi-finalistes" },
    { year: 2022, event: "LEC Summer", position: "Champions" },
    { year: 2022, event: "MSI", position: "Finalistes" },
    { year: 2021, event: "Worlds", position: "Quart de finalistes" }
  ]
};

export default function TeamDetails() {
  const { id } = useParams();
  const { data: teamInfo, isLoading: isLoadingTeamInfo } = useTeamInfo(teamData.name);
  const { data: logoUrl, isLoading: isLoadingLogo } = useLogo('team', teamData.name, teamData.logo);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    // Reset image states when teamInfo or logoUrl changes
    setImageLoaded(false);
    setImageError(false);
  }, [teamInfo, logoUrl]);
  
  const handleImageLoad = () => {
    console.log(`[TeamDetails] Image loaded successfully for team: ${teamData.name}`);
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.warn(`[TeamDetails] Failed to load image for team: ${teamData.name}, falling back to default logo`);
    setImageError(true);
    
    // Show a toast error, but only once
    if (!imageError) {
      toast.error(`Could not load logo for ${teamData.name}`, {
        id: `logo-error-details-${teamData.name}`,
        duration: 3000
      });
    }
  };

  // Add cache-busting parameter to prevent caching issues
  const finalLogoUrl = imageError ? teamData.logo : (logoUrl ? `${logoUrl}?t=${Date.now()}` : teamData.logo);
  
  // State of global loading
  const isLoading = isLoadingTeamInfo || isLoadingLogo || (!imageLoaded && !imageError && !isLoadingLogo);

  // Données enrichies depuis l'API
  const teamRegion = teamInfo?.Region || teamData.country;
  const teamLeague = teamInfo?.League || "LEC";
  const teamDescription = teamData.description;
  const teamWebsite = teamInfo?.Website || "#";
  const teamTwitter = teamInfo?.Twitter || "#";
  const teamFacebook = teamInfo?.Facebook || "#";
  const teamYoutube = teamInfo?.Youtube || "#";

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <Link to="/teams">
            <Button variant="ghost" className="flex gap-2 items-center">
              <ArrowLeft className="h-4 w-4" />
              Retour aux équipes
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-dark-700 text-gray-300">
              {teamRegion}
            </Badge>
            <Badge variant="outline" className="bg-dark-700 text-gray-300">
              {teamLeague}
            </Badge>
          </div>
        </div>

        <div className="mb-8">
          <div className="esport-card p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="relative">
                <div className="w-32 h-32 rounded-lg bg-dark-700 flex items-center justify-center overflow-hidden">
                  {isLoading ? (
                    <Skeleton className="w-full h-full" />
                  ) : (
                    <AvatarImage 
                      src={finalLogoUrl} 
                      alt={teamData.name}
                      className="object-contain p-3"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <div className="absolute -bottom-3 -right-3 bg-dark-700 border-4 border-dark-900 rounded-full p-2">
                  <Shield className="h-6 w-6 text-esport-500" />
                </div>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">{teamInfo?.Name || teamData.name}</h1>
                <div className="text-gray-400 mb-4">Fondée en {teamData.foundedYear}</div>
                <p className="text-gray-300 mb-6 max-w-2xl">{teamDescription}</p>
                
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  {teamWebsite && teamWebsite !== "#" && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={teamWebsite} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-1" />
                        Site web
                      </a>
                    </Button>
                  )}
                  {teamTwitter && teamTwitter !== "#" && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={teamTwitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4 mr-1" />
                        Twitter
                      </a>
                    </Button>
                  )}
                  {teamFacebook && teamFacebook !== "#" && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={teamFacebook} target="_blank" rel="noopener noreferrer">
                        <Facebook className="h-4 w-4 mr-1" />
                        Facebook
                      </a>
                    </Button>
                  )}
                  {teamYoutube && teamYoutube !== "#" && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={teamYoutube} target="_blank" rel="noopener noreferrer">
                        <Youtube className="h-4 w-4 mr-1" />
                        YouTube
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-dark-700 mb-6">
            <TabsList className="bg-transparent">
              <TabsTrigger value="overview" className="data-[state=active]:bg-dark-800">Aperçu</TabsTrigger>
              <TabsTrigger value="roster" className="data-[state=active]:bg-dark-800">Équipe</TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-dark-800">Historique</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="mt-0">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="esport-card p-6 mb-6">
                  <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
                    <Trophy className="h-5 w-5 text-orange-500" />
                    Palmarès récent
                  </h2>
                  <ul className="space-y-4">
                    {teamData.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="flex-1">{achievement}</span>
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="esport-card p-6">
                  <h3 className="text-lg font-bold mb-4">Statistiques</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Victoires (2025)</div>
                      <div className="text-2xl font-bold">24</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Défaites (2025)</div>
                      <div className="text-2xl font-bold">12</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Ratio V/D</div>
                      <div className="text-2xl font-bold text-esport-500">67%</div>
                    </div>
                  </div>
                </div>

                <div className="esport-card p-6">
                  <h3 className="text-lg font-bold mb-4">Prochains matchs</h3>
                  <div className="space-y-4">
                    <div className="text-center text-gray-400 text-sm">
                      Aucun match prévu
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="roster" className="mt-0">
            <div className="esport-card p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold mb-6">
                <Users className="h-5 w-5 text-esport-500" />
                Roster actuel
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamData.roster.map((player) => (
                  <div
                    key={player.id}
                    className="flex flex-col p-4 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors border border-dark-600"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-12 h-12 border-2 border-esport-800">
                        <AvatarFallback className="bg-dark-700 text-gray-400">
                          {player.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{player.name}</div>
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-dark-600 text-xs">{player.role}</span>
                          {player.country}
                        </div>
                      </div>
                    </div>
                    <Link to={`/players/${player.id}`} className="mt-auto">
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        Voir le profil
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <div className="esport-card p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold mb-6">
                <Info className="h-5 w-5 text-blue-500" />
                Historique des compétitions
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-700">
                      <th className="text-left py-3 px-4">Année</th>
                      <th className="text-left py-3 px-4">Tournoi</th>
                      <th className="text-left py-3 px-4">Résultat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamData.history.map((item, index) => (
                      <tr 
                        key={index}
                        className={`border-b border-dark-800 hover:bg-dark-800 transition-colors ${
                          item.position === "Champions" || item.position === "1er" 
                            ? "bg-dark-800/40" 
                            : ""
                        }`}
                      >
                        <td className="py-3 px-4">{item.year}</td>
                        <td className="py-3 px-4">{item.event}</td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={
                              item.position === "Champions" || item.position === "1er" 
                                ? "default" 
                                : "outline"
                            }
                            className={
                              item.position === "Champions" || item.position === "1er" 
                                ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30" 
                                : "bg-dark-700"
                            }
                          >
                            {item.position}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
