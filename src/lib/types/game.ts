export type GameMode = 'pass-through' | 'walls';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
}

export interface SnakeSegment extends Position {}

export interface GameState {
  snake: SnakeSegment[];
  direction: Direction;
  food: Position;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  mode: GameMode;
}

export interface Player {
  id: string;
  username: string;
  score: number;
  highScore: number;
  gamesPlayed: number;
  lastPlayed?: string;
}

export interface LeaderboardEntry {
  rank: number;
  player: Player;
  score: number;
  mode: GameMode;
  timestamp: string;
}

export interface LiveGame {
  id: string;
  player: Player;
  mode: GameMode;
  currentScore: number;
  startedAt: string;
  spectators: number;
}
