
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogo } from "@/hooks/useLogo";
import { useState, useEffect } from "react";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
}

export interface TeamProps {
  id: string;
  name: string;
  logo: string;
  country?: string;
  members?: TeamMember[];
  game?: string;
}

export function TeamCard({ id, name, logo, country, game }: TeamProps) {
  const { data: logoUrl, isLoading, isError } = useLogo("team", name, logo);
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  // Reset l'état d'erreur quand logoUrl change
  useEffect(() => {
    setImageError(false);
    setCurrentLogoIndex(0);
    setFallbackUrl(null);
  }, [logoUrl]);

  // Fonction pour obtenir l'URL du logo actuel
  const getCurrentLogo = () => {
    if (fallbackUrl) return fallbackUrl;
    if (imageError) return '/placeholder.svg';
    if (!logoUrl) return logo || '/placeholder.svg';

    // Si c'est un tableau d'URLs (pour les logos connus)
    if (Array.isArray(logoUrl)) {
      return currentLogoIndex < logoUrl.length ? logoUrl[currentLogoIndex] : '/placeholder.svg';
    }

    return logoUrl;
  };

  const handleImageError = () => {
    // Si nous avons un tableau d'URLs et il y a encore des alternatives à essayer
    if (Array.isArray(logoUrl) && currentLogoIndex < logoUrl.length - 1) {
      console.log(`[TeamCard] Trying next logo source for ${name}`);
      setCurrentLogoIndex(currentLogoIndex + 1);
    } else if (!fallbackUrl) {
      // Si c'est la première erreur avec une URL non-tableau, essayer avec le logo par défaut
      if (logo && logoUrl !== logo) {
        console.log(`[TeamCard] Trying default logo for ${name}`);
        setFallbackUrl(logo);
      } else {
        console.warn(`[TeamCard] Failed to load image for team: ${name}, falling back to default logo`);
        setImageError(true);
      }
    } else {
      // Si même le fallback échoue
      console.warn(`[TeamCard] All logo sources failed for ${name}`);
      setImageError(true);
    }
  };

  return (
    <Link to={`/teams/${id}`} className="block">
      <div className="esport-card hover:border-esport-600 transition-all">
        <div className="p-4 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center overflow-hidden mb-3 relative">
            {isLoading ? (
              <Skeleton className="absolute inset-0 w-full h-full rounded-full z-0" />
            ) : (
              <img
                key={getCurrentLogo()} // Force re-render when URL changes
                src={getCurrentLogo()}
                alt={`${name} logo`}
                className="w-full h-full object-contain p-1"
                onError={handleImageError}
                loading="lazy"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
          <h3 className="text-lg font-semibold text-center mb-1">{name}</h3>
          {country && <p className="text-sm text-gray-400">{country}</p>}
          {game && <p className="text-xs text-gray-500">{game}</p>}
        </div>
      </div>
    </Link>
  );
}
