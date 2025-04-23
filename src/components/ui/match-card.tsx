
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
  spoiler?: boolean;
}

export function MatchCard({ id, teams, competition, date, status, link, spoiler }: MatchProps) {
  // Débogage: afficher les noms d'équipes reçus et la date spécifique pour chaque MatchCard
  console.log(`[MatchCard] Équipes reçues : ${teams.map(t => t.name)} Date reçue: ${date}`);

  // Cas spécial pour Talon
  const team1IsTalon = teams[0].name === 'Talon';
  const team2IsTalon = teams[1].name === 'Talon';
  
  // Charger les logos
  const { data: team1Logo, isLoading: isLoading1 } = useLogo('team', teams[0].name, teams[0].logo);
  const { data: team2Logo, isLoading: isLoading2 } = useLogo('team', teams[1].name, teams[1].logo);
  const { data: competitionLogo, isLoading: isLoadingComp } = useLogo('tournament', competition.name);
  
  // États pour gérer les erreurs d'image
  const [team1LogoError, setTeam1LogoError] = useState(false);
  const [team2LogoError, setTeam2LogoError] = useState(false);
  const [compLogoError, setCompLogoError] = useState(false);

  // Logo spécial pour Talon
  const talonLogoUrl = 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/6/66/TALON_%28Hong_Kong_Team%29logo_profile.png/revision/latest?cb=20210728214242&format=original';
  
  // Format the date (robust: handle invalid/empty)
  let formattedDate = '';
  let formattedTime = '';
  
  if (date && typeof date === 'string' && date !== 'undefined') {
    try {
      // Débogage: afficher la date brute avant traitement
      console.log(`[MatchCard] Traitement de la date: ${date}`);
      
      // Forcément traiter la date comme UTC pour l'afficher à l'heure locale utilisateur
      const matchDate = new Date(date + (date.match(/T|Z|\+/) ? '' : ' UTC'));
      
      console.log(`[MatchCard] Date convertie: ${matchDate.toISOString()}`);
      
      if (!isNaN(matchDate.getTime())) {
        formattedDate = matchDate.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short',
        });
        formattedTime = matchDate.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        
        console.log(`[MatchCard] Date formatée: ${formattedDate} - ${formattedTime}`);
      } else {
        console.warn(`[MatchCard] DateTime non valide: ${date}`);
        formattedDate = '??';
        formattedTime = '--:--';
      }
    } catch (error) {
      console.error(`[MatchCard] Erreur de formatage de date:`, error, `pour la date: ${date}`);
      formattedDate = '??';
      formattedTime = '--:--';
    }
  } else {
    console.warn(`[MatchCard] DateTime manquant ou invalide: ${date}`);
    formattedDate = '??';
    formattedTime = '--:--';
  }
  
  // Determine if score should be shown
  const showScore = status === 'live' || status === 'finished';
  
  // Déterminer si le score doit être masqué (spoiler actif et match terminé ou live)
  const hideScore = spoiler && (status === 'finished' || status === 'live');

  // Déterminer les classes CSS en fonction du statut
  const statusClass = {
    upcoming: "text-gray-400",
    live: "text-red-500 animate-pulse",
    finished: "text-gray-400"
  }[status];

  // Fonction pour obtenir le logo correct pour une équipe
  const getTeamLogo = (index: 0 | 1) => {
    // Si c'est Talon, utiliser directement l'URL spéciale
    if ((index === 0 && team1IsTalon) || (index === 1 && team2IsTalon)) {
      return talonLogoUrl;
    }
    
    const teamLogo = index === 0 ? team1Logo : team2Logo;
    const errorState = index === 0 ? team1LogoError : team2LogoError;
    const defaultLogo = teams[index].logo;
    
    if (errorState) return '/placeholder.svg';
    return teamLogo || defaultLogo || '/placeholder.svg';
  };

  // Affichage temporaire pour debug : afficher l'URL utilisée pour Talon
  if (team1IsTalon) {
    console.log('[MatchCard] Logo utilisé pour Talon (team1):', getTeamLogo(0));
  }
  if (team2IsTalon) {
    console.log('[MatchCard] Logo utilisé pour Talon (team2):', getTeamLogo(1));
  }

  return (
    <Link to={link || `/matches/${id}`} className="block">
      <div className="esport-card p-4 hover:border-esport-600 transition-all">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <CalendarClock className="h-4 w-4" />
          <span>{formattedDate} - {formattedTime}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {status === 'live' && (
              <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                En direct
              </span>
            )}
            {status === 'finished' && (
              <span className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-900/70 text-xs text-green-400 font-semibold border border-green-900 uppercase tracking-wide">
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" className="inline mr-1"><circle cx="10" cy="10" r="10" fill="#22c55e"/><path d="M6 10.5l2.5 2.5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Terminé
                </span>
              </span>
            )}
          </div>
          <div className="text-sm text-gray-400 font-medium">
            {competition.name}
          </div>
        </div>
        
        {/* Ligne principale : logos, noms, vs */}
        <div className="flex flex-row items-center justify-between gap-6 px-2 py-2">
          {/* Team 1 */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {isLoading1 ? (
              <Skeleton className="h-10 w-10 rounded bg-dark-700" />
            ) : (
              <img
                src={getTeamLogo(0)}
                alt={teams[0].name}
                className="h-10 w-10 object-contain rounded bg-dark-700"
                onError={() => setTeam1LogoError(true)}
                loading="lazy"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            )}
            <span className="font-bold text-white text-base truncate">
              {teams[0].name}
            </span>
          </div>

          {/* VS central, bien mis en valeur */}
          {teams[0].name && teams[1].name && (
            <span className="text-esport-400 font-bold text-lg mx-2 select-none">vs</span>
          )}

          {/* Team 2 */}
          <div className="flex items-center gap-3 min-w-0 flex-1 justify-end">
            <span className="font-bold text-white text-base truncate text-right">
              {teams[1].name}
            </span>
            {isLoading2 ? (
              <Skeleton className="h-10 w-10 rounded bg-dark-700" />
            ) : (
              <img
                src={getTeamLogo(1)}
                alt={teams[1].name}
                className="h-10 w-10 object-contain rounded bg-dark-700"
                onError={() => setTeam2LogoError(true)}
                loading="lazy"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </div>

        {/* Score : affiché uniquement si showScore est vrai (match terminé ou live) */}
        {showScore && (
          <div className={cn(
            "flex items-center justify-center gap-2 font-bold text-xl min-w-[80px] py-1",
            status === 'live' && "text-red-400",
            status === 'finished' && "text-gray-300"
          )}>
            {hideScore ? (
              <span className="italic text-gray-500">Spoiler</span>
            ) : (
              <>
                <span>{teams[0].score}</span>
                <span className="text-gray-600">:</span>
                <span>{teams[1].score}</span>
              </>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
