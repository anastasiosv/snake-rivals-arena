export const GRID_SIZE = 20;
export const CELL_SIZE = 20;
export const INITIAL_SNAKE_LENGTH = 3;
export const GAME_SPEED = 150; // milliseconds
export const INITIAL_DIRECTION = 'right';

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const OPPOSITE_DIRECTIONS: Record<string, string> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};
