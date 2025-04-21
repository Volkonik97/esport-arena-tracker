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

// Ajout : Spoiler toggle
function useSpoiler(defaultValue = true) {
  const [spoiler, setSpoiler] = useState(defaultValue);
  const toggleSpoiler = () => setSpoiler(v => !v);
  return [spoiler, toggleSpoiler] as const;
}

export default function Home() {
  // Ajoute un log global pour vérifier que Home.tsx est bien exécuté
  useEffect(() => {
    console.log('HOME COMPONENT MOUNTED');
  }, []);

  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'recent'>('live');
  const [spoiler, toggleSpoiler] = useSpoiler(true); // Par défaut activé
  const { data: upcomingMatches = [], isLoading: upcomingLoading } = useUpcomingMatches(5);
  const { data: recentMatches = [], isLoading: recentLoading } = useRecentResults(15);
  
  // Ajout debug pour voir ce que renvoie recentMatches brut
  console.log('DEBUG RECENT MATCHES RAW:', recentMatches);
  
  // Même logique que Matches.tsx pour déterminer les matchs en direct (durée réelle, ex: 2h)
  const MATCH_DURATION_MINUTES = 120; // 2 heures
  const liveMatches = upcomingMatches.filter(match => {
    const matchDate = new Date(match.DateTime + (match.DateTime.match(/T|Z|\+/) ? '' : ' UTC'));
    const now = new Date();
    const matchEnd = new Date(matchDate.getTime() + MATCH_DURATION_MINUTES * 60 * 1000);
    return now >= matchDate && now <= matchEnd;
  });

  const generateMatchId = (match: any, index: number): string => {
    return `${match.Team1}-${match.Team2}-${match.DateTime?.substring(0, 10) || ''}-${index}`;
  };

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

    // DEBUG: Log pour comprendre le mismatch
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
    // Déterminer si le match a un premier score officiel (dans recentResults)
    let hasOfficialScore = false;
    let team1Score = match.Team1Score;
    let team2Score = match.Team2Score;
    // Correction : Pour un match à venir, il ne faut JAMAIS afficher les scores de la source, même s'ils sont non-nuls
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
          // On ne compare que l'année, le mois et le jour
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
        // Pas de score officiel trouvé pour ce live : afficher 0-0
        team1Score = 0;
        team2Score = 0;
      }
    }
    // Pour les matchs à venir, n'affiche un score que si un score officiel existe dans recentResults
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
            
            {activeTab === 'upcoming' && !upcomingLoading && upcomingMatches
              // On ne garde que les matchs dont la date de début est strictement dans le futur
              .filter(match => {
                const matchDate = new Date(match.DateTime + (match.DateTime.match(/T|Z|\+/) ? '' : ' UTC'));
                const now = new Date(); // Heure dynamique à chaque rendu
                return matchDate > now;
              })
              .filter(match => !liveMatches.some(liveMatch => 
                liveMatch.Team1 === match.Team1 && 
                liveMatch.Team2 === match.Team2 && 
                liveMatch.DateTime === match.DateTime
              ))
              .map((match, index) => (
                <MatchCard
                  key={`upcoming-${generateMatchId(match, index)}`}
                  {...convertMatchToProps(match, index)}
                  spoiler={spoiler}
                />
              ))
            }
            
            {activeTab === 'recent' && !recentLoading && recentMatches.length > 0 && recentMatches
              // Harmonisation Matches : filtrer les doublons récents (mêmes équipes, même jour, même tournoi, même BO)
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
              .filter(match => match.Winner) // Afficher seulement les matchs terminés
              .slice(0, 5) // Afficher les 5 plus récents après filtrage
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
            
            {activeTab === 'upcoming' && upcomingMatches.length === 0 && !upcomingLoading && (
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
