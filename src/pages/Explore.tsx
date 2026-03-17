import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { GlassCard, Heading, DomainChip, StatusBadge, cn } from '@/components/ui/design-system';
import { ConstellationBg } from '@/components/three/Backgrounds';
import { Search, X, SortAsc } from 'lucide-react';
import { MOCK_PAPERS } from '@/lib/mockData';

const DOMAINS = ['All', 'Computer Science', 'Biology', 'Physics', 'Neuroscience', 'Chemistry', 'Environmental'];

export default function Explore() {
  const [query, setQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [tilt, setTilt] = useState<Record<string, { x: number; y: number }>>({});

  const filtered = MOCK_PAPERS.filter(p =>
    (activeDomain === 'All' || p.domain === activeDomain) &&
    (query === '' || p.title.toLowerCase().includes(query.toLowerCase()) || p.domain.toLowerCase().includes(query.toLowerCase()))
  );

  const handleMouseMove = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt(prev => ({ ...prev, [id]: { x, y } }));
  };

  const handleMouseLeave = (id: string) => {
    setTilt(prev => ({ ...prev, [id]: { x: 0, y: 0 } }));
  };

  return (
    <>
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0 bg-[#0a0b0f]" />
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/5 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Heading level={2} className="mb-2">Explore Research</Heading>
          <p className="text-muted-foreground">Discover cutting-edge papers across all disciplines</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search papers, authors, institutions..."
            className="w-full bg-card/80 border border-border rounded-2xl pl-14 pr-12 py-5 text-lg focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(212,168,67,0.1)] transition-all placeholder:text-muted-foreground/50"
          />
          {query && <button className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setQuery('')}><X size={20} /></button>}
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex gap-2 flex-wrap">
            {DOMAINS.map(d => (
              <button key={d} onClick={() => setActiveDomain(d)}
                className={cn('px-3 py-1.5 rounded-full text-sm transition-all', activeDomain === d ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:border-primary/50')}
              >{d}</button>
            ))}
          </div>
          <div className="sm:ml-auto flex items-center gap-2">
            <SortAsc size={16} className="text-muted-foreground" />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
            >
              {['Newest', 'Most Reviewed', 'Highest Rated', 'Trending'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((paper, i) => {
            const t = tilt[paper.id] || { x: 0, y: 0 };
            return (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  transform: `perspective(1000px) rotateX(${-t.y * 8}deg) rotateY(${t.x * 8}deg)`,
                  transition: 'transform 0.15s ease-out',
                }}
                onMouseMove={e => handleMouseMove(paper.id, e)}
                onMouseLeave={() => handleMouseLeave(paper.id)}
              >
                <Link href={`/paper/${paper.id}`}>
                  <GlassCard className="p-6 h-full relative group overflow-hidden cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="flex items-start justify-between mb-3">
                      <DomainChip domain={paper.domain} />
                      <StatusBadge status={paper.status} />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary/90 transition-colors">{paper.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{paper.abstract}</p>
                    <p className="text-xs text-muted-foreground/70 mb-4">{paper.authors.join(', ')}</p>
                    {paper.score && (
                      <div className="flex items-center gap-1 mb-4">
                        {'★★★★★'.split('').map((s, j) => (
                          <span key={j} style={{ color: j < Math.round(paper.score! / 2) ? '#d4a843' : '#4a4744' }}>★</span>
                        ))}
                        <span className="text-xs font-mono text-muted-foreground ml-1">{paper.score}</span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-center">
                      <span className="text-sm text-primary font-medium">View Paper →</span>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-muted-foreground">No papers match your search. Try a different query.</p>
          </div>
        )}
      </div>
    </>
  );
}
