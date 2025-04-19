
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-dark-700 py-8 mt-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-xl font-bold text-white mb-4">
              <span className="text-esport-500">E</span>sport
            </h3>
            <p className="text-gray-400 text-sm max-w-xs">
              Suivez toutes les compétitions esport, les équipes, les joueurs et les résultats en temps réel.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/competitions" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Compétitions
                </Link>
              </li>
              <li>
                <Link to="/teams" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Équipes
                </Link>
              </li>
              <li>
                <Link to="/matches" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Matchs
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-4">Jeux</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/lol" className="text-gray-400 hover:text-white text-sm transition-colors">
                  League of Legends
                </Link>
              </li>
              <li>
                <Link to="/valorant" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Valorant
                </Link>
              </li>
              <li>
                <Link to="/cs2" className="text-gray-400 hover:text-white text-sm transition-colors">
                  CS2
                </Link>
              </li>
              <li>
                <Link to="/dota2" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Dota 2
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-dark-700 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Esport Tracker. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
