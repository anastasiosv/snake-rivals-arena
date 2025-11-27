import { Player, LeaderboardEntry, LiveGame, GameMode } from '../types/game';

// Simulated latency
const MOCK_DELAY = 300;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user storage (in real app this would be backend)
let currentUser: Player | null = null;

// Mock data
const mockPlayers: Player[] = [
  {
    id: '1',
    username: 'SnakeMaster',
    score: 0,
    highScore: 450,
    gamesPlayed: 127,
    lastPlayed: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    username: 'NeonViper',
    score: 0,
    highScore: 380,
    gamesPlayed: 89,
    lastPlayed: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    username: 'CyberSnake',
    score: 0,
    highScore: 320,
    gamesPlayed: 64,
    lastPlayed: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: '4',
    username: 'PixelHunter',
    score: 0,
    highScore: 290,
    gamesPlayed: 52,
    lastPlayed: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: '5',
    username: 'GridWarrior',
    score: 0,
    highScore: 270,
    gamesPlayed: 43,
    lastPlayed: new Date(Date.now() - 18000000).toISOString(),
  },
];

const mockLeaderboard: LeaderboardEntry[] = mockPlayers.map((player, index) => ({
  rank: index + 1,
  player,
  score: player.highScore,
  mode: Math.random() > 0.5 ? 'walls' : 'pass-through',
  timestamp: player.lastPlayed || new Date().toISOString(),
}));

// Auth API
export const mockBackendAPI = {
  auth: {
    login: async (username: string, password: string): Promise<{ user: Player; token: string } | { error: string }> => {
      await delay(MOCK_DELAY);
      
      const user = mockPlayers.find(p => p.username.toLowerCase() === username.toLowerCase());
      
      if (!user || password.length < 3) {
        return { error: 'Invalid credentials' };
      }
      
      currentUser = user;
      return { user, token: 'mock-token-' + user.id };
    },

    signup: async (username: string, password: string): Promise<{ user: Player; token: string } | { error: string }> => {
      await delay(MOCK_DELAY);
      
      if (username.length < 3) {
        return { error: 'Username must be at least 3 characters' };
      }
      
      if (password.length < 3) {
        return { error: 'Password must be at least 3 characters' };
      }
      
      const exists = mockPlayers.some(p => p.username.toLowerCase() === username.toLowerCase());
      if (exists) {
        return { error: 'Username already taken' };
      }
      
      const newUser: Player = {
        id: String(mockPlayers.length + 1),
        username,
        score: 0,
        highScore: 0,
        gamesPlayed: 0,
      };
      
      mockPlayers.push(newUser);
      currentUser = newUser;
      
      return { user: newUser, token: 'mock-token-' + newUser.id };
    },

    logout: async (): Promise<void> => {
      await delay(MOCK_DELAY);
      currentUser = null;
    },

    getCurrentUser: async (): Promise<Player | null> => {
      await delay(100);
      return currentUser;
    },
  },

  leaderboard: {
    getTopScores: async (limit: number = 10): Promise<LeaderboardEntry[]> => {
      await delay(MOCK_DELAY);
      return mockLeaderboard.slice(0, limit);
    },

    submitScore: async (score: number, mode: GameMode): Promise<{ success: boolean; newRank?: number }> => {
      await delay(MOCK_DELAY);
      
      if (!currentUser) {
        return { success: false };
      }
      
      // Update high score if needed
      if (score > currentUser.highScore) {
        currentUser.highScore = score;
      }
      
      return { success: true, newRank: 5 };
    },
  },

  spectate: {
    getLiveGames: async (): Promise<LiveGame[]> => {
      await delay(MOCK_DELAY);
      
      // Generate mock live games
      const liveGames: LiveGame[] = mockPlayers.slice(0, 3).map((player, index) => ({
        id: `game-${player.id}`,
        player,
        mode: index % 2 === 0 ? 'walls' : 'pass-through',
        currentScore: Math.floor(Math.random() * 200) + 50,
        startedAt: new Date(Date.now() - Math.random() * 300000).toISOString(),
        spectators: Math.floor(Math.random() * 10),
      }));
      
      return liveGames;
    },

    watchGame: async (gameId: string): Promise<LiveGame | null> => {
      await delay(MOCK_DELAY);
      
      const games = await mockBackendAPI.spectate.getLiveGames();
      return games.find(g => g.id === gameId) || null;
    },
  },
};
