'use client'


export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperCosmosBg } from '@/components/three/Backgrounds';
import { Heading, GlassCard, StatusBadge, DomainChip, SimpleScoreDisplay } from '@/components/ui/design-system';
import { FileText, Send, CheckCircle, Star, LayoutGrid, List, ArrowRight, ShieldCheck } from 'lucide-react';
import { usePapers, useCurrentUser } from '@/hooks/use-scholar-data';
import Link from 'next/link';

export default function AuthorDashboard() {
  const { data: user } = useCurrentUser();
  const { data: papers = [] } = usePapers();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  if (!user) return null;

  const stats = [
    { label: 'Papers Submitted', value: papers.length, icon: Send, color: 'text-blue-400' },
    { label: 'Under Review', value: papers.filter(p=>p.status==='Under Review').length, icon: FileText, color: 'text-amber-400' },
    { label: 'Published', value: papers.filter(p=>p.status==='Published').length, icon: CheckCircle, color: 'text-teal-400' },
    { label: 'Avg Review Score', value: '8.4', icon: Star, color: 'text-primary' },
  ];

  return (
    <>
      <PaperCosmosBg />
      
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
        
        {/* Header */}
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Heading level={2} className="text-4xl">Good evening, {user.name.split(' ')[1]} 👋</Heading>
            <p className="text-muted-foreground mt-2 text-lg">Here's the status of your research portfolio.</p>
          </motion.div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                </div>
                <div>
                  <h4 className="text-3xl font-display font-bold">{stat.value}</h4>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area: Papers & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Papers List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <Heading level={3}>My Papers</Heading>
              <div className="flex items-center gap-4">
                <div className="flex bg-input/50 rounded-lg p-1 border border-border">
                  <button onClick={() => setView('grid')} className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-card text-primary shadow' : 'text-muted-foreground hover:text-foreground'}`}><LayoutGrid size={16}/></button>
                  <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-card text-primary shadow' : 'text-muted-foreground hover:text-foreground'}`}><List size={16}/></button>
                </div>
                <Link href="/dashboard/author/submit" className="text-sm font-medium bg-primary/20 text-primary px-4 py-2 rounded-lg hover:bg-primary/30 transition-colors border border-primary/30 flex items-center gap-2">
                  Submit New <PlusCircle size={16} />
                </Link>
              </div>
            </div>

            <motion.div layout className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              <AnimatePresence>
                {papers.map((paper, i) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={paper.id}
                  >
                    <GlassCard className="p-5 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-3">
                        <DomainChip domain={paper.domain} />
                        <StatusBadge status={paper.status} />
                      </div>
                      <h4 className="font-display text-xl font-semibold mb-2 line-clamp-2">{paper.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{paper.abstract}</p>
                      
                      <div className="pt-4 border-t border-border/50 flex items-center justify-between mt-auto">
                        <span className="text-xs font-mono text-muted-foreground">{paper.submittedAt}</span>
                        <Link href={`/paper/${paper.id}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                          Details <ArrowRight size={14} />
                        </Link>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Activity Sidebar */}
          <div className="space-y-6">
            <Heading level={3}>Recent Activity</Heading>
            <GlassCard className="p-0 overflow-hidden">
              <div className="divide-y divide-border/50">
                {[
                  { msg: "Reviewer matched to your paper on NLP", time: "2 hours ago", icon: ShieldCheck, color: "text-teal-400" },
                  { msg: "Minor revision requested by Dr. S", time: "1 day ago", icon: FileText, color: "text-amber-400" },
                  { msg: "Paper published successfully!", time: "3 days ago", icon: Star, color: "text-primary" },
                ].map((act, i) => (
                  <div key={i} className="p-4 hover:bg-white/5 transition-colors flex gap-4">
                    <div className={`mt-1 ${act.color}`}><act.icon size={16} /></div>
                    <div>
                      <p className="text-sm font-medium">{act.msg}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </>
  );
}
// Add to imports
import { PlusCircle } from 'lucide-react';
