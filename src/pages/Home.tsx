
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { MatchCard, MatchTeam } from "@/components/ui/match-card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { TeamCard } from "@/components/ui/team-card";
import { CompetitionCard } from "@/components/ui/competition-card";
import { Link } from "react-router-dom";
import { useRecentResults, useUpcomingMatches } from "@/hooks/useLeagueMatches";

const popularTeams = [
  {
    id: "team1",
    name: "G2 Esports",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/34/G2_Esports_logo.svg/1200px-G2_Esports_logo.svg.png",
    country: "Europe",
    game: "League of Legends",
  },
  {
    id: "team2",
    name: "T1",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/T1_logo.svg/1200px-T1_logo.svg.png",
    country: "South Korea",
    game: "League of Legends",
  },
  {
    id: "team3",
    name: "JD Gaming",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/JD_Gaming_logo.svg/1200px-JD_Gaming_logo.svg.png",
    country: "China",
    game: "League of Legends",
  },
  {
    id: "team4",
    name: "Gen.G",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/Gen.G_Esports_logo.svg/1200px-Gen.G_Esports_logo.svg.png",
    country: "South Korea",
    game: "League of Legends",
  },
];

const featuredCompetitions = [
  {
    id: "comp1",
    name: "LEC Spring 2025",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/LEC_2023_Logo.svg/2560px-LEC_2023_Logo.svg.png",
    game: "League of Legends",
    startDate: "2025-01-10",
    endDate: "2025-05-20",
    status: "ongoing" as const,
    prize: "€250,000",
  },
  {
    id: "comp2",
    name: "LCK Spring 2025",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/LCK_2023_Logo.svg/2560px-LCK_2023_Logo.svg.png",
    game: "League of Legends",
    startDate: "2025-03-01",
    endDate: "2025-06-15",
    status: "ongoing" as const,
    prize: "₩400,000,000",
  },
  {
    id: "comp3",
    name: "LPL Spring 2025",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/LPL_2023_Logo.svg/2560px-LPL_2023_Logo.svg.png",
    game: "League of Legends",
    startDate: "2025-01-15",
    endDate: "2025-05-28",
    status: "upcoming" as const,
    prize: "¥2,000,000",
  },
];

function useSpoiler(defaultValue = true) {
  const [spoiler, setSpoiler] = useState(defaultValue);
  const toggleSpoiler = () => setSpoiler(v => !v);
  return [spoiler, toggleSpoiler] as const;
}

export default function Home() {
  useEffect(() => {
    console.log('HOME COMPONENT MOUNTED');
  }, []);

  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'recent'>('live');
  const [spoiler, toggleSpoiler] = useSpoiler(true);
  const { data: upcomingMatches = [], isLoading: upcomingLoading } = useUpcomingMatches(50);
  const { data: recentMatches = [], isLoading: recentLoading } = useRecentResults(50);

  console.log('DEBUG RECENT MATCHES RAW:', recentMatches);

  const generateMatchId = (match: any, index: number): string => {
    return `${match.Team1}-${match.Team2}-${match.DateTime?.substring(0, 10) || ''}-${index}`;
  };

  const AUTO_LIVE_LEAGUES = [
    'LEC',
    'LFL',
    'LTA North',
    'LPL'
  ];

  const getLeagueFromTournament = (tournament: string) => {
    if (!tournament) return '';
    if (tournament.includes('LEC')) return 'LEC';
    if (tournament.includes('LFL')) return 'LFL';
    if (tournament.includes('LTA North')) return 'LTA North';
    if (tournament.includes('LPL')) return 'LPL';
    return '';
  };

  // Define MATCH_DURATION_MINUTES as a number
  const MATCH_DURATION_MINUTES: number = 120;

  const liveMatchesBase = upcomingMatches.filter(match => {
    const matchDateStr = match.DateTime || match.DateTime_UTC || '';
    if (!matchDateStr) return false;
    
    try {
      const matchDate = new Date(matchDateStr);
      if (isNaN(matchDate.getTime())) return false;
      
      const now = new Date();
      // Calculate duration in milliseconds using safe numeric conversion
      const durationMs = Number(MATCH_DURATION_MINUTES) * 60 * 1000;
      // Ensure we're dealing with numeric values for the date calculation
      const matchEndTime = matchDate.getTime() + durationMs;
      const matchEnd = new Date(matchEndTime);
      
      return now >= matchDate && now <= matchEnd;
    } catch (error) {
      console.error('Error parsing date:', matchDateStr, error);
      return false;
    }
  });

  const extraLiveMatches: any[] = [];
  AUTO_LIVE_LEAGUES.forEach(league => {
    const upcoming = upcomingMatches.filter(m => getLeagueFromTournament(m.Tournament).toLowerCase() === league.toLowerCase());
    if (!upcoming.length) return;
    const finished = recentMatches.filter(m => getLeagueFromTournament(m.Tournament).toLowerCase() === league.toLowerCase() && m.Winner);
    if (!finished.length) return;
    const sortByDate = (a: any, b: any) => new Date(a.DateTime) - new Date(b.DateTime);
    upcoming.sort(sortByDate);
    finished.sort(sortByDate);
    const lastFinished = finished[finished.length - 1];
    const nextUpcoming = upcoming[0];
    const dateNext = new Date(nextUpcoming.DateTime);
    const dateLastFinished = new Date(lastFinished.DateTime);
    const sameDay = dateNext.getFullYear() === dateLastFinished.getFullYear() && dateNext.getMonth() === dateLastFinished.getMonth() && dateNext.getDate() === dateLastFinished.getDate();
    if (lastFinished && nextUpcoming && dateLastFinished < dateNext && sameDay) {
      const alreadyLive = liveMatchesBase.some(m => getLeagueFromTournament(m.Tournament).toLowerCase() === league.toLowerCase());
      if (!alreadyLive) {
        extraLiveMatches.push(nextUpcoming);
      }
    }
  });

  const liveMatches = [...liveMatchesBase, ...extraLiveMatches.filter(m => !liveMatchesBase.includes(m))];

  const liveMatchIds = new Set(liveMatches.map(m => generateMatchId(m, 0)));
  const upcomingMatchesFiltered = upcomingMatches.filter((m, i) => !liveMatchIds.has(generateMatchId(m, i)));

  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const upcomingMatches24h = upcomingMatchesFiltered.filter(match => {
    const matchDateStr = match.DateTime || match.DateTime_UTC || '';
    if (!matchDateStr) return false;
    
    try {
      const matchDate = new Date(matchDateStr);
      if (isNaN(matchDate.getTime())) return false;
      
      return matchDate > now && matchDate <= in24h;
    } catch (error) {
      console.error('Error parsing date:', matchDateStr, error);
      return false;
    }
  });

  const convertMatchToProps = (match: any, index: number) => {
    let matchStatus: "upcoming" | "live" | "finished";
    if (match.Winner) {
      matchStatus = "finished";
    } else if (liveMatches.some(liveMatch => 
      liveMatch.Team1 === match.Team1 && 
      liveMatch.Team2 === match.Team2 && 
      liveMatch.DateTime === match.DateTime
    )) {
      matchStatus = "live";
    } else {
      matchStatus = "upcoming";
    }

    if (matchStatus === 'live') {
      console.log('MATCH LIVE:', match);
      recentMatches.forEach(m => {
        const teamsLive = [match.Team1?.toLowerCase(), match.Team2?.toLowerCase()].sort();
        const teamsFinished = [m.Team1?.toLowerCase(), m.Team2?.toLowerCase()].sort();
        const dateLive = new Date(match.DateTime);
        const dateFinished = new Date(m.DateTime);
        const sameDay = dateLive.getFullYear() === dateFinished.getFullYear() && dateLive.getMonth() === dateFinished.getMonth() && dateLive.getDate() === dateFinished.getDate();
        if (
          JSON.stringify(teamsLive) === JSON.stringify(teamsFinished) &&
          m.Tournament?.toLowerCase() === match.Tournament?.toLowerCase() &&
          m.BestOf === match.BestOf &&
          sameDay
        ) {
          console.log('POTENTIAL FINISHED MATCH (FULL):', m);
        }
      });
    }

    let hasOfficialScore = false;
    let team1Score = match.Team1Score;
    let team2Score = match.Team2Score;

    if (matchStatus === 'upcoming') {
      team1Score = 0;
      team2Score = 0;
    }

    if (matchStatus === 'live') {
      const dateLive = new Date(match.DateTime);
      console.log('DEBUG LIVE: looking for match', {
        team1: match.Team1, team2: match.Team2, date: match.DateTime, tournoi: match.Tournament, BO: match.BestOf, recentMatches
      });
      const finished = recentMatches.find(
        m => {
          const teamsLive = [match.Team1?.toLowerCase().trim(), match.Team2?.toLowerCase().trim()].sort();
          const teamsFinished = [m.Team1?.toLowerCase().trim(), m.Team2?.toLowerCase().trim()].sort();
          const dateFinished = new Date(m.DateTime || m["DateTime UTC"]);
          const sameDay = dateLive.getFullYear() === dateFinished.getFullYear() && dateLive.getMonth() === dateFinished.getMonth() && dateLive.getDate() === dateFinished.getDate();
          const matchDebug = {
            teamsLive, teamsFinished,
            tournoiLive: match.Tournament?.toLowerCase().trim(), tournoiFinished: m.Tournament?.toLowerCase().trim(),
            bestOfLive: match.BestOf, bestOfFinished: m.BestOf,
            sameDay,
            dateLive: match.DateTime,
            dateFinished: m.DateTime || m["DateTime UTC"]
          };
          if (
            JSON.stringify(teamsLive) === JSON.stringify(teamsFinished)
            && m.Tournament?.toLowerCase().trim() === match.Tournament?.toLowerCase().trim()
            && sameDay
            && (
              m.BestOf == null || match.BestOf == null || m.BestOf == match.BestOf
            )
          ) {
            console.log('DEBUG LIVE: MATCH FOUND', matchDebug);
            return true;
          } else {
            console.log('DEBUG LIVE: NO MATCH', matchDebug);
            return false;
          }
        }
      );
      if (finished) {
        hasOfficialScore = true;
        const getScore = (teamName: string) => {
          if (finished.Team1?.toLowerCase().trim() === teamName.toLowerCase().trim()) return Number(finished.Team1Score);
          if (finished.Team2?.toLowerCase().trim() === teamName.toLowerCase().trim()) return Number(finished.Team2Score);
          return undefined;
        };
        team1Score = getScore(match.Team1);
        team2Score = getScore(match.Team2);
      } else {
        team1Score = 0;
        team2Score = 0;
      }
    }

    if (matchStatus === 'upcoming' && !hasOfficialScore) {
      team1Score = 0;
      team2Score = 0;
    }

    return {
      id: generateMatchId(match, index),
      teams: [
        { 
          id: match.Team1,
          name: match.Team1,
          logo: `/placeholder.svg`,
          score: team1Score
        },
        {
          id: match.Team2,
          name: match.Team2,
          logo: `/placeholder.svg`,
          score: team2Score
        }
      ] as [MatchTeam, MatchTeam],
      competition: {
        id: match.Tournament || "Unknown",
        name: match.Tournament || "Unknown",
      },
      date: match.DateTime,
      status: matchStatus
    };
  };

  console.log("Current matches data:", {
    upcoming: upcomingMatches,
    recent: recentMatches,
    live: liveMatches
  });

  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const displayedUpcomingMatches = showAllUpcoming ? upcomingMatches24h : upcomingMatches24h.slice(0, 5);

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <section className="relative rounded-xl overflow-hidden h-64 md:h-80 mb-10">
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 to-dark-900/30 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1920" 
            alt="Esport Arena" 
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-xl">
              Suivez toutes les compétitions <span className="text-esport-500">esport</span> en direct
            </h1>
            <p className="text-gray-300 mt-3 max-w-lg">
              Matchs, équipes, résultats et classements pour tous vos jeux préférés
            </p>
          </div>
        </section>
        
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Matchs</h2>
            <Link to="/matches">
              <Button variant="link" className="text-esport-400">
                Voir tous les matchs <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant={activeTab === 'live' ? "default" : "outline"}
              onClick={() => setActiveTab('live')}
            >
              En direct
            </Button>
            <Button
              variant={activeTab === 'upcoming' ? "default" : "outline"}
              onClick={() => setActiveTab('upcoming')}
            >
              À venir
            </Button>
            <Button
              variant={activeTab === 'recent' ? "default" : "outline"}
              onClick={() => setActiveTab('recent')}
            >
              Récents
            </Button>
            <label className="ml-4 flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={spoiler} onChange={toggleSpoiler} className="accent-esport-400" />
              <span className="text-sm">Spoiler</span>
            </label>
          </div>
          
          <div className="grid gap-3">
            {activeTab === 'live' && liveMatches.length > 0 && liveMatches.map((match, index) => (
              <MatchCard
                key={`live-${generateMatchId(match, index)}`}
                {...convertMatchToProps(match, index)}
                spoiler={spoiler}
              />
            ))}
            
            {activeTab === 'upcoming' && !upcomingLoading && displayedUpcomingMatches
              .map((match, index) => (
                <MatchCard
                  key={`upcoming-${generateMatchId(match, index)}`}
                  {...convertMatchToProps(match, index)}
                  spoiler={spoiler}
                />
              ))}
            {activeTab === 'upcoming' && !upcomingLoading && upcomingMatches24h.length > 5 && (
              <div className="flex justify-center my-4">
                <button
                  className={`
                    transition-all duration-150
                    px-4 py-1.5
                    bg-gradient-to-r from-blue-500 to-indigo-600
                    text-white shadow-lg
                    rounded-full
                    font-medium tracking-wide
                    hover:from-indigo-600 hover:to-blue-500
                    hover:scale-105
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
                    text-sm
                  `}
                  onClick={() => setShowAllUpcoming(v => !v)}
                >
                  {showAllUpcoming ? (
                    <>
                      <span className="inline-block align-middle mr-2">▲</span>Afficher moins
                    </>
                  ) : (
                    <>
                      <span className="inline-block align-middle mr-2">▼</span>Afficher plus ({upcomingMatches24h.length - 5})
                    </>
                  )}
                </button>
              </div>
            )}
            
            {activeTab === 'recent' && !recentLoading && recentMatches.length > 0 && recentMatches
              .filter((match, idx, arr) => {
                const teams = [match.Team1?.toLowerCase(), match.Team2?.toLowerCase()].sort();
                const date = new Date(match.DateTime);
                return arr.findIndex(m2 => {
                  const teams2 = [m2.Team1?.toLowerCase(), m2.Team2?.toLowerCase()].sort();
                  const date2 = new Date(m2.DateTime);
                  return JSON.stringify(teams) === JSON.stringify(teams2)
                    && m2.Tournament?.toLowerCase() === match.Tournament?.toLowerCase()
                    && m2.BestOf === match.BestOf
                    && date.getFullYear() === date2.getFullYear()
                    && date.getMonth() === date2.getMonth()
                    && date.getDate() === date2.getDate();
                }) === idx;
              })
              .filter(match => match.Winner)
              .slice(0, 5)
              .map((match, index) => {
                return (
                  <MatchCard
                    key={`recent-${generateMatchId(match, index)}`}
                    {...convertMatchToProps(match, index)}
                    spoiler={spoiler}
                  />
                );
              })
            }
            
            {activeTab === 'live' && liveMatches.length === 0 && !upcomingLoading && (
              <div className="text-center py-8 text-gray-400">
                <p>Aucun match en direct actuellement</p>
              </div>
            )}
            
            {activeTab === 'upcoming' && upcomingMatches24h.length === 0 && !upcomingLoading && (
              <div className="text-center py-8 text-gray-400">
                <p>Aucun match à venir</p>
              </div>
            )}
            
            {activeTab === 'recent' && recentMatches.length === 0 && !recentLoading && (
              <div className="text-center py-8 text-gray-400">
                <p>Aucun résultat récent</p>
              </div>
            )}
            
            {((activeTab === 'upcoming' && upcomingLoading) || 
              (activeTab === 'recent' && recentLoading) || 
              (activeTab === 'live' && upcomingLoading)) && (
              <div className="text-center py-8 text-gray-400">
                <p>Chargement des matchs...</p>
              </div>
            )}
          </div>
        </section>
        
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Équipes Populaires</h2>
            <Link to="/teams">
              <Button variant="link" className="text-esport-400">
                Voir toutes les équipes <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularTeams.map(team => (
              <TeamCard key={team.id} {...team} />
            ))}
          </div>
        </section>
        
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Compétitions</h2>
            <Link to="/competitions">
              <Button variant="link" className="text-esport-400">
                Voir toutes les compétitions <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCompetitions.map(competition => (
              <CompetitionCard key={competition.id} {...competition} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
