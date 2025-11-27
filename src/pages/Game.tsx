import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GameBoard } from '@/components/game/GameBoard';
import { GameControls } from '@/components/game/GameControls';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { GameState, Direction, GameMode } from '@/lib/types/game';
import { createInitialGameState, moveSnake, togglePause, resetGame } from '@/lib/game/gameLogic';
import { GAME_SPEED } from '@/lib/game/constants';
import { mockBackendAPI } from '@/lib/services/mockBackend';
import { toast } from '@/hooks/use-toast';

export default function Game() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = (searchParams.get('mode') as GameMode) || 'walls';
  
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState(mode));
  const [gameLoop, setGameLoop] = useState<number | null>(null);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameState.isGameOver) return;

    const keyMap: Record<string, Direction> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    };

    if (event.key === ' ') {
      event.preventDefault();
      setGameState(prev => togglePause(prev));
    } else if (keyMap[event.key]) {
      event.preventDefault();
      setGameState(prev => moveSnake(prev, keyMap[event.key]));
    }
  }, [gameState.isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameState.isPaused || gameState.isGameOver) {
      if (gameLoop) {
        clearInterval(gameLoop);
        setGameLoop(null);
      }
      return;
    }

    const interval = window.setInterval(() => {
      setGameState(prev => moveSnake(prev));
    }, GAME_SPEED);

    setGameLoop(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isPaused, gameState.isGameOver]);

  useEffect(() => {
    if (gameState.isGameOver && gameState.score > 0) {
      mockBackendAPI.leaderboard.submitScore(gameState.score, mode)
        .then(result => {
          if (result.success) {
            toast({
              title: "Score Submitted!",
              description: `Your score of ${gameState.score} has been recorded.`,
            });
          }
        });
    }
  }, [gameState.isGameOver, gameState.score, mode]);

  const handlePause = () => {
    setGameState(prev => togglePause(prev));
  };

  const handleReset = () => {
    if (gameLoop) clearInterval(gameLoop);
    setGameState(resetGame(mode));
  };

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

        <div className="grid lg:grid-cols-[1fr,auto] gap-8 max-w-6xl mx-auto">
          <div className="flex flex-col items-center">
            <GameBoard gameState={gameState} className="mb-4" />
          </div>
          
          <div className="lg:w-80">
            <GameControls
              isPaused={gameState.isPaused}
              isGameOver={gameState.isGameOver}
              score={gameState.score}
              mode={gameState.mode}
              onPause={handlePause}
              onReset={handleReset}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
