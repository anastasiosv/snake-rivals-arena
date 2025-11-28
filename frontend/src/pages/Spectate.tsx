import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockBackendAPI } from '@/lib/services/mockBackend';
import { LiveGame, GameState } from '@/lib/types/game';
import { motion } from 'framer-motion';
import { GameBoard } from '@/components/game/GameBoard';
import { BotPlayer } from '@/lib/game/botPlayer';

export default function Spectate() {
  const navigate = useNavigate();
  const [liveGames, setLiveGames] = useState<LiveGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<LiveGame | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [bot, setBot] = useState<BotPlayer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLiveGames();
  }, []);

  useEffect(() => {
    if (selectedGame && !bot) {
      const newBot = new BotPlayer(selectedGame.mode);
      setBot(newBot);
      newBot.start((state) => {
        setGameState(state);
      }, 150);
    }

    return () => {
      if (bot) {
        bot.stop();
      }
    };
  }, [selectedGame]);

  const loadLiveGames = async () => {
    setIsLoading(true);
    const games = await mockBackendAPI.spectate.getLiveGames();
    setLiveGames(games);
    setIsLoading(false);
  };

  const handleWatch = (game: LiveGame) => {
    if (bot) {
      bot.stop();
    }
    setSelectedGame(game);
    setBot(null);
    setGameState(null);
  };

  const handleBackToList = () => {
    if (bot) {
      bot.stop();
    }
    setSelectedGame(null);
    setBot(null);
    setGameState(null);
  };

  if (selectedGame && gameState) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToList}
              className="text-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Live Games
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-2 border-border shadow-neon-strong bg-card/80 backdrop-blur-sm mb-6">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-display flex items-center space-x-2">
                      <Eye className="w-6 h-6 text-neon-cyan" />
                      <span>Watching {selectedGame.player.username}</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedGame.mode === 'pass-through' ? 'Pass-Through' : 'Walls'} Mode
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-display font-bold text-primary">{gameState.score}</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 flex justify-center">
                <GameBoard gameState={gameState} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-2 border-border shadow-neon-strong bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center border-b border-border">
              <div className="w-16 h-16 bg-neon-cyan rounded-lg flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_hsl(var(--neon-cyan)_/_0.4)]">
                <Eye className="w-8 h-8 text-background" />
              </div>
              <CardTitle className="text-4xl font-display">Live Games</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground">Loading...</div>
              ) : liveGames.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No live games at the moment
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {liveGames.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 flex items-center space-x-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-display font-semibold text-foreground">
                            {game.player.username}
                          </h3>
                          <span className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded-full font-medium">
                            {game.mode === 'pass-through' ? 'Pass-Through' : 'Walls'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-muted-foreground">
                            Score: <span className="text-primary font-semibold">{game.currentScore}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <Eye className="w-3 h-3 inline mr-1" />
                            {game.spectators} watching
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleWatch(game)}
                        className="bg-neon-cyan text-background hover:bg-neon-cyan/90 shadow-[0_0_15px_hsl(var(--neon-cyan)_/_0.4)]"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Watch
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
