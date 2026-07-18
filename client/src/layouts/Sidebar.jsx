import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Cpu, LayoutDashboard, Dna, GitFork, Video, ShieldAlert, CalendarRange, Power, ChevronLeft, ChevronRight } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, glow: 'cyan' },
  { name: 'ScholarDNA Upload', path: '/upload', icon: Dna, glow: 'cyan' },
  { name: 'Knowledge Graph', path: '/graph', icon: GitFork, glow: 'purple' },
  { name: 'Video Analyzer', path: '/video', icon: Video, glow: 'cyan' },
  { name: 'Truth Guard', path: '/guard', icon: ShieldAlert, glow: 'amber' },
  { name: 'Exam Tracker', path: '/tracker', icon: CalendarRange, glow: 'purple' },
];

const Sidebar = ({ activeDNA, resetDNA }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className="relative z-20 border-r border-cyber-border/40 bg-[#0C101B]/80 backdrop-blur-xl flex flex-col justify-between h-screen overflow-hidden select-none transition-all duration-300" style={{ width: collapsed ? 88 : 268 }}>
      <div>
        <div className="p-5 flex items-center justify-between border-b border-cyber-border/20">
          <div className="flex items-center gap-3 overflow-hidden">
            <Cpu className="h-6 w-6 text-cyber-cyan animate-pulse flex-shrink-0" />
            {!collapsed && (
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyber-gray">SCHOLAR[WEB]</p>
                <p className="text-sm font-bold text-white">Neural Shell</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed((value) => !value)}
            className="p-1 rounded border border-cyber-border/20 bg-white/5 text-cyber-cyan hover:bg-cyber-cyan/10 transition"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-cyber-cyan/15 to-cyber-purple/5 border-cyber-cyan/20 text-white shadow-cyan-glow' : 'border-transparent text-cyber-gray hover:bg-white/5 hover:text-white hover:border-white/10'}`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-cyber-cyan animate-pulse' : 'text-cyber-gray'}`} />
                {!collapsed && <span className={`text-xs font-semibold tracking-[0.18em] uppercase ${isActive ? 'text-cyber-cyan' : ''}`}>{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-cyber-border/20 bg-[#070A12]/40">
        <GlassCard glowColor="cyan" className="p-4 bg-[#0A101E]/90 border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.28em] text-cyber-gray">Active Core</p>
              <p className="truncate text-sm font-semibold text-white">{activeDNA?.courseName || 'No DNA Synced'}</p>
            </div>
            <button
              onClick={resetDNA}
              className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] text-red-300 transition hover:bg-red-500/15"
            >
              Eject
            </button>
          </div>
        </GlassCard>
      </div>
    </aside>
  );
};

export default Sidebar;
