'use client'


export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, Heading, FloatingInput, GoldButton } from '@/components/ui/design-system';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/ui/Logo';

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const quotes = [
    "Somewhere, something incredible is waiting to be known. — Carl Sagan",
    "Science is a way of thinking much more than it is a body of knowledge. — Carl Sagan",
    "The important thing is not to stop questioning. — Albert Einstein"
  ];

  // Rotate quotes
  React.useEffect(() => {
    const int = setInterval(() => setQuoteIdx(i => (i + 1) % quotes.length), 6000);
    return () => clearInterval(int);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login delay
    await new Promise(r => setTimeout(r, 1500));
    toast({ title: "Welcome back, Dr. Osei", description: "Successfully authenticated." });
    router.push('/dashboard/reviewer');
  };

  return (
    <PageTransition className="flex min-h-screen bg-background">
      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden flex-col justify-between p-12 border-r border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-primary/10 z-0" />
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay z-0" 
          style={{ backgroundImage: `url(/images/auth-bg.png)`, backgroundSize: 'cover' }}
        />
        
        <div className="z-10">
          <Logo showSubtitle />
        </div>

        <div className="z-10 max-w-lg">
          <AnimatePresence mode="wait">
            <motion.p
              key={quoteIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="font-display text-4xl leading-tight text-primary/90 italic"
            >
              "{quotes[quoteIdx].split('—')[0]}"
              <span className="block mt-4 text-xl text-muted-foreground not-italic font-sans">— {quotes[quoteIdx].split('—')[1]}</span>
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Logo compact />
        </div>

        <div className="w-full max-w-md space-y-8">
          <div>
            <Heading level={2} className="mb-2">Welcome Back</Heading>
            <p className="text-muted-foreground">Sign in to access your dashboard.</p>
          </div>

          <button className="w-full h-12 rounded-xl border border-border bg-card hover:bg-white/5 transition-colors flex items-center justify-center gap-3 font-medium">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs font-mono text-muted-foreground uppercase">or sign in with email</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <FloatingInput label="Email Address" id="email" type="email" required defaultValue="amara@mit.edu" />
            <div>
              <FloatingInput label="Password" id="password" type="password" required defaultValue="password123" />
              <div className="flex justify-end mt-2">
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
            </div>
            
            <GoldButton type="submit" className="w-full h-12 mt-4" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </GoldButton>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link href="/register" className="text-primary hover:underline">Apply for Access</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
