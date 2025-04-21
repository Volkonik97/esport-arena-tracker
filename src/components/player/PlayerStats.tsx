
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlayerStatsProps {
  player: any; // We'll improve this type later
}

export function PlayerStats({ player }: PlayerStatsProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Statistiques Générales</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <StatItem label="KDA" value={player.kda?.toFixed(2) || "N/A"} />
          <StatItem label="CS/min" value={player.cspm?.toFixed(2) || "N/A"} />
          <StatItem label="Dégâts/min" value={player.dpm?.toFixed(2) || "N/A"} />
          <StatItem 
            label="Part des dégâts" 
            value={player.damage_share ? `${(player.damage_share * 100).toFixed(1)}%` : "N/A"} 
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques Early Game</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <StatItem 
            label="Diff. CS @15" 
            value={player.avg_csdiffat15?.toFixed(1) || "N/A"}
            isPositive={player.avg_csdiffat15 > 0}
          />
          <StatItem 
            label="Diff. Or @15" 
            value={player.avg_golddiffat15?.toFixed(0) || "N/A"}
            isPositive={player.avg_golddiffat15 > 0}
          />
          <StatItem 
            label="Vision/min" 
            value={player.vspm?.toFixed(2) || "N/A"}
          />
          <StatItem 
            label="Part de l'or" 
            value={player.earned_gold_share ? `${(player.earned_gold_share * 100).toFixed(1)}%` : "N/A"}
          />
        </CardContent>
      </Card>
    </>
  );
}

interface StatItemProps {
  label: string;
  value: string | number;
  isPositive?: boolean;
}

function StatItem({ label, value, isPositive }: StatItemProps) {
  const getValueColor = () => {
    if (isPositive === undefined) return "text-gray-100";
    return isPositive ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-lg font-semibold ${getValueColor()}`}>{value}</span>
    </div>
  );
}
