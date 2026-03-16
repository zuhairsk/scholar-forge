import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DOMAIN_COLORS } from '@/lib/mockData';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------
export function Heading({ children, className, level = 2 }: { children: React.ReactNode, className?: string, level?: 1|2|3|4 }) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const sizes = {
    1: "text-5xl md:text-7xl font-bold tracking-tight text-glow",
    2: "text-3xl md:text-5xl font-semibold",
    3: "text-2xl md:text-3xl font-medium",
    4: "text-xl font-medium"
  };
  return <Tag className={cn("font-display text-foreground", sizes[level], className)}>{children}</Tag>;
}

// ---------------------------------------------------------------------------
// Cards & Containers
// ---------------------------------------------------------------------------
export const GlassCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { hoverEffect?: boolean }>(
  ({ className, hoverEffect = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-card/80 backdrop-blur-xl border border-border rounded-2xl overflow-hidden transition-all duration-300",
          hoverEffect && "hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(212,168,67,0.1)] hover:-translate-y-1",
          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = 'GlassCard';

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------
export const GoldButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'solid' | 'ghost' | 'outline' }>(
  ({ className, variant = 'solid', ...props }, ref) => {
    const base = "inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
      solid: "bg-gradient-to-r from-primary to-amber-500 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:brightness-110",
      outline: "border border-primary/50 text-primary hover:bg-primary/10 hover:border-primary",
      ghost: "text-foreground hover:text-primary hover:bg-white/5"
    };
    return (
      <button ref={ref} className={cn(base, variants[variant], className)} {...props} />
    );
  }
);
GoldButton.displayName = 'GoldButton';

// ---------------------------------------------------------------------------
// Inputs
// ---------------------------------------------------------------------------
export function FloatingInput({ label, id, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="relative group">
      <input
        id={id}
        className="w-full bg-input/50 border border-border rounded-xl px-4 pt-6 pb-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors peer"
        placeholder=" "
        {...props}
      />
      <label 
        htmlFor={id} 
        className="absolute left-4 top-4 text-muted-foreground text-sm transition-all duration-200 peer-focus:-translate-y-2.5 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none"
      >
        {label}
      </label>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Badges & Chips
// ---------------------------------------------------------------------------
export function DomainChip({ domain, className }: { domain: string, className?: string }) {
  const color = DOMAIN_COLORS[domain] || DOMAIN_COLORS['Default'];
  return (
    <span 
      className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", className)}
      style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`, color: color, borderColor: `color-mix(in srgb, ${color} 30%, transparent)` }}
    >
      {domain}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'Published': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    'Under Review': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'Submitted': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Draft': 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
    'Revision Requested': 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", colors[status] || colors['Draft'])}>
      {status}
    </span>
  );
}

export function LevelBadge({ level, name, showRing = false }: { level: number, name: string, showRing?: boolean }) {
  return (
    <div className="relative inline-flex items-center justify-center">
      {showRing && (
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-2 border border-primary/30 rounded-full border-dashed"
        />
      )}
      <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-card to-background border-2 border-primary shadow-[0_0_15px_rgba(212,168,67,0.3)]">
        <span className="text-xs text-muted-foreground font-serif">LVL</span>
        <span className="text-xl font-bold text-primary font-serif leading-none">{level}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gamification
// ---------------------------------------------------------------------------
export function XPBar({ current, max, label }: { current: number, max: number, label?: string }) {
  const percent = Math.min(100, Math.max(0, (current / max) * 100));
  return (
    <div className="w-full">
      {label && <div className="flex justify-between text-xs text-muted-foreground mb-2 font-mono"><span>{current} XP</span><span>{max} XP</span></div>}
      <div className="h-2 w-full bg-input rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary/50 to-primary relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[200%] animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Layout Helpers
// ---------------------------------------------------------------------------
export function PageTransition({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("w-full h-full", className)}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Radar Chart (Mock implementation using standard divs to save space, real recharts is complex to inline cleanly without breaking)
// ---------------------------------------------------------------------------
export function SimpleScoreDisplay({ scores }: { scores: Record<string, number> }) {
  return (
    <div className="space-y-3">
      {Object.entries(scores).map(([key, val]) => (
        <div key={key}>
          <div className="flex justify-between text-xs mb-1">
            <span className="capitalize text-muted-foreground">{key}</span>
            <span className="font-mono text-primary">{val}/10</span>
          </div>
          <div className="h-1.5 w-full bg-input rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${(val/10)*100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
