'use client'


export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassCard, Heading, DomainChip, StatusBadge, cn } from '@/components/ui/design-system';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { MOCK_PAPERS, MOCK_REVIEWS } from '@/lib/mockData';
import { ArrowLeft, Download, Share2, BookOpen, Clock, Copy, Check } from 'lucide-react';

const RELATED = ['Attention Mechanisms in Multi-Modal Learning', 'Neural Correlates of Decision Making', 'Federated Learning for Privacy-Preserving NLP'].slice(0, 3);

function ReviewCard({ review }: { review: typeof MOCK_REVIEWS[0] }) {
  const [expanded, setExpanded] = useState(false);
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);

  const scoreData = Object.entries(review.scores).map(([k, v]) => ({
    subject: k.charAt(0).toUpperCase() + k.slice(1),
    value: v,
  }));

  const recColors = {
    'Accept': 'text-green-400 bg-green-400/10 border-green-400/30',
    'Minor Revision': 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    'Major Revision': 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    'Reject': 'text-red-400 bg-red-400/10 border-red-400/30',
  };

  return (
    <GlassCard className="p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary border border-primary/30 flex items-center justify-center font-display text-sm text-primary">
            R{review.id}
          </div>
          <div>
            <p className="font-medium text-sm">Anonymous Reviewer</p>
            <p className="text-xs font-mono text-muted-foreground">{review.date}</p>
          </div>
        </div>
        <span className={cn('px-3 py-1 rounded-full text-xs border font-medium', recColors[review.recommendation])}>
          {review.recommendation}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1">
        {Object.entries(review.scores).map(([key, val]) => (
          <div key={key} className="flex flex-col items-center gap-1">
            <div className="w-full h-16 bg-white/5 rounded relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 bg-primary/60 transition-all" style={{ height: `${(val / 10) * 100}%` }} />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground capitalize">{key.slice(0,3)}</span>
            <span className="text-xs font-bold text-primary">{val}</span>
          </div>
        ))}
      </div>

      <div>
        <p className={cn('text-sm text-muted-foreground leading-relaxed', !expanded && 'line-clamp-3')}>{review.summary}</p>
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary mt-2 hover:underline">
          {expanded ? 'Show less' : 'Read more'}
        </button>
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-border/30">
        <span className="text-xs text-muted-foreground">Was this review helpful?</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setVoted(voted === 'up' ? null : 'up')} className={cn('flex items-center gap-1 text-sm px-2 py-1 rounded transition-colors', voted === 'up' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary')}>
            👍 {review.helpfulVotes + (voted === 'up' ? 1 : 0)}
          </button>
          <button onClick={() => setVoted(voted === 'down' ? null : 'down')} className={cn('text-sm px-2 py-1 rounded transition-colors', voted === 'down' ? 'text-red-400 bg-red-400/10' : 'text-muted-foreground hover:text-red-400')}>
            👎
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

function CiteButton({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className={cn('flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all', copied ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground')}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {label}
    </button>
  );
}

export default function PaperDetail() {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const paper = MOCK_PAPERS.find(p => p.id === params.id) || MOCK_PAPERS[0];
  const reviews = MOCK_REVIEWS.filter(r => r.paperId === paper.id);

  const radarData = [
    { subject: 'Clarity', A: 8.5 },
    { subject: 'Methodology', A: 9.0 },
    { subject: 'Novelty', A: 8.0 },
    { subject: 'Impact', A: 8.8 },
    { subject: 'Reproducibility', A: 8.2 },
  ];

  const tabs = ['Overview', `Reviews (${reviews.length})`, 'Related Papers'];

  return (
    <>
      <div className="fixed inset-0 z-[-1] bg-[#0a0b0f]">
        <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-primary/8 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back to Explore
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <DomainChip domain={paper.domain} />
            <StatusBadge status={paper.status} />
          </div>
          <Heading level={1} className="text-4xl md:text-5xl leading-tight">{paper.title}</Heading>
          <div className="flex items-center gap-3 flex-wrap">
            {paper.authors.map(a => (
              <div key={a} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-secondary border border-primary/30 flex items-center justify-center text-xs font-display">{a.split(' ').map(w => w[0]).join('')}</div>
                <span className="text-sm text-muted-foreground">{a}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 text-xs font-mono text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><Clock size={12} />{paper.readTime} min read</span>
            <span className="flex items-center gap-1"><Download size={12} />{paper.downloads} downloads</span>
            <span>Submitted {paper.submittedAt}</span>
          </div>
        </motion.div>

        <div className="flex gap-1 border-b border-border/50">
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setActiveTab(i)}
              className={cn('px-5 py-3 text-sm font-medium transition-colors relative', activeTab === i ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}
            >
              {t}
              {activeTab === i && <motion.div layoutId="paper-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          ))}
        </div>

        {activeTab === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <GlassCard className="p-6">
                <h3 className="font-display text-lg font-semibold mb-4">Abstract</h3>
                <p className="text-muted-foreground leading-relaxed">{paper.abstract} This paper presents a comprehensive analysis with rigorous experimental validation across multiple datasets and baseline comparisons. Our approach demonstrates significant improvements in both accuracy and computational efficiency, paving the way for future research in this domain.</p>
              </GlassCard>
              <GlassCard className="p-6">
                <h3 className="font-display text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {paper.tags.map(t => <span key={t} className="px-3 py-1 rounded-full bg-secondary/50 border border-border text-sm text-muted-foreground">{t}</span>)}
                </div>
              </GlassCard>
              <GlassCard className="p-6">
                <h3 className="font-display text-lg font-semibold mb-4">Cite this Paper</h3>
                <div className="flex gap-3 flex-wrap">
                  <CiteButton label="BibTeX" text={`@article{${paper.id},\n  title={${paper.title}},\n  author={${paper.authors.join(' and ')}},\n  year={2025}\n}`} />
                  <CiteButton label="APA" text={`${paper.authors.join(', ')} (2025). ${paper.title}.`} />
                  <CiteButton label="MLA" text={`${paper.authors.join(', ')}. "${paper.title}." 2025.`} />
                </div>
              </GlassCard>
            </div>
            <div>
              <GlassCard className="p-6">
                <h3 className="font-display text-lg font-semibold mb-4">Review Scores</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(212,168,67,0.15)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b8680', fontSize: 11 }} />
                    <Radar dataKey="A" stroke="#d4a843" fill="#d4a843" fillOpacity={0.25} strokeWidth={2} />
                    <Tooltip contentStyle={{ background: '#13151d', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 8 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {activeTab === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {reviews.length > 0 ? reviews.map(r => <ReviewCard key={r.id} review={r} />) : (
              <GlassCard className="p-12 text-center">
                <BookOpen size={40} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reviews yet. Be the first to review this paper.</p>
              </GlassCard>
            )}
          </motion.div>
        )}

        {activeTab === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_PAPERS.filter(p => p.id !== paper.id).slice(0, 6).map(p => (
                <Link key={p.id} href={`/paper/${p.id}`}>
                  <GlassCard className="p-4 hover:border-primary/40 transition-all cursor-pointer group">
                    <DomainChip domain={p.domain} />
                    <p className="font-display font-semibold text-sm mt-2 mb-1 line-clamp-2 group-hover:text-primary transition-colors">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.authors[0]}</p>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
