import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { mockBackendAPI } from '@/lib/services/mockBackend';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Player } from '@/lib/types/game';

interface AuthProps {
  onLogin: (user: Player) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = isLogin
        ? await mockBackendAPI.auth.login(username, password)
        : await mockBackendAPI.auth.signup(username, password);

      if ('error' in result) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: isLogin ? "Welcome back!" : "Account created!",
          description: `Logged in as ${result.user.username}`,
        });
        onLogin(result.user);
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-border shadow-neon-strong bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 shadow-neon">
              <span className="text-primary-foreground font-display font-bold text-3xl">S</span>
            </div>
            <CardTitle className="text-3xl font-display">
              {isLogin ? 'Welcome Back' : 'Join the Game'}
            </CardTitle>
            <CardDescription>
              {isLogin ? 'Sign in to continue playing' : 'Create your account to start'}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {isLogin && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Demo credentials: Any existing username with any password (3+ chars)</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
