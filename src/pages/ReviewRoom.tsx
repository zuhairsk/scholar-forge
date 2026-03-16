import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { InkDropBg } from '@/components/three/Backgrounds';
import { Heading, GoldButton, GlassCard } from '@/components/ui/design-system';
import { ArrowLeft, Maximize2, FileText, CheckCircle, Zap } from 'lucide-react';
import { usePaper, useSubmitReview } from '@/hooks/use-scholar-data';
import { useToast } from '@/hooks/use-toast';

export default function ReviewRoom() {
  const [, params] = useRoute('/dashboard/reviewer/active/:id');
  const rawId = params?.id;
  const paperId = (Array.isArray(rawId) ? rawId[0] : rawId) || 'p1';
  const { data: paper } = usePaper(paperId);
  const submitReview = useSubmitReview();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState(0);
  const [scores, setScores] = useState({ clarity: 5, methodology: 5, novelty: 5, impact: 5, reproducibility: 5 });
  const [recommendation, setRecommendation] = useState<string | null>(null);

  if (!paper) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  const handleScoreChange = (key: string, val: number) => {
    setScores(prev => ({ ...prev, [key]: val }));
  };

  const getScoreColor = (val: number) => {
    if (val <= 3) return 'text-red-400';
    if (val <= 6) return 'text-amber-400';
    if (val <= 9) return 'text-teal-400';
    return 'text-primary drop-shadow-[0_0_8px_rgba(212,168,67,0.8)]';
  };

  const onSubmit = () => {
    submitReview.mutate({ paperId, scores, recommendation: recommendation as any }, {
      onSuccess: () => {
        toast({ title: "Review Submitted", description: "+50 XP Earned! Excellent work." });
        setTimeout(() => window.location.href = '/dashboard/reviewer', 1500);
      }
    });
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#050608] text-foreground flex flex-col font-sans">
      <InkDropBg />
      
      {/* Topbar */}
      <header className="h-14 border-b border-border/30 bg-background/50 backdrop-blur-md flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-px bg-border/50" />
          <h1 className="font-display font-semibold truncate max-w-md">{paper.title}</h1>
          <span className="px-2 py-0.5 text-[10px] uppercase font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded">
            68:42 Remaining
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-xs text-teal-400 font-mono"><div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"/> Autosaved</span>
          <button className="text-muted-foreground hover:text-foreground p-2 rounded hover:bg-white/5"><Maximize2 size={18} /></button>
        </div>
      </header>

      {/* Split Pane */}
      <div className="flex-1 flex overflow-hidden z-10">
        
        {/* Left: Mock PDF Viewer */}
        <div className="w-[55%] border-r border-border/30 bg-[#1a1b1e] flex flex-col relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <FileText size={120} />
          </div>
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-2xl mx-auto bg-[#e5e5e5] text-black p-12 min-h-[150%] rounded shadow-2xl opacity-90 transition-opacity hover:opacity-100">
              <h1 className="text-3xl font-bold mb-6 font-serif">{paper.title}</h1>
              <p className="mb-4"><strong>Abstract:</strong> {paper.abstract}</p>
              <div className="space-y-4 text-justify font-serif leading-relaxed">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                {/* Mock content extended to show scrolling */}
                {Array(10).fill(0).map((_, i) => (
                   <p key={i} className="mt-4">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                ))}
              </div>
            </div>
          </div>
          {/* PDF Controls */}
          <div className="h-12 bg-background/80 border-t border-border/50 flex items-center justify-center gap-4">
            <button className="text-xs font-mono hover:text-primary">← Prev</button>
            <span className="text-xs font-mono text-muted-foreground">Page 1 / 14</span>
            <button className="text-xs font-mono hover:text-primary">Next →</button>
          </div>
        </div>

        {/* Right: Review Form */}
        <div className="w-[45%] bg-background/40 backdrop-blur-xl flex flex-col relative">
          {/* Tabs */}
          <div className="flex border-b border-border/30 px-2 overflow-x-auto custom-scrollbar">
            {['Summary', 'Analysis', 'Scores', 'Verdict'].map((tab, idx) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(idx)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === idx ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === 0 && (
                <motion.div key="tab0" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="space-y-6">
                  <Heading level={3}>Executive Summary</Heading>
                  <p className="text-sm text-muted-foreground">What is the core claim of this paper in your own words?</p>
                  <textarea 
                    className="w-full h-48 bg-input/50 border border-border rounded-xl p-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                    placeholder="This paper claims that..."
                  />
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3">
                    <Zap className="text-primary shrink-0" size={18} />
                    <p className="text-xs text-primary/80 leading-relaxed">AI Hint: Based on the abstract, ensure you mention how the methodology differs from standard approaches.</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 2 && (
                <motion.div key="tab2" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="space-y-8">
                  <Heading level={3}>Quantitative Scoring</Heading>
                  {Object.entries(scores).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-2">
                        <span className="capitalize font-medium">{key}</span>
                        <span className={`font-mono font-bold ${getScoreColor(val)}`}>{val} / 10</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" value={val}
                        onChange={(e) => handleScoreChange(key, parseInt(e.target.value))}
                        className="w-full accent-primary h-2 bg-input rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  ))}
                  
                  <div className="mt-8 p-6 rounded-2xl bg-card border border-border flex items-center justify-between">
                    <span className="font-display text-xl">Overall Score</span>
                    <span className="font-display text-4xl text-primary font-bold">
                      {(Object.values(scores).reduce((a,b)=>a+b,0)/5).toFixed(1)}
                    </span>
                  </div>
                </motion.div>
              )}

              {activeTab === 3 && (
                <motion.div key="tab3" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="space-y-6">
                  <Heading level={3}>Final Recommendation</Heading>
                  <div className="grid grid-cols-1 gap-4">
                    {['Accept', 'Minor Revision', 'Major Revision', 'Reject'].map(rec => (
                      <button 
                        key={rec}
                        onClick={() => setRecommendation(rec)}
                        className={`p-4 rounded-xl border text-left transition-all ${recommendation === rec ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(212,168,67,0.15)]' : 'bg-card border-border hover:border-primary/50'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-semibold ${recommendation === rec ? 'text-primary' : ''}`}>{rec}</span>
                          {recommendation === rec && <CheckCircle className="text-primary" size={20} />}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-12">
                    <GoldButton 
                      className="w-full h-14 text-lg font-bold" 
                      disabled={!recommendation || submitReview.isPending}
                      onClick={onSubmit}
                    >
                      {submitReview.isPending ? "Finalizing..." : "Submit Review"}
                    </GoldButton>
                    <p className="text-center text-xs text-muted-foreground mt-4 font-mono">+50 XP awarded upon submission</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
