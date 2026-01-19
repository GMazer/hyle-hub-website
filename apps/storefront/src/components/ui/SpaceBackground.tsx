
import React from 'react';

export const FourPointStar: React.FC<{ className?: string, delay?: string, style?: React.CSSProperties }> = ({ className, delay, style }) => (
  <div className={`absolute animate-twinkle text-white ${className}`} style={{ animationDelay: delay, ...style }}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,1)]">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  </div>
);

export const SpaceBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050914]">
      {/* 1. Base Gradient Glows (Deep Ambient) */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-900/20 rounded-full blur-[120px] mix-blend-screen opacity-60"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen opacity-60"></div>

      {/* 2. Dot Grid Pattern (Enhanced Visibility) */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1.5px, transparent 0)',
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' // Fade out at bottom
        }}
      />
    </div>
  );
};
