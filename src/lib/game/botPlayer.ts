import { GameState, Direction, Position } from '../types/game';
import { moveSnake, createInitialGameState } from './gameLogic';
import { DIRECTIONS, GRID_SIZE } from './constants';

// Simple AI that tries to move towards food while avoiding walls and itself
export class BotPlayer {
  private gameState: GameState;
  private moveInterval: number | null = null;

  constructor(mode: 'walls' | 'pass-through' = 'walls') {
    this.gameState = createInitialGameState(mode);
  }

  start(onUpdate: (state: GameState) => void, speed: number = 150): void {
    this.moveInterval = window.setInterval(() => {
      if (!this.gameState.isGameOver) {
        const nextDirection = this.calculateNextMove();
        this.gameState = moveSnake(this.gameState, nextDirection);
        onUpdate(this.gameState);
      } else {
        this.stop();
      }
    }, speed);
  }

  stop(): void {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }
  }

  reset(mode: 'walls' | 'pass-through'): void {
    this.stop();
    this.gameState = createInitialGameState(mode);
  }

  getState(): GameState {
    return this.gameState;
  }

  private calculateNextMove(): Direction {
    const head = this.gameState.snake[0];
    const food = this.gameState.food;
    const possibleMoves: Direction[] = ['up', 'down', 'left', 'right'];
    
    // Remove opposite direction
    const oppositeDir = this.getOppositeDirection(this.gameState.direction);
    const validMoves = possibleMoves.filter(dir => dir !== oppositeDir);
    
    // Score each move
    const scoredMoves = validMoves.map(direction => {
      const dirVector = DIRECTIONS[direction];
      const newHead: Position = {
        x: head.x + dirVector.x,
        y: head.y + dirVector.y,
      };
      
      // Handle pass-through
      if (this.gameState.mode === 'pass-through') {
        newHead.x = (newHead.x + GRID_SIZE) % GRID_SIZE;
        newHead.y = (newHead.y + GRID_SIZE) % GRID_SIZE;
      }
      
      let score = 0;
      
      // Avoid walls in walls mode
      if (this.gameState.mode === 'walls') {
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          score -= 1000;
        }
      }
      
      // Avoid self collision
      if (this.isPositionOnSnake(newHead)) {
        score -= 1000;
      }
      
      // Move towards food (Manhattan distance)
      const distanceToFood = Math.abs(newHead.x - food.x) + Math.abs(newHead.y - food.y);
      score -= distanceToFood;
      
      // Prefer continuing in the same general direction
      if (direction === this.gameState.direction) {
        score += 5;
      }
      
      return { direction, score };
    });
    
    // Choose best move
    scoredMoves.sort((a, b) => b.score - a.score);
    return scoredMoves[0].direction;
  }

  private isPositionOnSnake(pos: Position): boolean {
    return this.gameState.snake.some(segment => segment.x === pos.x && segment.y === pos.y);
  }

  private getOppositeDirection(dir: Direction): Direction {
    const opposites: Record<Direction, Direction> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left',
    };
    return opposites[dir];
  }
}
