import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { GlassCard, Heading, cn } from '@/components/ui/design-system';
import { Lock } from 'lucide-react';

const BADGES = [
  { id: 1, name: 'First Review', icon: '🎯', rarity: 'COMMON', desc: 'Submitted your very first review', unlocked: true, earnedAt: 'Dec 2024', category: 'Milestone', animation: 'bounce' },
  { id: 2, name: '10 Reviews', icon: '🔟', rarity: 'RARE', desc: 'Completed 10 quality reviews', unlocked: true, earnedAt: 'Jan 2025', category: 'Milestone', animation: 'spin' },
  { id: 3, name: 'Scholar', icon: '📚', rarity: 'RARE', desc: 'Reached Level 2', unlocked: true, earnedAt: 'Jan 2025', category: 'Level', animation: 'pulse' },
  { id: 4, name: '7-Day Streak', icon: '🔥', rarity: 'EPIC', desc: 'Reviewed 7 days in a row', unlocked: true, earnedAt: 'Feb 2025', category: 'Streak', animation: 'bounce' },
  { id: 5, name: 'CS Expert', icon: '💻', rarity: 'EPIC', desc: 'Reviewed 20 CS papers', unlocked: true, earnedAt: 'Feb 2025', category: 'Domain', animation: 'float' },
  { id: 6, name: 'Night Owl', icon: '🦉', rarity: 'RARE', desc: '5 reviews between 11pm–3am', unlocked: true, earnedAt: 'Jan 2025', category: 'Secret', animation: 'pulse' },
  { id: 7, name: '50 Reviews', icon: '⭐', rarity: 'EPIC', desc: 'Complete 50 reviews', unlocked: false, progress: 42, total: 50, category: 'Milestone' },
  { id: 8, name: '100 Reviews', icon: '💯', rarity: 'LEGENDARY', desc: 'Complete 100 reviews', unlocked: false, progress: 42, total: 100, category: 'Milestone' },
  { id: 9, name: 'Perfectionist', icon: '✨', rarity: 'LEGENDARY', desc: 'Receive 10/10 helpful rating 5 times', unlocked: false, progress: 2, total: 5, category: 'Quality' },
  { id: 10, name: 'Luminary', icon: '🌟', rarity: 'LEGENDARY', desc: 'Reach Level 6', unlocked: false, progress: 4, total: 6, category: 'Level' },
  { id: 11, name: 'Monthly Champion', icon: '🏆', rarity: 'LEGENDARY', desc: 'Rank #1 in a monthly leaderboard', unlocked: false, progress: 0, total: 1, category: 'Leaderboard' },
  { id: 12, name: 'Polymath', icon: '🧠', rarity: 'EPIC', desc: 'Review papers in 5 different domains', unlocked: false, progress: 3, total: 5, category: 'Domain' },
];

const RARITY_COLORS: Record<string, string> = {
  'COMMON': '#8b8680',
  'RARE': '#3b82f6',
  'EPIC': '#9333ea',
  'LEGENDARY': '#d4a843',
};

const LEVELS = [
  { level: 1, name: 'Initiate', xp: 0, color: '#8b8680', features: ['2 reviews/week', 'Basic analytics'] },
  { level: 2, name: 'Scholar', xp: 500, color: '#a0a0b8', features: ['Priority matching', 'Review history'] },
  { level: 3, name: 'Fellow', xp: 1200, color: '#d4a843', features: ['XP bonuses', 'Domain badges'] },
  { level: 4, name: 'Expert', xp: 2000, color: '#f59e0b', features: ['Paid reviews', 'Featured status'] },
  { level: 5, name: 'Distinguished', xp: 3500, color: '#0d9488', features: ['Mentorship', 'Admin access'] },
  { level: 6, name: 'Luminary', xp: 6000, color: '#dc2626', features: ['Platform governance', 'Council vote'] },
];

const FILTER_TABS = ['All', 'Unlocked', 'Locked', 'Milestone', 'Domain', 'Streak'];

export default function Badges() {
  const [filter, setFilter] = useState('All');
  const currentLevel = 4;

  const filtered = BADGES.filter(b => {
    if (filter === 'All') return true;
    if (filter === 'Unlocked') return b.unlocked;
    if (filter === 'Locked') return !b.unlocked;
    return b.category === filter;
  });

  return (
    <AppLayout role="reviewer">
      <div className="fixed inset-0 z-[-1] bg-[#0a0b0f]">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-purple-900/10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Heading level={2} className="mb-2">Your Achievements</Heading>
          <p className="text-muted-foreground">{BADGES.filter(b => b.unlocked).length} / {BADGES.length} badges unlocked</p>
        </motion.div>

        <div className="flex gap-2 flex-wrap">
          {FILTER_TABS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('px-4 py-2 rounded-full text-sm transition-all', filter === f ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:border-primary/50')}
            >{f}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group relative"
            >
              <div className={cn(
                'rounded-2xl border p-5 flex flex-col items-center text-center transition-all duration-300 h-full',
                badge.unlocked
                  ? 'bg-card/80 border-border hover:border-primary/50 hover:shadow-[0_0_25px_rgba(212,168,67,0.15)]'
                  : 'bg-card/40 border-border/40 filter saturate-0'
              )}>
                {!badge.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl z-10">
                    <Lock size={24} className="text-muted-foreground/40" />
                  </div>
                )}

                <div className={cn(
                  'text-5xl mb-3 transition-transform duration-300',
                  badge.unlocked && 'group-hover:scale-110',
                  badge.animation === 'bounce' && badge.unlocked ? 'animate-bounce' : '',
                  badge.animation === 'pulse' && badge.unlocked ? 'animate-pulse' : '',
                )}>
                  {badge.icon}
                </div>

                <span className="font-serif text-sm font-bold mb-1 uppercase tracking-wider">{badge.name}</span>

                <span className="text-xs font-mono px-2 py-0.5 rounded-full mb-2" style={{ color: RARITY_COLORS[badge.rarity || 'COMMON'], background: `${RARITY_COLORS[badge.rarity || 'COMMON']}22` }}>
                  {badge.rarity}
                </span>

                <p className="text-xs text-muted-foreground leading-relaxed">{badge.desc}</p>

                {badge.unlocked && badge.earnedAt && (
                  <p className="text-xs font-mono text-muted-foreground/60 mt-2">Earned {badge.earnedAt}</p>
                )}

                {!badge.unlocked && badge.progress !== undefined && (
                  <div className="w-full mt-3">
                    <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1">
                      <span>{badge.progress}</span><span>{badge.total}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-primary/50" style={{ width: `${(badge.progress! / badge.total!) * 100}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div>
          <Heading level={3} className="mb-6">Level Progression</Heading>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border/50" />
            <div className="space-y-4">
              {LEVELS.map((lvl, i) => {
                const isActive = lvl.level === currentLevel;
                const isPast = lvl.level < currentLevel;
                return (
                  <motion.div
                    key={lvl.level}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: isPast || isActive ? 1 : 0.4, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-5 pl-4"
                  >
                    <div className={cn(
                      'relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 mt-1',
                      isActive ? 'border-primary bg-primary text-primary-foreground shadow-[0_0_15px_rgba(212,168,67,0.5)]' : isPast ? 'border-primary/50 bg-primary/20' : 'border-border bg-card'
                    )}>
                      {isPast ? '✓' : lvl.level}
                    </div>
                    <GlassCard className={cn('flex-1 p-4', isActive && 'border-primary/40 shadow-[0_0_20px_rgba(212,168,67,0.1)]')}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif font-bold uppercase tracking-wider" style={{ color: lvl.color }}>{lvl.name}</span>
                        <span className="text-xs font-mono text-muted-foreground">{lvl.xp.toLocaleString()} XP</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {lvl.features.map(f => <span key={f} className="text-xs px-2 py-0.5 rounded bg-white/5 text-muted-foreground">{f}</span>)}
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
