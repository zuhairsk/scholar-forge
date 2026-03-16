'use client'

import React, { useRef, useEffect } from 'react';

// ---------------------------------------------------------------------------
// Constellation (Landing Page) — CSS animated particle field
// ---------------------------------------------------------------------------
export function ConstellationBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let mouseX = 0, mouseY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = 120;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      offset: Math.random() * Math.PI * 2,
    }));

    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouse);

    let t = 0;
    const draw = () => {
      t += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx + (mouseX / canvas.width - 0.5) * -0.05;
        p.y += p.vy + Math.sin(t + p.offset) * 0.1;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212,168,67,${0.25 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212,168,67,0.7)';
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-[#0a0b0f] pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Aurora (Reviewer Dashboard) — CSS animated aurora glow
// ---------------------------------------------------------------------------
export function AuroraBg() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#0a0b0f] pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(13,148,136,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 60%, rgba(212,168,67,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 50% 80%, rgba(109,40,217,0.10) 0%, transparent 60%)',
          animation: 'aurora 8s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 40% at 70% 20%, rgba(13,148,136,0.12) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 30% 70%, rgba(212,168,67,0.08) 0%, transparent 50%)',
          animation: 'aurora 10s ease-in-out infinite alternate-reverse',
        }}
      />
      <style>{`
        @keyframes aurora {
          0% { transform: scale(1) translateX(0) translateY(0); opacity: 0.7; }
          33% { transform: scale(1.1) translateX(2%) translateY(-1%); opacity: 1; }
          66% { transform: scale(0.95) translateX(-2%) translateY(2%); opacity: 0.8; }
          100% { transform: scale(1.05) translateX(1%) translateY(1%); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Paper Cosmos (Author Dashboard) — CSS orbital animation
// ---------------------------------------------------------------------------
export function PaperCosmosBg() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#0a0b0f] pointer-events-none overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: 400, height: 400 }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#d4a843]/20 border border-[#d4a843]/30 shadow-[0_0_60px_rgba(212,168,67,0.3)]" style={{ animation: 'pulse 3s ease-in-out infinite' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0d9488]/60 shadow-[0_0_20px_rgba(13,148,136,0.5)]" style={{ animation: 'orbit1 12s linear infinite' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#3b82f6]/60 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ animation: 'orbit2 18s linear infinite' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#f59e0b]/50 shadow-[0_0_25px_rgba(245,158,11,0.4)]" style={{ animation: 'orbit3 25s linear infinite' }} />
      </div>
      <style>{`
        @keyframes orbit1 {
          from { transform: translate(-50%,-50%) rotate(0deg) translateX(140px) rotate(0deg); }
          to { transform: translate(-50%,-50%) rotate(360deg) translateX(140px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: translate(-50%,-50%) rotate(60deg) translateX(200px) rotate(-60deg); }
          to { transform: translate(-50%,-50%) rotate(420deg) translateX(200px) rotate(-420deg); }
        }
        @keyframes orbit3 {
          from { transform: translate(-50%,-50%) rotate(180deg) translateX(280px) rotate(-180deg); }
          to { transform: translate(-50%,-50%) rotate(540deg) translateX(280px) rotate(-540deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: translate(-50%,-50%) scale(1); box-shadow: 0 0 60px rgba(212,168,67,0.3); }
          50% { transform: translate(-50%,-50%) scale(1.15); box-shadow: 0 0 80px rgba(212,168,67,0.5); }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ink Drop Canvas (Review Room) — Canvas 2D ink drops
// ---------------------------------------------------------------------------
export function InkDropBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const dots: { x: number; y: number; r: number; maxR: number; alpha: number }[] = [];
    let lastDrop = 0;

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (now - lastDrop > 3000) {
        lastDrop = now;
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: 1,
          maxR: 80 + Math.random() * 120,
          alpha: 0.08,
        });
      }

      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        d.r += 0.8;
        d.alpha *= 0.995;
        if (d.r > d.maxR) { dots.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(180,170,160,${d.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const dotSize = 40;
      for (let x = 0; x < canvas.width; x += dotSize) {
        for (let y = 0; y < canvas.height; y += dotSize) {
          ctx.beginPath();
          ctx.arc(x, y, 0.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(212,168,67,0.04)';
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-[#050608] pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Star Field (Leaderboard) — Canvas 2D dense star field with shooting stars
// ---------------------------------------------------------------------------
export function StarFieldBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    const shootingStars: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = [];
    let lastShoot = 0;

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        s.x += s.speed;
        if (s.x > canvas.width) s.x = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        const gold = Math.random() > 0.8;
        ctx.fillStyle = gold ? `rgba(212,168,67,${s.opacity})` : `rgba(255,255,255,${s.opacity})`;
        ctx.fill();
      }

      if (now - lastShoot > 4000 + Math.random() * 2000) {
        lastShoot = now;
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          vx: 8 + Math.random() * 5,
          vy: 3 + Math.random() * 3,
          life: 0,
          maxLife: 40,
        });
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life++;
        if (ss.life > ss.maxLife) { shootingStars.splice(i, 1); continue; }
        const alpha = 1 - ss.life / ss.maxLife;
        const len = 30;
        const grad = ctx.createLinearGradient(ss.x - len, ss.y - len * 0.375, ss.x, ss.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(1, `rgba(255,255,255,${alpha})`);
        ctx.beginPath();
        ctx.moveTo(ss.x - len, ss.y - len * 0.375);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-[#060709] pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
