import { GameState, Position, Direction, GameMode } from '../types/game';
import { GRID_SIZE, INITIAL_SNAKE_LENGTH, DIRECTIONS, OPPOSITE_DIRECTIONS } from './constants';

export const createInitialGameState = (mode: GameMode = 'walls'): GameState => {
  const startX = Math.floor(GRID_SIZE / 2);
  const startY = Math.floor(GRID_SIZE / 2);
  
  const snake: Position[] = [];
  for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
    snake.push({ x: startX - i, y: startY });
  }

  return {
    snake,
    direction: 'right',
    food: generateFood(snake),
    score: 0,
    isGameOver: false,
    isPaused: false,
    mode,
  };
};

export const generateFood = (snake: Position[]): Position => {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (isPositionOnSnake(food, snake));
  return food;
};

export const isPositionOnSnake = (position: Position, snake: Position[]): boolean => {
  return snake.some(segment => segment.x === position.x && segment.y === position.y);
};

export const moveSnake = (state: GameState, newDirection?: Direction): GameState => {
  if (state.isGameOver || state.isPaused) return state;

  const direction = newDirection || state.direction;
  
  // Prevent moving in opposite direction
  if (newDirection && OPPOSITE_DIRECTIONS[state.direction] === newDirection) {
    return state;
  }

  const head = state.snake[0];
  const directionVector = DIRECTIONS[direction];
  
  let newHead: Position = {
    x: head.x + directionVector.x,
    y: head.y + directionVector.y,
  };

  // Handle walls vs pass-through mode
  if (state.mode === 'pass-through') {
    newHead = {
      x: (newHead.x + GRID_SIZE) % GRID_SIZE,
      y: (newHead.y + GRID_SIZE) % GRID_SIZE,
    };
  } else {
    // Check wall collision
    if (
      newHead.x < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y < 0 ||
      newHead.y >= GRID_SIZE
    ) {
      return { ...state, isGameOver: true };
    }
  }

  // Check self collision
  if (isPositionOnSnake(newHead, state.snake)) {
    return { ...state, isGameOver: true };
  }

  const newSnake = [newHead, ...state.snake];

  // Check if food is eaten
  if (newHead.x === state.food.x && newHead.y === state.food.y) {
    return {
      ...state,
      snake: newSnake,
      food: generateFood(newSnake),
      score: state.score + 10,
      direction,
    };
  }

  // Remove tail if food not eaten
  newSnake.pop();

  return {
    ...state,
    snake: newSnake,
    direction,
  };
};

export const changeDirection = (currentDirection: Direction, newDirection: Direction): Direction => {
  if (OPPOSITE_DIRECTIONS[currentDirection] === newDirection) {
    return currentDirection;
  }
  return newDirection;
};

export const togglePause = (state: GameState): GameState => {
  return { ...state, isPaused: !state.isPaused };
};

export const resetGame = (mode: GameMode): GameState => {
  return createInitialGameState(mode);
};
