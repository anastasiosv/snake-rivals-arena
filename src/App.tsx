import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Auth from "./pages/Auth";
import Leaderboard from "./pages/Leaderboard";
import Spectate from "./pages/Spectate";
import NotFound from "./pages/NotFound";
import { Player } from "@/lib/types/game";
import { mockBackendAPI } from "@/lib/services/mockBackend";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    mockBackendAPI.auth.getCurrentUser().then(currentUser => {
      setUser(currentUser);
      setIsLoading(false);
    });
  }, []);

  const handleLogin = (newUser: Player) => {
    setUser(newUser);
  };

  const handleLogout = async () => {
    await mockBackendAPI.auth.logout();
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground font-display text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Header user={user} onLogout={handleLogout} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game" element={<Game />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/spectate" element={<Spectate />} />
              <Route
                path="/auth"
                element={user ? <Navigate to="/" replace /> : <Auth onLogin={handleLogin} />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
