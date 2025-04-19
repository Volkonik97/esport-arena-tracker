
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
import { useEffect } from "react";

export default function CompetitionDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  
  // Directement passer l'ID du tournoi aux hooks pour filtrer à la source des données
  const { data: upcomingMatches = [], isLoading: upcomingLoading, error: upcomingError } = useUpcomingMatches(10, id);
  const { data: recentMatches = [], isLoading: recentLoading, error: recentError } = useRecentResults(10, id);

  // Afficher un message d'erreur si les deux requêtes ont échoué
  useEffect(() => {
    if (upcomingError && recentError) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de charger les données des matchs.",
        variant: "destructive",
      });
    }
  }, [upcomingError, recentError, toast]);

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

  console.log("Competition ID:", id);
  console.log("Upcoming matches:", upcomingMatches);
  console.log("Recent matches:", recentMatches);

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
                    <Trophy className="w-8 h-8 text-esport-500" />
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
              ) : upcomingMatches && upcomingMatches.length > 0 ? (
                upcomingMatches.map(match => (
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
              ) : recentMatches && recentMatches.length > 0 ? (
                recentMatches.map(match => (
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
