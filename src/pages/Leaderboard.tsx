import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockBackendAPI } from '@/lib/services/mockBackend';
import { LeaderboardEntry } from '@/lib/types/game';
import { motion } from 'framer-motion';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    const data = await mockBackendAPI.leaderboard.getTopScores(10);
    setEntries(data);
    setIsLoading(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-accent" />;
      case 2:
        return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 3:
        return <Award className="w-6 h-6 text-neon-orange" />;
      default:
        return <span className="text-lg font-display font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-2 border-border shadow-neon-strong bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center border-b border-border">
              <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_hsl(var(--accent)_/_0.4)]">
                <Trophy className="w-8 h-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-4xl font-display">Top Players</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground">Loading...</div>
              ) : (
                <div className="divide-y divide-border">
                  {entries.map((entry, index) => (
                    <motion.div
                      key={entry.player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-6 flex items-center space-x-4 hover:bg-muted/50 transition-colors ${
                        entry.rank <= 3 ? 'bg-muted/30' : ''
                      }`}
                    >
                      <div className="flex items-center justify-center w-12">
                        {getRankIcon(entry.rank)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-display font-semibold text-foreground">
                            {entry.player.username}
                          </h3>
                          <span className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded-full font-medium">
                            {entry.mode === 'pass-through' ? 'Pass-Through' : 'Walls'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {entry.player.gamesPlayed} games played
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-display font-bold text-primary">
                          {entry.score}
                        </div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
