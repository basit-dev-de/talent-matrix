
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  // For demo, pre-fill with demo account
  useEffect(() => {
    setEmail('demo@example.com');
    setPassword('password');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <div className="animate-scale-in w-full max-w-md bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-primary/30 to-primary/5">
          <div className="bg-card rounded-lg p-8">
            <div className="flex justify-center mb-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  TM
                </div>
                <span className="font-semibold text-lg">TalentMatrix</span>
              </Link>
            </div>
            
            <h1 className="text-2xl font-bold mb-6 text-center">Welcome back</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full h-11 font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
              
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:text-primary/80 transition-colors">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>For demo purposes, use:</p>
        <p>Email: demo@example.com | Password: password</p>
      </div>
    </div>
  );
};

export default Login;
