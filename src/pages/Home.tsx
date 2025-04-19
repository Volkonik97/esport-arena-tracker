import { useState } from "react";
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

export default function Home() {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'recent'>('live');
  const { data: upcomingMatches = [], isLoading: upcomingLoading } = useUpcomingMatches(5);
  const { data: recentMatches = [], isLoading: recentLoading } = useRecentResults(5);
  
  const liveMatches = upcomingMatches.filter(match => {
    const matchDate = new Date(match.DateTime);
    const now = new Date();
    return matchDate <= now && matchDate >= new Date(now.getTime() - 3 * 60 * 60 * 1000); // 3 hours window
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

    return {
      id: generateMatchId(match, index),
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
          
          <div className="flex border-b border-dark-700 mb-6">
            <button 
              className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'live' ? 'border-esport-500 text-esport-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('live')}
            >
              En Direct
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'upcoming' ? 'border-esport-500 text-esport-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('upcoming')}
            >
              À Venir
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'recent' ? 'border-esport-500 text-esport-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('recent')}
            >
              Récents
            </button>
          </div>
          
          <div className="grid gap-3">
            {activeTab === 'live' && liveMatches.length > 0 && liveMatches.map((match, index) => (
              <MatchCard 
                key={`live-${generateMatchId(match, index)}`} 
                {...convertMatchToProps(match, index)} 
              />
            ))}
            
            {activeTab === 'upcoming' && !upcomingLoading && upcomingMatches
              .filter(match => !liveMatches.some(liveMatch => 
                liveMatch.Team1 === match.Team1 && 
                liveMatch.Team2 === match.Team2 && 
                liveMatch.DateTime === match.DateTime
              ))
              .map((match, index) => (
                <MatchCard 
                  key={`upcoming-${generateMatchId(match, index)}`} 
                  {...convertMatchToProps(match, index)} 
                />
              ))
            }
            
            {activeTab === 'recent' && !recentLoading && recentMatches.map((match, index) => (
              <MatchCard 
                key={`recent-${generateMatchId(match, index)}`} 
                {...convertMatchToProps(match, index)} 
              />
            ))}
            
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
