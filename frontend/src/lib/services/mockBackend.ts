import { Player, LeaderboardEntry, LiveGame, GameMode } from '../types/game';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Token management
let authToken: string | null = localStorage.getItem('authToken');

const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

// API Client
export const apiClient = {
  auth: {
    login: async (username: string, password: string): Promise<{ user: Player; token: string } | { error: string }> => {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          return { error: error.detail || 'Invalid credentials' };
        }

        const data = await response.json();
        setAuthToken(data.token);
        return data;
      } catch (error) {
        return { error: 'Network error. Please try again.' };
      }
    },

    signup: async (username: string, password: string): Promise<{ user: Player; token: string } | { error: string }> => {
      try {
        const response = await fetch(`${API_URL}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          return { error: error.detail || 'Signup failed' };
        }

        const data = await response.json();
        setAuthToken(data.token);
        return data;
      } catch (error) {
        return { error: 'Network error. Please try again.' };
      }
    },

    logout: async (): Promise<void> => {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        setAuthToken(null);
      }
    },

    getCurrentUser: async (): Promise<Player | null> => {
      if (!authToken) {
        return null;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          setAuthToken(null);
          return null;
        }

        return await response.json();
      } catch (error) {
        console.error('Get current user error:', error);
        return null;
      }
    },
  },

  leaderboard: {
    getTopScores: async (limit: number = 10): Promise<LeaderboardEntry[]> => {
      try {
        const response = await fetch(`${API_URL}/leaderboard?limit=${limit}`);

        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }

        return await response.json();
      } catch (error) {
        console.error('Leaderboard error:', error);
        return [];
      }
    },

    submitScore: async (score: number, mode: GameMode): Promise<{ success: boolean; newRank?: number }> => {
      try {
        const response = await fetch(`${API_URL}/leaderboard`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ score, mode }),
        });

        if (!response.ok) {
          return { success: false };
        }

        return await response.json();
      } catch (error) {
        console.error('Submit score error:', error);
        return { success: false };
      }
    },
  },

  spectate: {
    getLiveGames: async (): Promise<LiveGame[]> => {
      try {
        const response = await fetch(`${API_URL}/spectate/live`);

        if (!response.ok) {
          throw new Error('Failed to fetch live games');
        }

        return await response.json();
      } catch (error) {
        console.error('Live games error:', error);
        return [];
      }
    },

    watchGame: async (gameId: string): Promise<LiveGame | null> => {
      try {
        const response = await fetch(`${API_URL}/spectate/live/${gameId}`);

        if (!response.ok) {
          return null;
        }

        return await response.json();
      } catch (error) {
        console.error('Watch game error:', error);
        return null;
      }
    },
  },
};

// Export as mockBackendAPI for backward compatibility
export const mockBackendAPI = apiClient;
