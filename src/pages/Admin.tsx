import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Heading, StatusBadge, cn } from '@/components/ui/design-system';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, CheckCircle, Clock, DollarSign, Check, X, Eye } from 'lucide-react';

const COLORS = ['#3b82f6', '#0d9488', '#d4a843', '#9333ea', '#ec4899', '#f59e0b'];

const lineData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  papers: Math.floor(Math.random() * 20 + 5),
}));

const barData = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'].map(w => ({
  week: w,
  reviews: Math.floor(Math.random() * 80 + 30),
}));

const domainData = [
  { name: 'CS', value: 38 },
  { name: 'Biology', value: 24 },
  { name: 'Physics', value: 18 },
  { name: 'Neuroscience', value: 10 },
  { name: 'Chemistry', value: 10 },
];

const VERIF_QUEUE = [
  { id: 1, name: 'Dr. Liu Wei', institution: 'Tsinghua University', position: 'Associate Prof.', domain: 'Physics', applied: '2025-01-18', status: 'pending' },
  { id: 2, name: 'Dr. Maya Patel', institution: 'Cambridge', position: 'Postdoc', domain: 'Biology', applied: '2025-01-17', status: 'pending' },
  { id: 3, name: 'Prof. André Simon', institution: 'École Polytechnique', position: 'Professor', domain: 'Mathematics', applied: '2025-01-15', status: 'pending' },
];

const RECENT_PAPERS = [
  { id: 1, title: 'Quantum Error Correction via Neural Decoding', author: 'H. Mueller', domain: 'Physics', status: 'Under Review', reviews: 1 },
  { id: 2, title: 'CRISPR Applications in Crop Engineering', author: 'Dr. N. Kimura', domain: 'Biology', status: 'Published', reviews: 3 },
  { id: 3, title: 'Differential Privacy in Federated NLP', author: 'James Chen', domain: 'CS', status: 'Submitted', reviews: 0 },
];

const tooltipStyle = { background: '#13151d', border: '1px solid rgba(13,148,136,0.2)', borderRadius: 8, color: '#f0ece3', fontSize: 12 };

const activityData = Array.from({ length: 7 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => ({ week, day, count: Math.floor(Math.random() * 10) }))
).flat();

function ActivityHeatmap() {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 7 }, (_, d) => (
        <div key={d} className="flex flex-col gap-1">
          {Array.from({ length: 7 }, (_, w) => {
            const item = activityData.find(a => a.week === w && a.day === d);
            const intensity = item ? item.count / 10 : 0;
            return (
              <div key={w} title={`${item?.count || 0} reviews`} className="w-4 h-4 rounded-sm transition-all hover:scale-110"
                style={{ background: `rgba(13,148,136,${0.05 + intensity * 0.8})` }} />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function Admin() {
  const [approvals, setApprovals] = useState<Record<number, 'approved' | 'rejected'>>({});

  return (
    <>
      <div className="fixed inset-0 z-[-1] bg-[#0a0b0f]">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/10 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Heading level={2} className="mb-1 text-teal-400">Admin Dashboard</Heading>
          <p className="text-muted-foreground font-mono text-sm">Platform overview · ScholarForge Admin</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Users', value: '3,248', icon: Users, delta: '+12 today' },
            { label: 'Papers Today', value: '34', icon: FileText, delta: '+8 from yesterday' },
            { label: 'Reviews Today', value: '127', icon: CheckCircle, delta: '+22 from yesterday' },
            { label: 'Avg Response', value: '41h', icon: Clock, delta: '-3h from last week' },
            { label: 'Monthly Revenue', value: '$8,420', icon: DollarSign, delta: '+$340 this month' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <GlassCard className="p-4 border-teal-500/20 hover:border-teal-500/40">
                <s.icon size={18} className="text-teal-400 mb-2" />
                <p className="text-2xl font-bold font-display text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xs text-teal-400 mt-1 font-mono">{s.delta}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <GlassCard className="p-5 lg:col-span-2">
            <h3 className="font-display font-semibold mb-4 text-teal-400">Papers Submitted (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <XAxis dataKey="day" tick={{ fill: '#8b8680', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#8b8680', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="papers" stroke="#0d9488" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard className="p-5 flex flex-col items-center">
            <h3 className="font-display font-semibold mb-4 text-teal-400 self-start">By Domain</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={domainData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {domainData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2">
              {domainData.map((d, i) => <span key={d.name} className="flex items-center gap-1 text-xs text-muted-foreground"><span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />{d.name} {d.value}%</span>)}
            </div>
          </GlassCard>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <GlassCard className="p-5">
            <h3 className="font-display font-semibold mb-4 text-teal-400">Reviews Per Week</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={barData}>
                <XAxis dataKey="week" tick={{ fill: '#8b8680', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#8b8680', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="reviews" fill="#0d9488" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="font-display font-semibold mb-4 text-teal-400">Reviewer Activity (Last 7 Weeks)</h3>
            <ActivityHeatmap />
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs text-muted-foreground">Less</span>
              {[0.05, 0.25, 0.45, 0.65, 0.85].map(i => <div key={i} className="w-3 h-3 rounded-sm" style={{ background: `rgba(13,148,136,${i})` }} />)}
              <span className="text-xs text-muted-foreground">More</span>
            </div>
          </GlassCard>
        </div>

        <GlassCard>
          <div className="p-5 border-b border-border/30 flex items-center justify-between">
            <h3 className="font-display font-semibold text-teal-400">Pending Verifications</h3>
            <span className="px-2 py-0.5 bg-teal-500/20 text-teal-400 text-xs rounded-full border border-teal-500/30">{VERIF_QUEUE.filter(v => !approvals[v.id]).length} pending</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border/30">{['Name', 'Institution', 'Position', 'Domain', 'Applied', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-mono text-muted-foreground uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {VERIF_QUEUE.map(v => {
                  const status = approvals[v.id];
                  return (
                    <motion.tr key={v.id} layout animate={{ opacity: status ? 0.4 : 1 }} className="border-b border-border/20 hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-xs">{v.name.split(' ').map(w=>w[0]).join('')}</div><span className="text-sm font-medium">{v.name}</span></div></td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{v.institution}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{v.position}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{v.domain}</td>
                      <td className="px-5 py-4 text-xs font-mono text-muted-foreground">{v.applied}</td>
                      <td className="px-5 py-4">
                        {status ? (
                          <span className={cn('text-xs font-mono px-2 py-1 rounded-full', status === 'approved' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10')}>
                            {status}
                          </span>
                        ) : (
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1 px-3 py-1.5 bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs rounded-lg hover:bg-teal-500/20 transition-colors" onClick={() => setApprovals(p => ({ ...p, [v.id]: 'approved' }))}>
                              <Check size={12} /> Approve
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg hover:bg-red-500/20 transition-colors" onClick={() => setApprovals(p => ({ ...p, [v.id]: 'rejected' }))}>
                              <X size={12} /> Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-5 border-b border-border/30">
            <h3 className="font-display font-semibold text-teal-400">Recent Papers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border/30">{['Title', 'Author', 'Domain', 'Status', 'Reviews', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-mono text-muted-foreground uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {RECENT_PAPERS.map((p, i) => (
                  <tr key={p.id} className={cn('border-b border-border/20 hover:bg-white/2 transition-colors', i % 3 === 2 && 'border-border/40')}>
                    <td className="px-5 py-4 text-sm font-medium max-w-xs truncate">{p.title}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{p.author}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{p.domain}</td>
                    <td className="px-5 py-4"><StatusBadge status={p.status as any} /></td>
                    <td className="px-5 py-4 text-sm font-mono text-muted-foreground">{p.reviews}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button className="text-xs text-teal-400 hover:underline">Assign</button>
                        <button className="text-xs text-primary hover:underline">Feature</button>
                        <button className="text-xs text-red-400 hover:underline">Flag</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
