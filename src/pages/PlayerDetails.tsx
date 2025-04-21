
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { User, Shield, Trophy } from "lucide-react";

export default function PlayerDetails() {
  const { id } = useParams();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-dark-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 flex items-center space-x-6">
            <div className="w-32 h-32 bg-dark-700 rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-gray-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Placeholder Player</h1>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-esport-500" />
                <span className="text-gray-300">Team Name</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 p-6 bg-dark-900">
            <div className="bg-dark-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-esport-500" />
                Statistiques Générales
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">KDA</span>
                  <span className="font-bold text-white">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">CS/min</span>
                  <span className="font-bold text-white">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dégâts/min</span>
                  <span className="font-bold text-white">-</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-esport-500" />
                Performance Early Game
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Diff. CS @15</span>
                  <span className="font-bold text-white">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Diff. Or @15</span>
                  <span className="font-bold text-white">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vision/min</span>
                  <span className="font-bold text-white">-</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

