import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, ShieldCheck, BarChart, ChevronDown } from 'lucide-react';
import { ConstellationBg } from '@/components/three/Backgrounds';
import { Heading, GoldButton, GlassCard, PageTransition } from '@/components/ui/design-system';
import { Logo } from '@/components/ui/Logo';

export default function Landing() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <PageTransition>
      <ConstellationBg />
      
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/50 backdrop-blur-md border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo showSubtitle={false} />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/explore" className="text-muted-foreground hover:text-primary transition-colors">Explore Papers</Link>
            <Link href="/leaderboard" className="text-muted-foreground hover:text-primary transition-colors">Leaderboard</Link>
            <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">Login</Link>
            <Link href="/register">
              <GoldButton className="py-2 px-5 text-sm h-auto">Join Network</GoldButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center z-10"
        >
          <motion.div variants={staggerItem} className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm">
            <span className="font-serif text-primary text-xs font-bold tracking-[0.3em] uppercase">The Future of Academic Peer Review</span>
          </motion.div>
          
          <motion.div variants={staggerItem}>
            <Heading level={1} className="mb-6">
              Where Research Gets <span className="italic font-light text-primary">Its Due</span>
            </Heading>
          </motion.div>
          
          <motion.p variants={staggerItem} className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            A gamified, high-fidelity platform where verified scholars review, elevate, and reward groundbreaking research globally.
          </motion.p>
          
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <GoldButton className="w-full sm:w-auto text-lg h-14 px-8">
                Submit Your Research <ArrowRight className="ml-2" size={20} />
              </GoldButton>
            </Link>
            <Link href="/register">
              <GoldButton variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 bg-background/50 backdrop-blur">
                Become a Reviewer
              </GoldButton>
            </Link>
          </motion.div>

          <motion.div variants={staggerItem} className="mt-20 flex flex-wrap justify-center gap-x-12 gap-y-6 text-sm font-mono text-muted-foreground">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> 12,400+ Papers</div>
            <div className="hidden sm:block text-border">|</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" /> 3,200 Scholars</div>
            <div className="hidden sm:block text-border">|</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> 94% Satisfaction</div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 px-6 bg-card/30 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Heading level={2}>A New Standard for Review</Heading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="md:col-span-2 md:row-span-2 p-8 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                  <Upload size={24} />
                </div>
                <Heading level={3} className="mb-3">Frictionless Submission</Heading>
                <p className="text-muted-foreground max-w-md">Drop your PDF. Our AI extracts metadata instantly. Set your review timeline preferences and get matched with domain experts.</p>
              </div>
              <div className="mt-10 h-48 rounded-xl border border-dashed border-primary/30 bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <div className="text-primary/60 font-mono text-sm flex items-center gap-2">
                  <Upload size={16} /> Drop paper.pdf here
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-8">
               <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 mb-6">
                  <ShieldCheck size={24} />
                </div>
                <Heading level={4} className="mb-2">Verified Experts</Heading>
                <p className="text-sm text-muted-foreground">Only manually verified scholars with proven credentials can review papers.</p>
            </GlassCard>

            <GlassCard className="p-8">
               <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                  <BarChart size={24} />
                </div>
                <Heading level={4} className="mb-2">Gamified Insights</Heading>
                <p className="text-sm text-muted-foreground">Earn XP, level up, and unlock prestigious badges for high-quality, constructive reviews.</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="border-t border-border/50 bg-background py-20 px-6 text-center">
        <Heading level={2} className="mb-8">Ready to elevate your research?</Heading>
        <Link href="/register">
          <GoldButton className="text-lg px-10 h-16">Enter the Forge</GoldButton>
        </Link>
        <p className="mt-10 text-sm font-mono text-muted-foreground">© 2026 ScholarForge. Open Science Initiative.</p>
      </footer>
    </PageTransition>
  );
}
