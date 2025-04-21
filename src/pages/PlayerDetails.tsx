
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { PlayerStats } from "@/components/player/PlayerStats";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlayerDetails() {
  const { id } = useParams();

  const { data: player, isLoading } = useQuery({
    queryKey: ['player', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*, team:teamid (teamname, logo)')
        .eq('playerid', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="grid gap-6">
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!player) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Joueur non trouvé</h1>
          <p>Le joueur que vous recherchez n'existe pas.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-start gap-8 mb-8">
          <div className="shrink-0">
            {player.image ? (
              <img 
                src={player.image} 
                alt={player.playername} 
                className="w-32 h-32 rounded-full object-cover border-4 border-dark-700"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-dark-700 flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-400">{player.playername[0]}</span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{player.playername}</h1>
            {player.team && (
              <div className="flex items-center gap-2 mb-4">
                <img src={player.team.logo} alt={player.team.teamname} className="w-6 h-6 object-contain" />
                <span className="text-lg text-gray-300">{player.team.teamname}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-esport-900/50 text-esport-400 rounded-full text-sm uppercase">
                {player.position}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PlayerStats player={player} />
        </div>
      </div>
    </Layout>
  );
}
