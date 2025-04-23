import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, ChevronLeft, Trophy } from "lucide-react";
import { MatchCard, MatchTeam } from "@/components/ui/match-card";
import { Link } from "react-router-dom";
import { useRecentResults, LeagueMatch } from "@/hooks/useLeagueMatches";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLogo } from "@/hooks/useLogo";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUpcomingMatchesForTournament } from "@/services/upcoming-matches-service";
import { useActiveTournaments } from "@/services/active-tournaments-service";
import StandingsTable from "@/components/ui/standings-table";

export default function CompetitionDetails() {
  const { id } = useParams();
  const { toast } = useToast();

  console.log('[DEBUG useLogo id]', id);
  const { data: competitionLogo, isLoading: isLogoLoading } = useLogo('tournament', id ?? '');

  const { data: tournaments = [], isLoading: tournamentsLoading } = useActiveTournaments("2025");
  const flatTournaments = tournaments.map((t: any) => t.title ?? t);

  function normalize(str: string) {
    return str
      .toLowerCase()
      .replace(/season|split|playoffs|group stage|regular|bracket|finals|stage/gi, "")
      .replace(/[^a-z0-9]/g, "");
  }
  function findClosestOverviewPage(humanName: string, tournaments: {Name: string, OverviewPage: string}[]) {
    const target = normalize(humanName);
    let found = tournaments.find(t => normalize(t.Name) === target || normalize(t.OverviewPage) === target);
    if (found) return found.OverviewPage;
    found = tournaments.find(t => normalize(t.Name).includes(target) || normalize(t.OverviewPage).includes(target));
    if (found) return found.OverviewPage;
    found = tournaments.find(t => target.includes(normalize(t.Name)) || target.includes(normalize(t.OverviewPage)));
    if (found) return found.OverviewPage;
    return undefined;
  }
  const overviewPage = findClosestOverviewPage(id, flatTournaments);
  console.log('[DEBUG OVERVIEWPAGE UTILISÉ]', overviewPage);

  const {
    data: upcomingMatches = [],
    isLoading: upcomingLoading
  } = useUpcomingMatchesForTournament(overviewPage || "", new Date().toISOString().slice(0, 19).replace('T', ' '));
  const { data: recentMatches, isLoading: recentLoading } = useRecentResults(500, { tournamentFilter: id });

  const normalizedUpcoming = upcomingMatches.map(m => ({
    ...m,
    DateTime: m.DateTime_UTC || m.DateTime || new Date().toISOString().slice(0, 19).replace('T', ' '),
    Tournament: m.OverviewPage || m.Tournament,
    Team1Score: Number(m.Team1Score),
    Team2Score: Number(m.Team2Score)
  }));

  const fullSchedule = [...normalizedUpcoming, ...recentMatches].sort((a, b) => new Date(a.DateTime).getTime() - new Date(b.DateTime).getTime());

  console.log('DATES FULL SCHEDULE', fullSchedule.map(m => m.DateTime));

  console.log('DEBUG COMPETITION ID:', id);
  console.log('DEBUG TOURNAMENTS UPCOMING:', normalizedUpcoming.map(m => m.Tournament));
  console.log('DEBUG TOURNAMENT FIELD UPCOMING:', normalizedUpcoming.map(m => m.Tournament));
  console.log('DEBUG TOURNAMENTS RECENT:', recentMatches.map(m => m.Tournament));
  console.log('DEBUG TOURNAMENT FIELD RECENT:', recentMatches.map(m => m.Tournament));

  function normalizeAndSortWords(str?: string) {
    return (str || "")
      .toLowerCase()
      .replace(/[^a-z0-9 ]/gi, " ")
      .split(/\s+/)
      .filter(Boolean)
      .sort()
      .join(" ");
  }

  console.log('[DEBUG COMPETITION ID]', id);
  console.log('[DEBUG UPCOMING MATCHES]', normalizedUpcoming);
  console.log('[DEBUG RECENT MATCHES]', recentMatches);
  if (normalizedUpcoming.length > 0) {
    console.log('[DEBUG TOURNAMENT FIELD UPCOMING]', normalizedUpcoming.map(m => m.Tournament));
  }
  if (recentMatches.length > 0) {
    console.log('[DEBUG TOURNAMENT FIELD RECENT]', recentMatches.map(m => m.Tournament));
  }
  const normalizedId = normalizeAndSortWords(id);
  console.log('[DEBUG NORMALIZED ID]', normalizedId);

  console.log('[DEBUG OVERVIEWPAGE UTILISÉ]', overviewPage);
  console.log('[DEBUG STANDINGS PROP tournamentName]', normalizedId);
  console.log('[DEBUG TOURNAMENT FIELD UPCOMING]', normalizedUpcoming.map(m => m.Tournament));
  console.log('[DEBUG TOURNAMENT FIELD RECENT]', recentMatches.map(m => m.Tournament));

  function deduplicateMatches(matches: LeagueMatch[]): LeagueMatch[] {
    const seen = new Set<string>();
    return matches.filter((m) => {
      const key = [
        [m.Team1?.toLowerCase().trim(), m.Team2?.toLowerCase().trim()].sort().join("-"),
        new Date(m.DateTime).toISOString().slice(0, 10)
      ].join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  let filteredRecent = recentMatches.filter(
    m => normalizeAndSortWords(m.Tournament) === normalizedId && m.Winner && m.Team1Score !== undefined && m.Team2Score !== undefined
  );
  filteredRecent = deduplicateMatches(filteredRecent);

  const filteredUpcoming = normalizedUpcoming;

  console.log("Competition ID:", id);
  console.log("Upcoming matches:", normalizedUpcoming);
  console.log("Recent matches:", recentMatches);

  if (normalizedUpcoming.length === 0) {
    const nowIso = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const overviewUrl = `https://lol.fandom.com/api.php?action=cargoquery&tables=MatchSchedule&fields=MatchSchedule.OverviewPage&where=${encodeURIComponent(`MatchSchedule.DateTime_UTC >= '${nowIso}'`)}&limit=500&format=json&origin=*`;
    console.log('[DEBUG ALL OverviewPage URL]', overviewUrl);
  }

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
    matchesOnFirstDay = fullSchedule.filter(m => m.DateTime && m.DateTime.slice(0, 10) === tournamentStartDate.slice(0, 10));
    if (matchesOnFirstDay.length > 0) {
      effectiveFirstMatchDate = tournamentStartDate.slice(0, 10);
    } else {
      effectiveFirstMatchDate = fullSchedule.length > 0 ? fullSchedule.map(m => m.DateTime && m.DateTime.slice(0, 10)).filter(Boolean).sort()[0] : null;
      matchesOnFirstDay = effectiveFirstMatchDate ? fullSchedule.filter(m => m.DateTime && m.DateTime.slice(0, 10) === effectiveFirstMatchDate) : [];
    }
  } else {
    effectiveFirstMatchDate = fullSchedule.length > 0 ? fullSchedule.map(m => m.DateTime && m.DateTime.slice(0, 10)).filter(Boolean).sort()[0] : null;
    matchesOnFirstDay = effectiveFirstMatchDate ? fullSchedule.filter(m => m.DateTime && m.DateTime.slice(0, 10) === effectiveFirstMatchDate) : [];
  }

  const convertMatchToProps = (match: LeagueMatch) => {
    console.log('[CompetitionDetails] convertMatchToProps input:', match);
    const date = match.DateTime || match.DateTime_UTC || new Date().toISOString().slice(0, 19).replace('T', ' ');
    const team1 = match.Team1 || '';
    const team2 = match.Team2 || '';
    
    console.log('[ConvertMatchToProps] Match date:', date, 'for teams:', team1, team2);
    
    return {
      id: `${team1 || 'empty'}-${team2 || 'empty'}-${date || Math.random().toString(36).slice(2)}`,
      teams: [
        { 
          id: team1,
          name: team1,
          logo: `/placeholder.svg`,
          score: match.Team1Score
        },
        {
          id: team2,
          name: team2,
          logo: `/placeholder.svg`,
          score: match.Team2Score
        }
      ] as [MatchTeam, MatchTeam],
      competition: {
        id: match.Tournament || match.OverviewPage || '',
        name: match.Tournament || match.OverviewPage || '',
      },
      date,
      status: match.Winner ? "finished" as const : 
             (date && new Date(date) <= new Date() ? "live" as const : "upcoming" as const)
    };
  };

  useEffect(() => {
    console.log('[LOGO DEBUG][CompetitionDetails] tournament id:', id);
    console.log('[LOGO DEBUG][CompetitionDetails] logo from useLogo:', competitionLogo);
    const logoImg = document.querySelector('img[alt="Logo ' + id + '"]');
    if (logoImg) {
      console.log('[LOGO DEBUG][CompetitionDetails] logo src:', logoImg.getAttribute('src'));
    } else {
      console.log('[LOGO DEBUG][CompetitionDetails] logo img not found in DOM');
    }
  }, [id, toast, competitionLogo]);

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
        
        <div className="space-y-6">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">À venir</TabsTrigger>
              <TabsTrigger value="recent">Résultats</TabsTrigger>
              <TabsTrigger value="standings">Classement</TabsTrigger>
            </TabsList>
            <div className="mt-2">
              <TabsContent value="upcoming">
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
              </TabsContent>
              <TabsContent value="recent">
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
              </TabsContent>
              <TabsContent value="standings">
                <div id="standings-tab-content" className="py-4">
                  <StandingsTable tournamentName={normalizedId} overviewPageFromUpcoming={overviewPage} />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
