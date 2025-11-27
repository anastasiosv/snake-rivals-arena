import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  moveSnake,
  isPositionOnSnake,
  togglePause,
  resetGame,
} from '../lib/game/gameLogic';
import { GRID_SIZE, INITIAL_SNAKE_LENGTH } from '../lib/game/constants';

describe('Game Logic', () => {
  describe('createInitialGameState', () => {
    it('should create initial game state with correct snake length', () => {
      const state = createInitialGameState('walls');
      expect(state.snake).toHaveLength(INITIAL_SNAKE_LENGTH);
      expect(state.score).toBe(0);
      expect(state.isGameOver).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.mode).toBe('walls');
    });

    it('should create snake in the center of the grid', () => {
      const state = createInitialGameState('walls');
      const centerX = Math.floor(GRID_SIZE / 2);
      const centerY = Math.floor(GRID_SIZE / 2);
      expect(state.snake[0].x).toBe(centerX);
      expect(state.snake[0].y).toBe(centerY);
    });

    it('should create food not on snake', () => {
      const state = createInitialGameState('walls');
      expect(isPositionOnSnake(state.food, state.snake)).toBe(false);
    });
  });

  describe('moveSnake', () => {
    it('should move snake forward', () => {
      const state = createInitialGameState('walls');
      const initialHead = { ...state.snake[0] };
      const newState = moveSnake(state);
      
      expect(newState.snake[0].x).toBe(initialHead.x + 1); // moving right
      expect(newState.snake[0].y).toBe(initialHead.y);
    });

    it('should not move when paused', () => {
      const state = createInitialGameState('walls');
      const pausedState = { ...state, isPaused: true };
      const newState = moveSnake(pausedState);
      
      expect(newState.snake[0]).toEqual(pausedState.snake[0]);
    });

    it('should not move when game is over', () => {
      const state = createInitialGameState('walls');
      const gameOverState = { ...state, isGameOver: true };
      const newState = moveSnake(gameOverState);
      
      expect(newState.snake[0]).toEqual(gameOverState.snake[0]);
    });

    it('should increase score when eating food', () => {
      const state = createInitialGameState('walls');
      // Place food in front of snake
      const foodInFront = {
        x: state.snake[0].x + 1,
        y: state.snake[0].y,
      };
      const stateWithFood = { ...state, food: foodInFront };
      const newState = moveSnake(stateWithFood);
      
      expect(newState.score).toBe(state.score + 10);
      expect(newState.snake.length).toBe(state.snake.length + 1);
    });

    it('should end game when hitting wall in walls mode', () => {
      const state = createInitialGameState('walls');
      // Move snake to edge
      const edgeState = {
        ...state,
        snake: [{ x: GRID_SIZE - 1, y: 5 }, ...state.snake.slice(1)],
        direction: 'right' as const,
      };
      const newState = moveSnake(edgeState);
      
      expect(newState.isGameOver).toBe(true);
    });

    it('should wrap around in pass-through mode', () => {
      const state = createInitialGameState('pass-through');
      const edgeState = {
        ...state,
        snake: [{ x: GRID_SIZE - 1, y: 5 }, ...state.snake.slice(1)],
        direction: 'right' as const,
      };
      const newState = moveSnake(edgeState);
      
      expect(newState.isGameOver).toBe(false);
      expect(newState.snake[0].x).toBe(0);
    });

    it('should prevent moving in opposite direction', () => {
      const state = createInitialGameState('walls');
      const newState = moveSnake(state, 'left'); // try to go opposite of 'right'
      
      expect(newState.direction).toBe('right'); // should stay right
    });

    it('should end game on self collision', () => {
      const state = createInitialGameState('walls');
      // Create a situation where snake collides with itself
      const collisionState = {
        ...state,
        snake: [
          { x: 5, y: 5 },
          { x: 4, y: 5 },
          { x: 4, y: 6 },
          { x: 5, y: 6 },
        ],
        direction: 'down' as const,
      };
      const newState = moveSnake(collisionState);
      
      expect(newState.isGameOver).toBe(true);
    });
  });

  describe('togglePause', () => {
    it('should toggle pause state', () => {
      const state = createInitialGameState('walls');
      const pausedState = togglePause(state);
      
      expect(pausedState.isPaused).toBe(true);
      
      const unpausedState = togglePause(pausedState);
      expect(unpausedState.isPaused).toBe(false);
    });
  });

  describe('resetGame', () => {
    it('should reset game to initial state', () => {
      const state = createInitialGameState('walls');
      const modifiedState = {
        ...state,
        score: 100,
        isGameOver: true,
      };
      
      const resetState = resetGame('walls');
      
      expect(resetState.score).toBe(0);
      expect(resetState.isGameOver).toBe(false);
      expect(resetState.snake).toHaveLength(INITIAL_SNAKE_LENGTH);
    });
  });

  describe('isPositionOnSnake', () => {
    it('should return true when position is on snake', () => {
      const state = createInitialGameState('walls');
      const headPosition = state.snake[0];
      
      expect(isPositionOnSnake(headPosition, state.snake)).toBe(true);
    });

    it('should return false when position is not on snake', () => {
      const state = createInitialGameState('walls');
      const offPosition = { x: 0, y: 0 };
      
      expect(isPositionOnSnake(offPosition, state.snake)).toBe(false);
    });
  });
});
