import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Competitions from "./pages/Competitions";
import Teams from "./pages/Teams";
import Matches from "./pages/Matches";
import Players from "./pages/Players";
import CompetitionDetails from "./pages/CompetitionDetails";
import TeamDetails from "./pages/TeamDetails";
import PlayerDetails from "./pages/PlayerDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/competitions/:id" element={<CompetitionDetails />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamDetails />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:id" element={<PlayerDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
