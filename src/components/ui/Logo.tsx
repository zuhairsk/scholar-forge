import React from 'react';

export function LogoIcon() {
  return (
    <div style={{
      width: 48,
      height: 48,
      borderRadius: 12,
      background: 'linear-gradient(135deg, #0a0b0f 0%, #1a1c24 100%)',
      border: '1.5px solid rgba(212,168,67,0.6)',
      boxShadow: '0 0 16px rgba(212,168,67,0.25), inset 0 1px 0 rgba(212,168,67,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      <div style={{ position: 'absolute', top: 4, left: 4, width: 6, height: 6, borderTop: '1.5px solid #d4a843', borderLeft: '1.5px solid #d4a843' }} />
      <div style={{ position: 'absolute', bottom: 4, right: 4, width: 6, height: 6, borderBottom: '1.5px solid #d4a843', borderRight: '1.5px solid #d4a843' }} />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 6C12 6 8 4 4 4v14c4 0 8 2 8 2s4-2 8-2V4c-4 0-8 2-8 2z" stroke="#d4a843" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(212,168,67,0.08)" />
        <path d="M12 6v14" stroke="#d4a843" strokeWidth="1.5" />
        <path d="M7 8.5c1.5 0 3 0.3 4 0.8" stroke="#d4a843" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <path d="M7 11c1.5 0 3 0.3 4 0.8" stroke="#d4a843" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <path d="M17 8.5c-1.5 0-3 0.3-4 0.8" stroke="#d4a843" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <path d="M17 11c-1.5 0-3 0.3-4 0.8" stroke="#d4a843" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      </svg>
      <div style={{ position: 'absolute', top: 6, right: 7, width: 3, height: 3, borderRadius: '50%', background: '#d4a843', boxShadow: '0 0 4px #d4a843' }} />
    </div>
  );
}

export function LogoWordmark({ showSubtitle = false }: { showSubtitle?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1 }}>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 20, letterSpacing: '-0.01em' }}>
        <span style={{ color: '#f0ece3' }}>Scholar</span><span style={{ color: '#d4a843' }}>Forge</span>
      </span>
      {showSubtitle && (
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: '0.2em', color: 'rgba(212,168,67,0.5)', marginTop: 2 }}>
          OPEN SCIENCE
        </span>
      )}
    </div>
  );
}

export function Logo({ showSubtitle = false, compact = false }: { showSubtitle?: boolean; compact?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 10 : 12 }}>
      <LogoIcon />
      {!compact && <LogoWordmark showSubtitle={showSubtitle} />}
    </div>
  );
}
