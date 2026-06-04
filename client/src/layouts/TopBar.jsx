import React from 'react';
import { Bell, Clock, Sparkles } from 'lucide-react';
import AIBadge from '../components/common/AIBadge';

const TopBar = ({ syncMastery, activeDNA, currentTime }) => {
  return (
    <header className="h-16 border-b border-cyber-border/40 bg-[#0C101B]/80 backdrop-blur-xl flex items-center justify-between px-6 select-none relative z-20">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-cyber-gray">Cognitive Core Sync</p>
          <div className="mt-2 w-44 overflow-hidden rounded-full border border-white/10 bg-white/5">
            <div className="h-2 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple transition-all duration-700" style={{ width: `${syncMastery}%` }} />
          </div>
        </div>
        <AIBadge label="Neural Assist" value={`${syncMastery}%`} variant="cyan" className="hidden sm:inline-flex" />
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <Bell className="h-4 w-4 text-cyber-gray transition-colors group-hover:text-cyber-cyan" />
          {activeDNA && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-cyber-amber animate-ping" />}
        </div>
        <div className="flex items-center gap-2 text-cyber-gray border-l border-white/10 pl-5">
          <Clock className="h-4 w-4 text-cyber-cyan" />
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
