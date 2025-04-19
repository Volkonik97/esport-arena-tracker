
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Users } from "lucide-react";
import { useTeamInfo } from "@/hooks/useTeamInfo";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogo } from "@/hooks/useLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

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
  ]
};

export default function TeamDetails() {
  const { id } = useParams();
  const { data: teamInfo, isLoading: isLoadingTeamInfo } = useTeamInfo(teamData.name);
  const { data: logoUrl, isLoading: isLoadingLogo } = useLogo('team', teamData.name, teamData.logo);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
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

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <Link to="/teams">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux équipes
          </Button>
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="esport-card p-6 mb-6">
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="w-24 h-24 rounded-lg bg-dark-700 flex items-center justify-center overflow-hidden">
                  {isLoading ? (
                    <Skeleton className="w-full h-full" />
                  ) : (
                    <AvatarImage 
                      src={finalLogoUrl} 
                      alt={teamData.name}
                      className="object-contain p-2"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <AvatarFallback className="bg-dark-800 text-gray-400 text-xl">
                    {teamData.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{teamData.name}</h1>
                  <div className="flex items-center gap-4 text-gray-400">
                    <span>{teamData.country}</span>
                    <span>•</span>
                    <span>{teamData.game}</span>
                    <span>•</span>
                    <span>Fondée en {teamData.foundedYear}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-6">{teamData.description}</p>

              <div className="border-t border-dark-700 pt-6">
                <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
                  <Trophy className="h-5 w-5 text-orange-500" />
                  Palmarès récent
                </h2>
                <ul className="space-y-2">
                  {teamData.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="esport-card p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold mb-6">
                <Users className="h-5 w-5 text-esport-500" />
                Roster actuel
              </h2>
              <div className="grid gap-4">
                {teamData.roster.map((player) => (
                  <Link 
                    key={player.id} 
                    to={`/players/${player.id}`}
                    className="flex items-center justify-between p-4 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-gray-400">{player.role}</div>
                    </div>
                    <div className="text-sm text-gray-400">{player.country}</div>
                  </Link>
                ))}
              </div>
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
      </div>
    </Layout>
  );
}
