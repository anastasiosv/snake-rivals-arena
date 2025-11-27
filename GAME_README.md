# Snake Multiplayer Game

A modern take on the classic Snake game with multiplayer features, built with React, TypeScript, and Vite.

## Features

- **Two Game Modes**
  - **Walls Mode**: Classic gameplay where hitting walls ends the game
  - **Pass-Through Mode**: Walls teleport you to the opposite side

- **Multiplayer Ready**
  - User authentication (login/signup)
  - Leaderboard with top player rankings
  - Spectate mode to watch other players (bot simulation)
  - User profiles with statistics

- **Fully Tested**
  - Comprehensive test suite for game logic
  - Run tests with: `npx vitest` or `npx vitest run`

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- Vitest for testing
- Mock backend service (centralized in `src/lib/services/mockBackend.ts`)

## Project Structure

```
src/
├── components/
│   ├── game/           # Game-specific components
│   ├── layout/         # Layout components (Header)
│   └── ui/            # Reusable UI components (shadcn)
├── lib/
│   ├── game/          # Game logic and constants
│   │   ├── constants.ts
│   │   ├── gameLogic.ts
│   │   └── botPlayer.ts
│   ├── services/      # Backend services (mock)
│   │   └── mockBackend.ts
│   └── types/         # TypeScript types
│       └── game.ts
├── pages/             # Page components
│   ├── Home.tsx
│   ├── Game.tsx
│   ├── Auth.tsx
│   ├── Leaderboard.tsx
│   └── Spectate.tsx
└── __tests__/         # Test files
    ├── setup.ts
    └── gameLogic.test.ts
```

## Game Controls

- **Arrow Keys**: Move the snake (↑ ↓ ← →)
- **Space**: Pause/Resume game
- **Reset Button**: Start a new game

## Mock Backend

All backend functionality is centralized in `src/lib/services/mockBackend.ts`:

- **Authentication**: Login, signup, logout, get current user
- **Leaderboard**: Get top scores, submit scores
- **Spectate**: Get live games, watch specific game

This makes it easy to swap in a real backend later.

## Running Tests

```bash
# Run tests in watch mode
npx vitest

# Run tests once
npx vitest run

# Run tests with coverage
npx vitest --coverage
```

## Game Logic Tests

The game logic is thoroughly tested with the following test cases:

- Initial game state creation
- Snake movement in all directions
- Food generation and collision
- Wall collision (walls mode)
- Wall wrap-around (pass-through mode)
- Self-collision detection
- Score calculation
- Pause/resume functionality
- Direction change validation
- Game reset

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npx vitest

# Build for production
npm run build
```

## Design System

The game uses a cyberpunk-inspired design system with:

- **Colors**: Neon green primary, cyan secondary, orange accents
- **Typography**: Rajdhani for display, Inter for body
- **Animations**: Smooth transitions and glow effects
- **Theme**: Dark mode optimized for gaming

All design tokens are defined in `src/index.css` and `tailwind.config.ts`.

## Future Enhancements

- Real multiplayer with WebSockets
- More game modes (obstacles, power-ups)
- Tournament system
- Friend system and private matches
- Custom skins and themes
- Mobile controls support
