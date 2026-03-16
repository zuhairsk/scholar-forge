import React from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuroraBg } from '@/components/three/Backgrounds';
import { Heading, GlassCard, LevelBadge, XPBar, DomainChip, GoldButton } from '@/components/ui/design-system';
import { useCurrentUser, usePapers } from '@/hooks/use-scholar-data';
import { Flame, Star, Trophy, Clock, Lock } from 'lucide-react';
import { Link } from 'wouter';

export default function ReviewerDashboard() {
  const { data: user } = useCurrentUser();
  const { data: queue = [] } = usePapers({ status: 'Under Review' });

  if (!user) return null;

  return (
    <AppLayout role="reviewer">
      <AuroraBg />
      
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
        
        {/* Top Hero: Level & XP */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-8 relative overflow-hidden border-primary/30">
            {/* Soft glow behind the card content */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-teal-500/10 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <LevelBadge level={user.level} name={user.levelName} showRing={true} />
              </div>
              
              <div className="flex-1 w-full">
                <h2 className="font-serif text-3xl font-bold tracking-widest text-glow uppercase mb-1">{user.levelName}</h2>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                  <span className="px-2 py-0.5 rounded bg-background/50 border border-border">Level {user.level}</span>
                  <span>{user.xp} Total XP</span>
                </div>
                <XPBar current={user.xp % 1000} max={1000} label="Progress to Level 5" />
              </div>

              <div className="flex flex-row md:flex-col gap-4 md:w-48 flex-shrink-0 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-6">
                <div className="flex items-center gap-2">
                  <Flame className="text-amber-500 animate-pulse" size={20} />
                  <div>
                    <p className="text-sm font-bold text-foreground">7 Day Streak</p>
                    <p className="text-xs text-muted-foreground">Keep it up!</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-primary" size={20} />
                  <div>
                    <p className="text-sm font-bold text-foreground">14 Reviews</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Queue */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <Heading level={3}>Papers Waiting For You</Heading>
              <div className="flex gap-2">
                <DomainChip domain="Computer Science" className="cursor-pointer hover:bg-primary/20" />
                <DomainChip domain="Biology" className="cursor-pointer opacity-50" />
              </div>
            </div>

            <div className="space-y-4">
              {queue.map((paper, i) => (
                <motion.div key={paper.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <GlassCard className="p-6 flex flex-col sm:flex-row gap-6 relative overflow-hidden group">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <DomainChip domain={paper.domain} />
                        <span className="text-xs font-mono text-muted-foreground bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                          +50 XP Reward
                        </span>
                      </div>
                      <h4 className="font-display text-xl font-semibold">{paper.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{paper.abstract}</p>
                      
                      <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock size={14}/> ~{paper.readTime} min read</span>
                        <span className="flex items-center gap-1 text-amber-400"><Clock size={14}/> 72h deadline</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                      <Link href={`/dashboard/reviewer/active/${paper.id}`}>
                        <GoldButton className="w-full sm:w-32 py-2 text-sm shadow-[0_0_15px_rgba(212,168,67,0.3)] group-hover:shadow-[0_0_25px_rgba(212,168,67,0.6)]">
                          Claim Review
                        </GoldButton>
                      </Link>
                      <button className="w-full sm:w-32 py-2 text-sm border border-border text-muted-foreground hover:bg-white/5 rounded-xl transition-colors">
                        Snooze
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Badges Preview */}
            <section>
               <div className="flex items-center justify-between mb-4">
                <Heading level={3}>Achievements</Heading>
                <Link href="/dashboard/reviewer/badges" className="text-sm text-primary hover:underline">View All &rarr;</Link>
              </div>
              <GlassCard className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  {/* Unlocked */}
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/40 to-amber-600/40 border border-primary/50 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary/20 blur-md group-hover:bg-primary/40 transition-colors" />
                      <Trophy size={24} className="text-primary-foreground drop-shadow-md z-10" />
                    </div>
                    <span className="text-xs text-center font-medium">Pioneer</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500/40 to-blue-600/40 border border-teal-500/50 flex items-center justify-center relative overflow-hidden">
                      <Star size={24} className="text-white drop-shadow-md z-10" />
                    </div>
                    <span className="text-xs text-center font-medium">Top 10%</span>
                  </div>
                  {/* Locked */}
                  <div className="flex flex-col items-center gap-2 opacity-40 grayscale hover:grayscale-0 transition-all cursor-pointer">
                    <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center relative">
                      <Lock size={20} className="text-muted-foreground" />
                    </div>
                    <span className="text-xs text-center font-medium">Master</span>
                  </div>
                </div>
              </GlassCard>
            </section>

            {/* Leaderboard Teaser */}
            <section>
              <Heading level={3} className="mb-4">Leaderboard</Heading>
              <GlassCard className="p-0 overflow-hidden">
                <div className="p-4 border-b border-border/50 bg-primary/5 flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">Your Rank: #47</span>
                  <span className="text-xs font-mono text-teal-400">↑ 12 pts</span>
                </div>
                <div className="divide-y divide-border/50">
                  <div className="p-3 flex items-center gap-3 bg-white/5">
                    <span className="font-serif text-primary font-bold w-4">1</span>
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center text-xs">LF</div>
                    <div className="flex-1"><p className="text-sm font-medium">Lena Fischer</p></div>
                    <span className="text-xs font-mono text-muted-foreground">3.8k XP</span>
                  </div>
                  <div className="p-3 flex items-center gap-3">
                    <span className="font-serif text-muted-foreground font-bold w-4">2</span>
                    <div className="w-8 h-8 rounded-full bg-secondary border border-border text-muted-foreground flex items-center justify-center text-xs">RK</div>
                    <div className="flex-1"><p className="text-sm font-medium">Robert K.</p></div>
                    <span className="text-xs font-mono text-muted-foreground">3.2k XP</span>
                  </div>
                </div>
              </GlassCard>
            </section>

          </div>
        </div>

      </div>
    </AppLayout>
  );
}
