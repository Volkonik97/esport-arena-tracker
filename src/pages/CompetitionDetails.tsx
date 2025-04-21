import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, ChevronLeft, Trophy } from "lucide-react";
import { MatchCard, MatchTeam } from "@/components/ui/match-card";
import { Link } from "react-router-dom";
import { useUpcomingMatches, useRecentResults, LeagueMatch } from "@/hooks/useLeagueMatches";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLogo } from "@/hooks/useLogo";

export default function CompetitionDetails() {
  const { id } = useParams();
  const { toast } = useToast();

  // Récupérer le logo de la compétition AVANT les useEffect !
  const { data: competitionLogo, isLoading: isLogoLoading } = useLogo('tournament', id);

  // Directement passer l'ID du tournoi aux hooks pour filtrer à la source des données
  const { data: upcomingMatches = [], isLoading: upcomingLoading, error: upcomingError } = useUpcomingMatches(1000, { tournamentFilter: id });
  const { data: recentMatches = [], isLoading: recentLoading, error: recentError } = useRecentResults(1000, { tournamentFilter: id });

  // Pour le calendrier complet, on fusionne ces deux listes et on trie par date
  const fullSchedule = [...upcomingMatches, ...recentMatches].sort((a, b) => new Date(a.DateTime).getTime() - new Date(b.DateTime).getTime());

  // DEBUG : Afficher toutes les dates présentes dans fullSchedule
  console.log('DATES FULL SCHEDULE', fullSchedule.map(m => m.DateTime));

  // Afficher un message d'erreur si les deux requêtes ont échoué
  useEffect(() => {
    if (upcomingError && recentError) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de charger les données des matchs.",
        variant: "destructive",
      });
    }
    // DEBUG: Affiche le nom du tournoi utilisé pour le logo
    console.log('[LOGO DEBUG][CompetitionDetails] tournament id:', id);
    // DEBUG: Affiche l'URL du logo utilisée par useLogo
    console.log('[LOGO DEBUG][CompetitionDetails] logo from useLogo:', competitionLogo);
    // DEBUG: Affiche l'URL du logo utilisée dans la balise <img>
    const logoImg = document.querySelector('img[alt="Logo ' + id + '"]');
    if (logoImg) {
      console.log('[LOGO DEBUG][CompetitionDetails] logo src:', logoImg.getAttribute('src'));
    } else {
      console.log('[LOGO DEBUG][CompetitionDetails] logo img not found in DOM');
    }
  }, [upcomingError, recentError, id, toast, competitionLogo]);

  // Convertir les données de match au format MatchCard props
  const convertMatchToProps = (match: LeagueMatch) => ({
    id: `${match.Team1}-${match.Team2}-${match.DateTime}`,
    teams: [
      { 
        id: match.Team1,
        name: match.Team1,
        logo: `/placeholder.svg`,
        score: match.Team1Score
      },
      {
        id: match.Team2,
        name: match.Team2,
        logo: `/placeholder.svg`,
        score: match.Team2Score
      }
    ] as [MatchTeam, MatchTeam],
    competition: {
      id: match.Tournament,
      name: match.Tournament,
    },
    date: match.DateTime,
    status: match.Winner ? "finished" as const : 
           new Date(match.DateTime) <= new Date() ? "live" as const : 
           "upcoming" as const
  });

  // Fonction utilitaire : normalise et trie les mots d'une chaîne
  function normalizeAndSortWords(str?: string) {
    return (str || "")
      .toLowerCase()
      .replace(/[^a-z0-9 ]/gi, " ")
      .split(/\s+/)
      .filter(Boolean)
      .sort()
      .join(" ");
  }

  // DEBUG : log tous les tournois présents dans les matchs pour analyse
  console.log('DEBUG COMPETITION ID:', id);
  console.log('DEBUG TOURNAMENTS UPCOMING:', upcomingMatches.map(m => m.Tournament));
  console.log('DEBUG TOURNAMENTS RECENT:', recentMatches.map(m => m.Tournament));

  const normalizedId = normalizeAndSortWords(id);

  // Pour les résultats récents, on ne garde qu'un seul résultat final par rencontre (même équipes, même date)
  function deduplicateMatches(matches: LeagueMatch[]): LeagueMatch[] {
    const seen = new Set<string>();
    return matches.filter((m) => {
      // On normalise noms et date (jour seulement)
      const key = [
        [m.Team1?.toLowerCase().trim(), m.Team2?.toLowerCase().trim()].sort().join("-"),
        new Date(m.DateTime).toISOString().slice(0, 10)
      ].join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Filtre uniquement les résultats finaux pour les résultats récents
  let filteredRecent = recentMatches.filter(
    m => normalizeAndSortWords(m.Tournament) === normalizedId && m.Winner && m.Team1Score !== undefined && m.Team2Score !== undefined
  );
  filteredRecent = deduplicateMatches(filteredRecent);

  // Correction : un match est "à venir" ou "en direct" UNIQUEMENT s'il n'a pas Winner ET scores non complets
  const filteredUpcoming = upcomingMatches.filter(
    m => normalizeAndSortWords(m.Tournament) === normalizedId && (!m.Winner && (m.Team1Score === undefined || m.Team2Score === undefined || m.Team1Score === 0 && m.Team2Score === 0))
  );

  console.log("Competition ID:", id);
  console.log("Upcoming matches:", upcomingMatches);
  console.log("Recent matches:", recentMatches);

  // Trouver dynamiquement la date du premier match réel dans le calendrier
  // Si la date de début officielle existe et il y a des matchs ce jour-là, on l'utilise en priorité
  const [tournamentStartDate, setTournamentStartDate] = useState<string | null>(null);
  useEffect(() => {
    async function fetchTournamentStart() {
      if (!id) return;
      try {
        const year = new Date().getFullYear().toString();
        const res = await fetch(`/api/tournaments?year=${year}`);
        const allTournaments = await res.json();
        const found = allTournaments.find((t: any) => t.Name === id);
        if (found && found.DateStart) {
          setTournamentStartDate(found.DateStart);
        }
      } catch (e) {
        setTournamentStartDate(null);
      }
    }
    fetchTournamentStart();
  }, [id]);

  let effectiveFirstMatchDate = null;
  let matchesOnFirstDay: any[] = [];
  if (tournamentStartDate) {
    // Y a-t-il des matchs à la date de début officielle ?
    matchesOnFirstDay = fullSchedule.filter(m => m.DateTime && m.DateTime.slice(0, 10) === tournamentStartDate.slice(0, 10));
    if (matchesOnFirstDay.length > 0) {
      effectiveFirstMatchDate = tournamentStartDate.slice(0, 10);
    } else {
      // Sinon, fallback sur la date la plus ancienne trouvée dans le calendrier
      effectiveFirstMatchDate = fullSchedule.length > 0 ? fullSchedule.map(m => m.DateTime && m.DateTime.slice(0, 10)).filter(Boolean).sort()[0] : null;
      matchesOnFirstDay = effectiveFirstMatchDate ? fullSchedule.filter(m => m.DateTime && m.DateTime.slice(0, 10) === effectiveFirstMatchDate) : [];
    }
  } else {
    effectiveFirstMatchDate = fullSchedule.length > 0 ? fullSchedule.map(m => m.DateTime && m.DateTime.slice(0, 10)).filter(Boolean).sort()[0] : null;
    matchesOnFirstDay = effectiveFirstMatchDate ? fullSchedule.filter(m => m.DateTime && m.DateTime.slice(0, 10) === effectiveFirstMatchDate) : [];
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <div className="mb-6">
          <Link to="/competitions">
            <Button variant="ghost" size="sm" className="mb-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour aux compétitions
            </Button>
          </Link>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-dark-800 flex items-center justify-center">
                    {competitionLogo ? (
                      <img
                        src={competitionLogo}
                        alt={`Logo ${id}`}
                        className="w-12 h-12 object-contain"
                        onError={e => (e.currentTarget.src = '/placeholder.svg')}
                      />
                    ) : (
                      <Trophy className="w-8 h-8 text-esport-500" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{id}</CardTitle>
                    <div className="text-sm text-gray-400 mt-1">League of Legends</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CalendarClock className="w-4 h-4" />
                  <span>Saison 2025</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Stats de la compétition */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-gray-400">Équipes</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">€250,000</div>
                    <div className="text-sm text-gray-400">Prize Pool</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">182</div>
                    <div className="text-sm text-gray-400">Matchs joués</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">4.2M</div>
                    <div className="text-sm text-gray-400">Spectateurs</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Section des matchs */}
        <div className="space-y-6">
          {/* Matchs en direct et à venir */}
          <div>
            <h2 className="text-xl font-bold mb-4">Matchs à venir</h2>
            <div className="grid gap-3">
              {upcomingLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Card key={`skeleton-upcoming-${i}`}>
                    <CardContent className="p-4">
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : filteredUpcoming && filteredUpcoming.length > 0 ? (
                filteredUpcoming.map(match => (
                  <MatchCard key={`${match.Team1}-${match.Team2}-${match.DateTime}`} {...convertMatchToProps(match)} />
                ))
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Aucun match à venir trouvé pour cette compétition
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          
          {/* Résultats récents */}
          <div>
            <h2 className="text-xl font-bold mb-4">Résultats récents</h2>
            <div className="grid gap-3">
              {recentLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Card key={`skeleton-recent-${i}`}>
                    <CardContent className="p-4">
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : filteredRecent && filteredRecent.length > 0 ? (
                filteredRecent.map(match => (
                  <MatchCard key={`${match.Team1}-${match.Team2}-${match.DateTime}`} {...convertMatchToProps(match)} />
                ))
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Aucun résultat récent trouvé pour cette compétition
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
