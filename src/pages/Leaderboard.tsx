import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StarFieldBg } from '@/components/three/Backgrounds';
import { GlassCard, Heading, DomainChip, cn } from '@/components/ui/design-system';
import { Crown, TrendingUp, TrendingDown, Minus, ArrowUp } from 'lucide-react';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Prof. Lena Fischer', institution: 'Max Planck Institute', level: 5, levelName: 'Distinguished', xp: 3800, weeklyXp: 620, domain: 'Physics', avatar: 'LF', change: 0 },
  { rank: 2, name: 'Dr. Marcus Wu', institution: 'Caltech', level: 5, levelName: 'Distinguished', xp: 3650, weeklyXp: 540, domain: 'Biology', avatar: 'MW', change: 1 },
  { rank: 3, name: 'Dr. Priya Singh', institution: 'IIT Bombay', level: 4, levelName: 'Expert', xp: 3200, weeklyXp: 490, domain: 'Chemistry', avatar: 'PS', change: -1 },
  { rank: 4, name: 'Dr. Amara Osei', institution: 'MIT', level: 4, levelName: 'Expert', xp: 2340, weeklyXp: 380, domain: 'Computer Science', avatar: 'AO', change: 2 },
  { rank: 5, name: 'Dr. Ravi Sharma', institution: 'Stanford', level: 3, levelName: 'Fellow', xp: 1450, weeklyXp: 310, domain: 'Computer Science', avatar: 'RS', change: 0 },
  { rank: 6, name: 'James Chen', institution: 'Berkeley', level: 3, levelName: 'Fellow', xp: 1380, weeklyXp: 290, domain: 'Computer Science', avatar: 'JC', change: -2 },
  { rank: 7, name: 'Dr. Anna Kowalski', institution: 'Warsaw Univ.', level: 3, levelName: 'Fellow', xp: 1240, weeklyXp: 250, domain: 'Physics', avatar: 'AK', change: 3 },
  { rank: 8, name: 'Prof. Jose Martinez', institution: 'UNAM', level: 3, levelName: 'Fellow', xp: 1100, weeklyXp: 220, domain: 'Environmental Science', avatar: 'JM', change: 0 },
  { rank: 9, name: 'Dr. Sofia Reyes', institution: 'Oxford', level: 2, levelName: 'Scholar', xp: 780, weeklyXp: 180, domain: 'Neuroscience', avatar: 'SR', change: 1 },
  { rank: 10, name: 'Dr. Tae-yang Kim', institution: 'KAIST', level: 2, levelName: 'Scholar', xp: 710, weeklyXp: 160, domain: 'Engineering', avatar: 'TK', change: -1 },
];

const CROWN_COLORS = ['#d4a843', '#a0a0b8', '#cd7f32'];
const CROWN_HEIGHTS = ['140px', '100px', '100px'];
const TABS = ['This Week', 'This Month', 'All Time', 'By Domain'];

function PodiumCard({ user, position }: { user: typeof MOCK_LEADERBOARD[0], position: number }) {
  const colors = ['from-yellow-500/20 to-amber-900/20', 'from-slate-400/20 to-slate-700/20', 'from-orange-700/20 to-orange-900/20'];
  const borderColors = ['border-yellow-500/40', 'border-slate-400/40', 'border-orange-700/40'];
  const orderMap = [1, 0, 2]; // visual order: 2nd, 1st, 3rd
  const displayIdx = orderMap[position];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: displayIdx * 0.1 }}
      whileHover={{ scale: 1.03 }}
      className="flex flex-col items-center"
      style={{ marginTop: position === 0 ? 0 : position === 1 ? 40 : 60 }}
    >
      <div className="relative mb-4">
        {position === 0 && (
          <motion.div className="absolute -top-8 left-1/2 -translate-x-1/2 text-3xl" animate={{ rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 2 }}>
            👑
          </motion.div>
        )}
        <motion.div
          className={cn('w-20 h-20 rounded-full border-2 flex items-center justify-center font-display text-2xl font-bold', borderColors[position])}
          style={{ background: `linear-gradient(135deg, ${CROWN_COLORS[position]}33, transparent)` }}
          whileHover={{ boxShadow: `0 0 30px ${CROWN_COLORS[position]}66` }}
        >
          {user.avatar}
        </motion.div>
        {position === 0 && (
          <div className="absolute inset-0 rounded-full animate-ping border-2 border-yellow-500/20 pointer-events-none" />
        )}
      </div>
      <p className="font-display font-semibold text-center text-sm mb-0.5">{user.name.split(' ').slice(-1)[0]}</p>
      <p className="text-xs text-muted-foreground text-center mb-2">{user.institution}</p>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-mono font-bold" style={{ color: CROWN_COLORS[position] }}>{user.weeklyXp} XP</span>
      </div>
      <div className={cn('mt-3 w-full rounded-t-xl flex items-center justify-center', `bg-gradient-to-t ${colors[position]} border ${borderColors[position]}`)} style={{ height: CROWN_HEIGHTS[position], minWidth: 120 }}>
        <span className="font-serif text-5xl font-bold" style={{ color: CROWN_COLORS[position] }}>#{user.rank}</span>
      </div>
    </motion.div>
  );
}

function ChangeIndicator({ change }: { change: number }) {
  if (change > 0) return <span className="flex items-center text-xs text-green-400 font-mono">↑{change}</span>;
  if (change < 0) return <span className="flex items-center text-xs text-red-400 font-mono">↓{Math.abs(change)}</span>;
  return <span className="text-xs text-muted-foreground font-mono">—</span>;
}

export default function Leaderboard() {
  const [tab, setTab] = useState(0);

  return (
    <>
      <StarFieldBg />
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src="/images/laurel-wreath.png" alt="" className="h-16 opacity-70" />
            <Heading level={1} className="text-5xl">Hall of Distinguished Scholars</Heading>
            <img src="/images/laurel-wreath.png" alt="" className="h-16 opacity-70 scale-x-[-1]" />
          </div>
          <p className="text-muted-foreground text-lg">The most dedicated reviewers in the community</p>
        </motion.div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={cn('px-4 py-2 rounded-full text-sm font-medium transition-all', tab === i ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(212,168,67,0.3)]' : 'border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground')}
            >{t}</button>
          ))}
        </div>

        <div className="flex items-end justify-center gap-4">
          {[MOCK_LEADERBOARD[1], MOCK_LEADERBOARD[0], MOCK_LEADERBOARD[2]].map((user, idx) => (
            <PodiumCard key={user.rank} user={user} position={[1,0,2][idx]} />
          ))}
        </div>

        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left px-6 py-4 text-xs font-mono text-muted-foreground uppercase">Rank</th>
                  <th className="text-left px-6 py-4 text-xs font-mono text-muted-foreground uppercase">Scholar</th>
                  <th className="text-left px-6 py-4 text-xs font-mono text-muted-foreground uppercase hidden md:table-cell">Domain</th>
                  <th className="text-right px-6 py-4 text-xs font-mono text-muted-foreground uppercase">XP</th>
                  <th className="text-right px-6 py-4 text-xs font-mono text-muted-foreground uppercase">Change</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LEADERBOARD.slice(3).map((user, i) => (
                  <motion.tr
                    key={user.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={cn('border-b border-border/20 hover:bg-primary/5 transition-colors group', (i + 1) % 3 === 0 && 'border-b border-border/40')}
                  >
                    <td className="px-6 py-4">
                      <span className="font-serif text-2xl font-bold text-muted-foreground">#{user.rank}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center font-display text-sm">{user.avatar}</div>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.institution}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell"><DomainChip domain={user.domain} /></td>
                    <td className="px-6 py-4 text-right"><span className="font-mono text-sm font-bold text-primary">{user.weeklyXp}</span></td>
                    <td className="px-6 py-4 text-right"><ChangeIndicator change={user.change} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="sticky bottom-4">
          <GlassCard className="p-4 border-primary/30">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-serif text-xl font-bold text-muted-foreground">#127</span>
                <div className="w-8 h-8 rounded-full bg-secondary border border-primary/30 flex items-center justify-center font-display text-sm">AO</div>
                <div>
                  <p className="text-sm font-medium">Your current rank · <span className="text-primary font-mono">340 XP this week</span></p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><ArrowUp size={12} className="text-green-400" />12 places from last week</p>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1 min-w-40">
                <p className="text-xs text-muted-foreground font-mono">213 XP to Top 100</p>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: '62%' }} />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
