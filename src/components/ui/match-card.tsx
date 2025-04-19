
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CalendarClock } from "lucide-react";
import { useTeamInfo } from "@/hooks/useTeamInfo";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogo } from "@/hooks/useLogo";
import { useState } from "react";

export interface MatchTeam {
  id: string;
  name: string;
  logo?: string;
  score?: number;
}

export interface MatchProps {
  id: string;
  teams: [MatchTeam, MatchTeam];
  competition: {
    id: string;
    name: string;
    logo?: string;
  };
  date: string;
  status: 'live' | 'upcoming' | 'finished';
  link?: string;
}

export function MatchCard({ id, teams, competition, date, status, link }: MatchProps) {
  // Charger les logos
  const { data: team1Logo, isLoading: isLoading1 } = useLogo('team', teams[0].name, teams[0].logo);
  const { data: team2Logo, isLoading: isLoading2 } = useLogo('team', teams[1].name, teams[1].logo);
  const { data: competitionLogo, isLoading: isLoadingComp } = useLogo('tournament', competition.name);
  
  // États pour gérer les erreurs d'image
  const [team1LogoError, setTeam1LogoError] = useState(false);
  const [team2LogoError, setTeam2LogoError] = useState(false);
  const [compLogoError, setCompLogoError] = useState(false);

  // Format the date
  const matchDate = new Date(date);
  const formattedDate = matchDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
  
  const formattedTime = matchDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  // Determine if score should be shown
  const showScore = status === 'live' || status === 'finished';
  
  // Déterminer les classes CSS en fonction du statut
  const statusClass = {
    upcoming: "text-gray-400",
    live: "text-red-500 animate-pulse",
    finished: "text-gray-400"
  }[status];

  // Fonction pour obtenir le logo correct pour une équipe
  const getTeamLogo = (index: 0 | 1) => {
    const teamLogo = index === 0 ? team1Logo : team2Logo;
    const errorState = index === 0 ? team1LogoError : team2LogoError;
    const defaultLogo = teams[index].logo;
    
    if (errorState) return '/placeholder.svg';
    return teamLogo || defaultLogo || '/placeholder.svg';
  };

  return (
    <Link to={link || `/matches/${id}`} className="block">
      <div className="esport-card p-4 hover:border-esport-600 transition-all">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {status === 'live' && (
              <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                En direct
              </span>
            )}
            {status === 'upcoming' && (
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <CalendarClock className="h-4 w-4" />
                {formattedDate} - {formattedTime}
              </span>
            )}
            {status === 'finished' && (
              <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">
                Terminé
              </span>
            )}
          </div>
          <div className="text-sm text-gray-400 font-medium">
            {competition.name}
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-4">
          {/* Team 1 */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-dark-700 flex items-center justify-center overflow-hidden">
                {isLoading1 ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <img 
                    src={getTeamLogo(0)} 
                    alt={teams[0].name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      console.error(`Failed to load logo for ${teams[0].name}`);
                      setTeam1LogoError(true);
                    }}
                    loading="lazy"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              <div className="font-medium">{teams[0].name}</div>
            </div>
          </div>
          
          {/* Score */}
          <div className={cn(
            "flex items-center gap-2 font-bold text-xl min-w-[80px] justify-center",
            status === 'live' && "text-red-400",
            status === 'finished' && "text-gray-300"
          )}>
            {showScore ? (
              <>
                <span>{teams[0].score}</span>
                <span className="text-gray-600">:</span>
                <span>{teams[1].score}</span>
              </>
            ) : (
              <span className="text-sm font-medium text-gray-600">VS</span>
            )}
          </div>
          
          {/* Team 2 */}
          <div className="flex-1">
            <div className="flex items-center gap-3 justify-end">
              <div className="font-medium order-1">{teams[1].name}</div>
              <div className="w-12 h-12 rounded bg-dark-700 flex items-center justify-center overflow-hidden order-2">
                {isLoading2 ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <img 
                    src={getTeamLogo(1)} 
                    alt={teams[1].name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      console.error(`Failed to load logo for ${teams[1].name}`);
                      setTeam2LogoError(true);
                    }}
                    loading="lazy"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
