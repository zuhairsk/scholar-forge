import React, { useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, Heading, FloatingInput, GoldButton, cn } from '@/components/ui/design-system';
import { useDropzone } from 'react-dropzone';
import { Upload, Check, ChevronRight, ChevronLeft, X, Rocket } from 'lucide-react';

const DOMAINS = ['Computer Science', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Medicine', 'Economics', 'Psychology', 'Engineering', 'Environmental Science'];

export default function Submit() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [tags, setTags] = useState<string[]>(['Deep Learning', 'Attention']);
  const [tagInput, setTagInput] = useState('');
  const [coAuthors, setCoAuthors] = useState<string[]>([]);
  const [coInput, setCoInput] = useState('');
  const [reviewers, setReviewers] = useState(2);
  const [timeline, setTimeline] = useState('Standard');
  const [anonymous, setAnonymous] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      let prog = 0;
      const interval = setInterval(() => {
        prog += 8;
        setUploadProgress(Math.min(prog, 100));
        if (prog >= 100) {
          clearInterval(interval);
          setAiLoading(true);
          setTimeout(() => { setAiLoading(false); setAiDone(true); }, 2500);
        }
      }, 120);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1 });

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const addCoAuthor = () => {
    if (coInput.trim()) {
      setCoAuthors(prev => [...prev, coInput.trim()]);
      setCoInput('');
    }
  };

  const steps = 3;
  const prog = ((step - 1) / (steps - 1)) * 100;

  return (
    <>
      <div className="fixed inset-0 z-[-1] bg-[#0a0b0f]" />

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Heading level={2} className="mb-2">Submit Research Paper</Heading>
          <p className="text-muted-foreground">Step {step} of {steps}</p>
        </motion.div>

        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full" animate={{ width: `${prog}%` }} transition={{ duration: 0.5 }} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
              <GlassCard>
                <div
                  {...getRootProps()}
                  className={cn(
                    'min-h-64 flex flex-col items-center justify-center gap-4 p-10 cursor-pointer transition-all duration-300 rounded-2xl border-2 border-dashed',
                    isDragActive ? 'border-primary bg-primary/10' : file ? 'border-green-500/50 bg-green-500/5' : 'border-border/50 hover:border-primary/50 hover:bg-white/2'
                  )}
                >
                  <input {...getInputProps()} />
                  {file ? (
                    <>
                      <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                        <Check size={28} className="text-green-400" />
                      </div>
                      <p className="font-mono text-sm text-green-400">{file.name}</p>
                      {uploadProgress < 100 && (
                        <div className="w-full max-w-xs">
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${uploadProgress}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground text-center mt-1 font-mono">{uploadProgress}%</p>
                        </div>
                      )}
                      {aiLoading && (
                        <p className="text-sm text-primary font-mono animate-pulse">AI is extracting details<span className="animate-bounce">...</span></p>
                      )}
                      {aiDone && (
                        <p className="text-sm text-green-400">✓ Details extracted successfully</p>
                      )}
                    </>
                  ) : (
                    <>
                      <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <Upload size={40} className="text-primary/60" />
                      </motion.div>
                      <div className="text-center">
                        <p className="font-medium text-foreground">{isDragActive ? 'Drop it here!' : 'Drag your PDF here or click to browse'}</p>
                        <p className="text-sm text-muted-foreground mt-1">Maximum 50MB · PDF format</p>
                      </div>
                    </>
                  )}
                </div>
              </GlassCard>
              <GoldButton className="w-full h-12" disabled={!aiDone} onClick={() => setStep(2)}>
                Continue to Details <ChevronRight size={16} className="ml-1" />
              </GoldButton>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
              <GlassCard className="p-6 space-y-4">
                <h3 className="font-display text-lg font-semibold">Paper Details</h3>
                <FloatingInput label="Title" id="title" defaultValue="Attention Mechanisms in Multi-Modal Learning" />
                <div className="relative">
                  <textarea
                    className="w-full bg-input/50 border border-border rounded-xl px-4 pt-8 pb-3 text-foreground focus:outline-none focus:border-primary transition-colors min-h-32 resize-none"
                    defaultValue="We introduce a novel attention mechanism that dynamically weights modalities based on contextual relevance, achieving state-of-the-art performance across multiple benchmarks."
                  />
                  <label className="absolute left-4 top-3 text-xs text-muted-foreground">Abstract</label>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Domain</label>
                  <select className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors">
                    {DOMAINS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Tags (press Enter to add)</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-input/30 border border-border rounded-xl min-h-12">
                    {tags.map(t => (
                      <span key={t} className="flex items-center gap-1 px-2 py-1 bg-primary/20 border border-primary/30 rounded-full text-xs text-primary">
                        {t}<button onClick={() => setTags(prev => prev.filter(x => x !== t))}><X size={10} /></button>
                      </span>
                    ))}
                    <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Add tag..." className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/40 min-w-20" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Co-Authors</label>
                  <div className="flex gap-2">
                    <input value={coInput} onChange={e => setCoInput(e.target.value)} placeholder="email@university.edu" className="flex-1 bg-input/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors" />
                    <button onClick={addCoAuthor} className="px-4 py-2.5 border border-border rounded-xl text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-all">+ Add</button>
                  </div>
                  {coAuthors.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {coAuthors.map(ca => (
                        <span key={ca} className="flex items-center gap-1 px-2 py-1 bg-secondary border border-border rounded-full text-xs text-muted-foreground">
                          {ca}<button onClick={() => setCoAuthors(prev => prev.filter(x => x !== ca))}><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </GlassCard>
              <div className="flex gap-4">
                <GoldButton variant="outline" className="flex-1 h-12" onClick={() => setStep(1)}><ChevronLeft size={16} className="mr-1" /> Back</GoldButton>
                <GoldButton className="flex-1 h-12" onClick={() => setStep(3)}>Review Preferences <ChevronRight size={16} className="ml-1" /></GoldButton>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
              <GlassCard className="p-6 space-y-6">
                <h3 className="font-display text-lg font-semibold">Review Preferences</h3>
                <div>
                  <label className="text-sm text-muted-foreground block mb-3">Number of Reviewers: <span className="text-primary font-bold">{reviewers}</span></label>
                  <input type="range" min={1} max={3} value={reviewers} onChange={e => setReviewers(+e.target.value)}
                    className="w-full accent-primary cursor-pointer" />
                  <div className="flex justify-between text-xs font-mono text-muted-foreground mt-1"><span>1</span><span>2</span><span>3</span></div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-3">Review Timeline</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ id: 'Standard', time: '72 hours', featured: false }, { id: 'Express', time: '24 hours', featured: true }, { id: 'Flexible', time: '7 days', featured: false }].map(t => (
                      <div key={t.id} onClick={() => setTimeline(t.id)}
                        className={cn('p-3 rounded-xl border cursor-pointer transition-all text-center relative', timeline === t.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30')}>
                        {t.featured && <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] rounded-full">Recommended</span>}
                        <p className="font-medium text-sm">{t.id}</p>
                        <p className="text-xs text-muted-foreground">{t.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/3 rounded-xl">
                  <div>
                    <p className="text-sm font-medium">Anonymous Submission</p>
                    <p className="text-xs text-muted-foreground">Reviewers won't see your name</p>
                  </div>
                  <button onClick={() => setAnonymous(!anonymous)} className={cn('w-12 h-6 rounded-full transition-all relative', anonymous ? 'bg-primary' : 'bg-white/10')}>
                    <div className={cn('absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow', anonymous ? 'left-7' : 'left-1')} />
                  </button>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 accent-primary" defaultChecked />
                  <span className="text-sm text-muted-foreground">I confirm this is original work and I have the rights to submit it. I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a>.</span>
                </label>
              </GlassCard>
              <div className="flex gap-4">
                <GoldButton variant="outline" className="flex-1 h-12" onClick={() => setStep(2)}><ChevronLeft size={16} className="mr-1" /> Back</GoldButton>
                <GoldButton className="flex-1 h-14 text-base" onClick={() => setLocation('/dashboard/author')}>
                  Submit for Review <Rocket size={18} className="ml-2" />
                </GoldButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
