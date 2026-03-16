import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, Heading, FloatingInput, GoldButton, cn } from '@/components/ui/design-system';
import { Check, ChevronRight, ChevronLeft, Upload, Lock, FileText, Star } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const DOMAINS = ['Computer Science', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Medicine', 'Economics', 'Psychology', 'Engineering', 'Environmental Science'];
const LEVELS = [
  { level: 1, name: 'Initiate', xp: '0 XP', color: '#8b8680', features: ['Submit papers', 'Claim 2 reviews/week'] },
  { level: 2, name: 'Scholar', xp: '500 XP', color: '#a0a0a8', features: ['Priority matching', 'Review analytics'] },
  { level: 3, name: 'Fellow', xp: '1,200 XP', color: '#d4a843', features: ['XP bonuses', 'Domain badges'] },
  { level: 4, name: 'Expert', xp: '2,000 XP', color: '#f59e0b', features: ['Paid reviews', 'Featured status'] },
  { level: 5, name: 'Distinguished', xp: '3,500 XP', color: '#0d9488', features: ['Mentorship program', 'Admin tools'] },
  { level: 6, name: 'Luminary', xp: '6,000 XP', color: '#dc2626', features: ['Platform voting', 'Scholar council'] },
];

function PasswordStrength({ password }: { password: string }) {
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const colors = ['', '#dc2626', '#f59e0b', '#0d9488', '#22c55e'];
  const labels = ['', 'Weak', 'Fair', 'Strong', 'Excellent'];
  return password.length > 0 ? (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex gap-1 flex-1">{[1,2,3,4].map(i => <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{ background: i <= strength ? colors[strength] : 'rgba(255,255,255,0.1)' }} />)}</div>
      <span className="text-xs font-mono" style={{ color: colors[strength] }}>{labels[strength]}</span>
    </div>
  ) : null;
}

export default function Register() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'author' | 'reviewer' | null>(null);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [password, setPassword] = useState('');
  const [fileName, setFileName] = useState('');
  const [email] = useState('amara@mit.edu');
  const [resendTimer, setResendTimer] = useState(0);

  const direction = 1;

  const nextStep = () => setStep(s => Math.min(role === 'author' ? 3 : 4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const toggleDomain = (d: string) => {
    setSelectedDomains(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const startResend = () => {
    setResendTimer(60);
    const interval = setInterval(() => setResendTimer(t => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; }), 1000);
  };

  const steps = role === 'author' ? 3 : 4;
  const progressPct = ((step - 1) / (steps - 1)) * 100;

  return (
    <PageTransition className="min-h-screen bg-[#0a0b0f] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center mb-8">
            <Logo showSubtitle />
          </Link>
          <Heading level={2} className="mb-2">Join the Network</Heading>
          <p className="text-muted-foreground">Step {step} of {steps}</p>
        </div>

        <div className="w-full h-1.5 bg-white/5 rounded-full mb-10 overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400" animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
              <Heading level={3} className="mb-6">Who are you?</Heading>
              <div className="grid grid-cols-2 gap-4">
                <FloatingInput label="First Name" id="fn" defaultValue="Amara" />
                <FloatingInput label="Last Name" id="ln" defaultValue="Osei" />
              </div>
              <FloatingInput label="Email Address" id="reg-email" type="email" defaultValue={email} />
              <div>
                <FloatingInput label="Password" id="reg-pw" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <PasswordStrength password={password} />
              </div>
              <FloatingInput label="Confirm Password" id="reg-pw2" type="password" />
              <GoldButton className="w-full h-12 mt-4" onClick={nextStep}>Continue <ChevronRight size={16} className="ml-1" /></GoldButton>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <Heading level={3} className="mb-6">Choose your role</Heading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {[
                  { id: 'author', icon: FileText, title: 'Research Author', desc: 'Submit papers, get expert reviews, track your impact', features: ['Upload papers', 'Track reviews', 'Get insights'] },
                  { id: 'reviewer', icon: Star, title: 'Expert Reviewer', desc: 'Review papers in your domain, earn XP, get rewarded', features: ['Earn XP', 'Build reputation', 'Get paid'] },
                ].map(r => (
                  <motion.div
                    key={r.id}
                    onClick={() => setRole(r.id as 'author' | 'reviewer')}
                    animate={{ rotateY: role === r.id ? 0 : 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'relative p-6 rounded-2xl border cursor-pointer transition-all duration-300',
                      role === r.id ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(212,168,67,0.2)]' : 'border-border bg-card/60 hover:border-primary/40'
                    )}
                  >
                    {role === r.id && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check size={14} className="text-primary-foreground" />
                      </div>
                    )}
                    <r.icon size={32} className={cn('mb-4', role === r.id ? 'text-primary' : 'text-muted-foreground')} />
                    <h3 className="font-display text-xl font-semibold mb-2">{r.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{r.desc}</p>
                    <ul className="space-y-1">{r.features.map(f => <li key={f} className="text-xs text-muted-foreground flex items-center gap-2"><Check size={12} className="text-primary" />{f}</li>)}</ul>
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-4">
                <GoldButton variant="outline" className="flex-1 h-12" onClick={prevStep}><ChevronLeft size={16} className="mr-1" /> Back</GoldButton>
                <GoldButton className="flex-1 h-12" onClick={nextStep} disabled={!role}>Continue <ChevronRight size={16} className="ml-1" /></GoldButton>
              </div>
            </motion.div>
          )}

          {step === 3 && role === 'reviewer' && (
            <motion.div key="s3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
              <Heading level={3} className="mb-6">Verify your expertise</Heading>
              <FloatingInput label="Institution Name" id="institution" defaultValue="MIT" />
              <FloatingInput label="Position / Title" id="position" defaultValue="Associate Professor" />
              <div>
                <p className="text-sm font-medium mb-3 text-muted-foreground">Domain Expertise (select all that apply)</p>
                <div className="flex flex-wrap gap-2">
                  {DOMAINS.map(d => (
                    <motion.button
                      key={d}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleDomain(d)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm border transition-all duration-200',
                        selectedDomains.includes(d)
                          ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(212,168,67,0.3)]'
                          : 'bg-transparent text-muted-foreground border-border hover:border-primary/50'
                      )}
                    >
                      {d}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-3 text-muted-foreground">Upload Degree Certificate</p>
                <label className={cn(
                  'flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300',
                  fileName ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50 hover:bg-white/2'
                )}>
                  {fileName ? (
                    <div className="flex items-center gap-2 text-primary"><Check size={20} /><span className="text-sm font-mono">{fileName}</span></div>
                  ) : (
                    <div className="text-center text-muted-foreground"><Upload size={24} className="mx-auto mb-2 animate-bounce" /><p className="text-sm">Drop PDF or image here</p></div>
                  )}
                  <input type="file" className="hidden" onChange={e => setFileName(e.target.files?.[0]?.name || '')} />
                </label>
              </div>
              <div className="flex gap-4">
                <GoldButton variant="outline" className="flex-1 h-12" onClick={prevStep}><ChevronLeft size={16} className="mr-1" /> Back</GoldButton>
                <GoldButton className="flex-1 h-12" onClick={nextStep}>Continue <ChevronRight size={16} className="ml-1" /></GoldButton>
              </div>
            </motion.div>
          )}

          {step === 3 && role === 'author' && (
            <motion.div key="s3a" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6 text-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-4">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <Check size={40} className="text-primary" />
                </motion.div>
              </div>
              <Heading level={3}>You're all set!</Heading>
              <p className="text-muted-foreground">A verification email has been sent to <span className="text-primary font-mono">{email}</span></p>
              <GoldButton className="w-full h-12" onClick={() => setLocation('/dashboard/author')}>Enter Dashboard →</GoldButton>
            </motion.div>
          )}

          {step === 4 && role === 'reviewer' && (
            <motion.div key="s4" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="text-center space-y-6">
              <div className="relative mx-auto w-32 h-32">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 flex items-center justify-center text-6xl"
                >✉️</motion.div>
              </div>
              <Heading level={3}>Check your inbox</Heading>
              <p className="text-muted-foreground">We sent a verification link to <span className="text-primary font-mono">{email}</span></p>
              {resendTimer > 0
                ? <p className="text-sm text-muted-foreground font-mono">Resend in {resendTimer}s</p>
                : <button className="text-sm text-primary hover:underline" onClick={startResend}>Resend verification email</button>
              }
              <p className="text-sm text-muted-foreground"><Link href="/register" className="text-primary hover:underline" onClick={() => setStep(1)}>← Wrong email? Go back</Link></p>
              <GoldButton className="w-full h-12" onClick={() => setLocation('/dashboard/reviewer')}>I've verified my email →</GoldButton>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 border-t border-border/30 pt-6">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
