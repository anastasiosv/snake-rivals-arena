import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Gamepad2, Shield, Trophy, Eye } from 'lucide-react';

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-4">
            <span className="text-foreground">Snake</span>
            <span className="text-primary"> Multiplayer</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Classic snake game reimagined with multiplayer features, leaderboards, and spectator mode
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12"
        >
          <motion.div variants={item}>
            <Link to="/game?mode=walls">
              <Card className="border-2 border-border hover:border-primary transition-all hover:shadow-neon cursor-pointer h-full bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center space-y-4 p-8">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto shadow-neon">
                    <Shield className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-3xl font-display">Walls Mode</CardTitle>
                  <CardDescription className="text-base">
                    Classic gameplay - hit the wall and it's game over. Test your precision!
                  </CardDescription>
                  <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon">
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    Play Walls
                  </Button>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <Link to="/game?mode=pass-through">
              <Card className="border-2 border-border hover:border-secondary transition-all hover:shadow-[0_0_20px_hsl(var(--secondary)_/_0.3)] cursor-pointer h-full bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center space-y-4 p-8">
                  <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mx-auto shadow-[0_0_20px_hsl(var(--secondary)_/_0.4)]">
                    <Gamepad2 className="w-8 h-8 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-3xl font-display">Pass-Through Mode</CardTitle>
                  <CardDescription className="text-base">
                    Walls teleport you to the opposite side. Master the infinite grid!
                  </CardDescription>
                  <Button size="lg" variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    Play Pass-Through
                  </Button>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          <motion.div variants={item}>
            <Link to="/leaderboard">
              <Card className="border border-border hover:border-accent transition-all hover:shadow-[0_0_20px_hsl(var(--accent)_/_0.3)] cursor-pointer bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center space-x-4 p-6">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center shadow-[0_0_15px_hsl(var(--accent)_/_0.4)]">
                    <Trophy className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-display">Leaderboard</CardTitle>
                    <CardDescription>See top players and rankings</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <Link to="/spectate">
              <Card className="border border-border hover:border-neon-cyan transition-all hover:shadow-[0_0_20px_hsl(var(--neon-cyan)_/_0.3)] cursor-pointer bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center space-x-4 p-6">
                  <div className="w-12 h-12 bg-neon-cyan rounded-lg flex items-center justify-center shadow-[0_0_15px_hsl(var(--neon-cyan)_/_0.4)]">
                    <Eye className="w-6 h-6 text-background" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-display">Spectate</CardTitle>
                    <CardDescription>Watch other players live</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
