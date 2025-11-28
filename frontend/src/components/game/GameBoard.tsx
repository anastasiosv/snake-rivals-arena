import { useEffect, useRef } from 'react';
import { GameState } from '@/lib/types/game';
import { GRID_SIZE, CELL_SIZE } from '@/lib/game/constants';

interface GameBoardProps {
  gameState: GameState;
  className?: string;
}

export const GameBoard = ({ gameState, className = '' }: GameBoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'hsl(220 15% 15%)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'hsl(220 15% 20%)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = 'hsl(25 100% 50%)';
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'hsl(25 100% 50%)';
    ctx.fillRect(
      gameState.food.x * CELL_SIZE + 2,
      gameState.food.y * CELL_SIZE + 2,
      CELL_SIZE - 4,
      CELL_SIZE - 4
    );
    ctx.shadowBlur = 0;

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? 'hsl(145 100% 50%)' : 'hsl(145 80% 45%)';
      
      if (isHead) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'hsl(145 100% 50%)';
      }
      
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
      
      if (isHead) {
        ctx.shadowBlur = 0;
      }
    });
  }, [gameState]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="border-2 border-border rounded-lg shadow-neon-strong"
      />
      {gameState.isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="text-center">
            <h2 className="text-4xl font-display font-bold text-destructive mb-2">Game Over!</h2>
            <p className="text-2xl text-primary">Score: {gameState.score}</p>
          </div>
        </div>
      )}
      {gameState.isPaused && !gameState.isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <h2 className="text-4xl font-display font-bold text-secondary">Paused</h2>
        </div>
      )}
    </div>
  );
};
