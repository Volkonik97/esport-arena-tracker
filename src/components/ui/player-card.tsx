
import { Link } from "react-router-dom";

export interface PlayerProps {
  id: string;
  name: string;
  photo?: string;
  team?: {
    id: string;
    name: string;
    logo: string;
  };
  role: "top" | "jungle" | "mid" | "adc" | "support";
  country?: string;
}

export function PlayerCard({ id, name, photo, team, role, country }: PlayerProps) {
  return (
    <Link to={`/players/${id}`} className="block">
      <div className="esport-card hover:border-esport-600 transition-all">
        <div className="p-4 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center overflow-hidden mb-3">
            {photo ? (
              <img src={photo} alt={name} className="w-16 h-16 object-cover" />
            ) : (
              <img 
                src="https://static.wikia.nocookie.net/leagueoflegends/images/1/12/Season_2019_-_Diamond_1.png"
                alt={name}
                className="w-12 h-12 object-contain"
              />
            )}
          </div>
          <h3 className="font-bold text-center">{name}</h3>
          {team && (
            <div className="mt-2 flex items-center gap-2">
              <div className="w-4 h-4">
                <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
              </div>
              <span className="text-sm text-gray-400">{team.name}</span>
            </div>
          )}
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded bg-esport-900/50 text-esport-400">
              {role.toUpperCase()}
            </span>
            {country && (
              <span className="text-xs text-gray-400">{country}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
