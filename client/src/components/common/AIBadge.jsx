import React from 'react';
import { Sparkles } from 'lucide-react';

const badgeStyles = {
  cyan: 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/20 shadow-[0_0_18px_rgba(0,240,255,0.16)]',
  purple: 'bg-cyber-purple/10 text-cyber-purple border-cyber-purple/20 shadow-[0_0_18px_rgba(157,0,255,0.16)]',
  amber: 'bg-cyber-amber/10 text-cyber-amber border-cyber-amber/20 shadow-[0_0_18px_rgba(255,153,0,0.16)]',
};

const AIBadge = ({
  label = 'AI Insight',
  value = 'Realtime',
  variant = 'cyan',
  icon: Icon,
  className = '',
}) => {
  const VisualIcon = Icon || Sparkles;

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-[0.22em] shadow-glow ${badgeStyles[variant]} ${className}`}>
      <VisualIcon className="h-4 w-4" />
      <span>{label}</span>
      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/80">{value}</span>
    </div>
  );
};

export default AIBadge;
