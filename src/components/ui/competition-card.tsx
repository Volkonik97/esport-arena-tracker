import { Link } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import { useLogo } from "@/hooks/useLogo";
import { cn } from "@/lib/utils";

export interface CompetitionProps {
  id: string;
  name: string;
  logo?: string;
  game: string;
  startDate: string;
  endDate: string;
  status: 'ongoing' | 'upcoming' | 'finished';
  prize?: string;
}

export function CompetitionCard({ id, name, logo: defaultLogo, game, startDate, endDate, status, prize }: CompetitionProps) {
  // Utiliser le hook useLogo pour les logos
  const { data: logo, isLoading } = useLogo('tournament', name, defaultLogo);
  
  // Format dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  return (
    <Link to={`/competitions/${name}`} className="block">
      <div className="esport-card hover:border-esport-600 transition-all h-full">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "w-12 h-12 rounded bg-dark-700 flex items-center justify-center overflow-hidden",
              isLoading && "animate-pulse"
            )}>
              {!isLoading && logo && (
                <img 
                  src={logo} 
                  alt={name} 
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    console.error(`[Logo] Failed to load image for ${name}:`, e);
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              )}
            </div>
            <div>
              <h3 className="font-bold">{name}</h3>
              <div className="text-xs text-gray-400">{game}</div>
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CalendarClock className="h-4 w-4 text-gray-400" />
              <span>{formatDate(start)} - {formatDate(end)}</span>
            </div>
            
            {prize && (
              <div className="text-sm text-gray-300">
                <span className="text-orange-500 font-medium">Prix:</span> {prize}
              </div>
            )}
            
            <div className="mt-3">
              {status === 'ongoing' && (
                <span className="inline-block bg-esport-900/50 text-esport-400 text-xs px-2 py-1 rounded">
                  En cours
                </span>
              )}
              {status === 'upcoming' && (
                <span className="inline-block bg-orange-900/50 text-orange-400 text-xs px-2 py-1 rounded">
                  À venir
                </span>
              )}
              {status === 'finished' && (
                <span className="inline-block bg-dark-700/50 text-gray-400 text-xs px-2 py-1 rounded">
                  Terminé
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
