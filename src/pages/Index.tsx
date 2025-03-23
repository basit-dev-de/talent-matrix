
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { initializeMockData } from '@/services/mockData';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [isAnimated, setIsAnimated] = useState(false);

  // Initialize mock data
  useEffect(() => {
    initializeMockData();
  }, []);

  // Animate in elements
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="layout-container py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              TM
            </div>
            <span className="font-semibold text-lg">TalentMatrix</span>
          </div>
          <div className="space-x-4 flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="font-medium"
            >
              Log in
            </Button>
            <Button onClick={() => navigate('/register')}>
              Sign up
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 layout-container py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className={`space-y-6 transition-all duration-700 delay-100 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Streamlined Hiring Process
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              The modern way to manage your hiring pipeline
            </h1>
            <p className="text-lg text-muted-foreground">
              Create custom application forms, track candidates through your hiring process, and make better hiring decisions with our applicant tracking system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="font-medium"
              >
                Get started for free
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/login')}
                className="font-medium"
              >
                Try demo account
              </Button>
            </div>
          </div>

          <div className={`bg-card rounded-2xl shadow-lg border border-border overflow-hidden transition-all duration-700 delay-300 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="p-1 bg-gradient-to-r from-primary/40 to-primary/5">
              <div className="bg-card rounded-xl p-6">
                <div className="grid gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <div className="h-5 w-5 rounded-full bg-primary/40"></div>
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded-full w-2/3"></div>
                        <div className="h-3 bg-muted/60 rounded-full w-5/6"></div>
                      </div>
                      <div className="h-8 w-20 bg-secondary rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-24 md:mt-32 text-center space-y-12 transition-all duration-700 delay-500 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything you need to streamline your hiring process
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-6 transition-smooth card-hover">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Application Forms</h3>
              <p className="text-muted-foreground">
                Create tailored application forms to capture the exact information needed for each job position.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 transition-smooth card-hover">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Candidate Tracking</h3>
              <p className="text-muted-foreground">
                Monitor candidates through each stage of your hiring process with a visual pipeline.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 transition-smooth card-hover">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Scoring</h3>
              <p className="text-muted-foreground">
                Automatically score and rank applicants based on customizable criteria to identify top talent.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-card border-t border-border mt-16">
        <div className="layout-container py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Guides</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                TM
              </div>
              <span className="font-semibold">TalentMatrix</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TalentMatrix. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
