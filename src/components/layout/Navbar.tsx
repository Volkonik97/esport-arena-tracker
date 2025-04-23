import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Accueil", path: "/" },
  { name: "Compétitions", path: "/competitions" },
  { name: "Équipes", path: "/teams" },
  { name: "Matchs", path: "/matches" },
  { name: "Joueurs", path: "/players" },
];

const gameLinks = [
  { name: "League of Legends", path: "/lol" },
  { name: "Valorant", path: "/valorant" },
  { name: "CS2", path: "/cs2" },
  { name: "Dota 2", path: "/dota2" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="bg-dark-950 border-b border-dark-700 z-50 sticky top-0">
      <div className="container mx-auto px-4 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            className="font-heading text-2xl font-bold tracking-tight text-white"
          >
            <span className="text-esport-500">E</span>sport
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:flex items-center space-x-2">
            {gameLinks.map((game) => (
              <Link
                key={game.name}
                to={game.path}
                className="text-xs px-3 py-1 rounded-full bg-dark-800 hover:bg-dark-700 text-gray-300 transition-colors"
              >
                {game.name}
              </Link>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      <div className={cn(
        "md:hidden bg-dark-900 pb-4 px-4",
        mobileMenuOpen ? "block animate-fade-in" : "hidden"
      )}>
        <div className="pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-dark-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        <div className="pt-2 border-t border-dark-700">
          <p className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Jeux</p>
          <div className="grid grid-cols-2 gap-2 pt-2">
            {gameLinks.map((game) => (
              <Link
                key={game.name}
                to={game.path}
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-800 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {game.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
