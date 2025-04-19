import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { TeamCard } from "@/components/ui/team-card";

const staticTeams = [
  {
    id: "team1",
    name: "G2 Esports",
    logo: "https://upload.wikimedia.org/wikipedia/en/3/34/G2_Esports_logo.svg",
    country: "Europe",
    game: "League of Legends"
  },
  {
    id: "team2",
    name: "Fnatic",
    logo: "https://upload.wikimedia.org/wikipedia/en/4/43/Fnatic_Logo.svg",
    country: "Europe",
    game: "League of Legends"
  },
  {
    id: "team3",
    name: "Team Liquid",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Team_Liquid_logo.svg",
    country: "United States",
    game: "League of Legends"
  },
  {
    id: "team4",
    name: "Cloud9",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Cloud9_logo.svg",
    country: "United States",
    game: "League of Legends"
  }
];

export default function Teams() {
  const [teams, setTeams] = useState<typeof staticTeams>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setTeams(staticTeams);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Teams</h1>
      {loading ? (
        <p>Loading teams...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <TeamCard key={team.id} {...team} />
          ))}
        </div>
      )}
    </Layout>
  );
}