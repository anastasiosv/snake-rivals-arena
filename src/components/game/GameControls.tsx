import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { GameMode } from '@/lib/types/game';

interface GameControlsProps {
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  mode: GameMode;
  onPause: () => void;
  onReset: () => void;
}

export const GameControls = ({ 
  isPaused, 
  isGameOver, 
  score, 
  mode, 
  onPause, 
  onReset 
}: GameControlsProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-medium">Score</span>
            <span className="text-3xl font-display font-bold text-primary">{score}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-medium">Mode</span>
            <span className="text-lg font-display font-semibold text-secondary capitalize">
              {mode === 'pass-through' ? 'Pass-Through' : 'Walls'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="lg"
          onClick={onPause}
          disabled={isGameOver}
          className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          {isPaused ? (
            <>
              <Play className="w-5 h-5 mr-2" />
              Resume
            </>
          ) : (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onReset}
          className="flex-1 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </Button>
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <h3 className="font-display font-semibold text-sm text-foreground mb-2">Controls</h3>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>↑ ↓ ← → Arrow keys to move</p>
          <p>Space to pause/resume</p>
        </div>
      </div>
    </div>
  );
};
