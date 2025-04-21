
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { User, Shield, Trophy, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PlayerDetails() {
  const { id } = useParams();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* En-tête du joueur */}
        <div className="bg-dark-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-32 h-32 bg-dark-700 rounded-full flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Placeholder Player</h1>
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="w-5 h-5 text-esport-500" />
                    <span className="text-gray-300">Team Name</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">TOP</Badge>
                    <Badge variant="outline">France</Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-dark-700 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="text-lg font-bold text-white">84.2</span>
                  </div>
                  <span className="text-sm text-gray-400">Score général</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets de statistiques */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start bg-dark-800 p-0 h-12">
            <TabsTrigger value="overview" className="h-12">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="champions" className="h-12">Champions</TabsTrigger>
            <TabsTrigger value="matches" className="h-12">Matches</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Statistiques générales */}
              <Card className="bg-dark-800 border-dark-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-esport-500" />
                    Statistiques Générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <StatItem label="KDA" value="-" />
                  <StatItem label="CS/min" value="-" />
                  <StatItem label="Dégâts/min" value="-" />
                  <StatItem label="Part des dégâts" value="-" />
                </CardContent>
              </Card>

              {/* Early Game */}
              <Card className="bg-dark-800 border-dark-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-esport-500" />
                    Performance Early Game
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <StatItem label="Diff. CS @15" value="-" />
                  <StatItem label="Diff. Or @15" value="-" />
                  <StatItem label="Vision/min" value="-" />
                  <StatItem label="Part de l'or" value="-" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="champions">
            <div className="text-center py-12 text-gray-400">
              Données des champions à venir
            </div>
          </TabsContent>

          <TabsContent value="matches">
            <div className="text-center py-12 text-gray-400">
              Historique des matches à venir
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

interface StatItemProps {
  label: string;
  value: string | number;
  isPositive?: boolean;
}

function StatItem({ label, value, isPositive }: StatItemProps) {
  const getValueColor = () => {
    if (isPositive === undefined) return "text-white";
    return isPositive ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-lg font-semibold ${getValueColor()}`}>{value}</span>
    </div>
  );
}
