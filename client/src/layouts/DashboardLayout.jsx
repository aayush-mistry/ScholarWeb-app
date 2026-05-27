import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useScholarDNA } from '../context/ScholarDNAContext';
import { 
  LayoutDashboard, 
  Dna, 
  GitFork, 
  Video, 
  ShieldAlert, 
  CalendarRange, 
  Power, 
  Cpu, 
  Bell, 
  Clock, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeDNA, resetDNA } = useScholarDNA();
  
  const [collapsed, setCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Real-time system clock updater
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate global cognitive sync mastery from current DNA state
  const calculateCognitiveSync = () => {
    if (!activeDNA || !activeDNA.units) return 0;
    let totalTopics = 0;
    let totalMastery = 0;

    activeDNA.units.forEach(unit => {
      unit.topics.forEach(topic => {
        totalTopics++;
        totalMastery += topic.masteryLevel || 0;
      });
    });

    if (totalTopics === 0) return 0;
    return Math.round(totalMastery / totalTopics);
  };

  const syncMastery = calculateCognitiveSync();

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, glow: 'cyan' },
    { name: 'ScholarDNA Upload', path: '/upload', icon: Dna, glow: 'cyan' },
    { name: 'Knowledge Graph', path: '/graph', icon: GitFork, glow: 'purple' },
    { name: 'Video Analyzer', path: '/video', icon: Video, glow: 'cyan' },
    { name: 'Truth Guard', path: '/guard', icon: ShieldAlert, glow: 'amber' },
    { name: 'Exam Tracker', path: '/tracker', icon: CalendarRange, glow: 'purple' }
  ];

  return (
    <div className="min-h-screen bg-[#08090C] text-white flex overflow-hidden scanlines">
      {/* Background animated cyber grid */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0 opacity-20" />

      {/* SIDEBAR NAVIGATION DOCK */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative z-20 border-r border-cyber-border/40 bg-[#0C101B]/80 backdrop-blur-xl flex flex-col justify-between h-screen overflow-hidden select-none"
      >
        <div>
          {/* Header OS Label */}
          <div className="p-5 flex items-center justify-between border-b border-cyber-border/20">
            <div className="flex items-center space-x-3 overflow-hidden">
              <Cpu className="h-6 w-6 text-cyber-cyan animate-pulse flex-shrink-0" />
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-orbitron font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                >
                  SCHOLAR[WEB]
                </motion.span>
              )}
            </div>
            <button 
              onClick={() => setCollapsed(!collapsed)} 
              className="p-1 hover:bg-cyber-cyan/10 rounded border border-cyber-border/10 text-cyber-cyan transition-colors"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2 mt-4">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`
                    w-full flex items-center p-3 rounded-lg border transition-all duration-300 relative group
                    ${isActive 
                      ? 'bg-cyber-cyan/5 border-cyber-cyan/30 text-cyber-cyan shadow-cyan-glow' 
                      : 'border-transparent text-cyber-gray hover:text-white hover:bg-white/5 hover:border-white/5'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-cyber-cyan' : 'text-cyber-gray group-hover:text-cyber-cyan'} transition-colors`} />
                  
                  {!collapsed && (
                    <motion.span 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="ml-3 font-orbitron font-medium text-xs tracking-widest text-left"
                    >
                      {item.name}
                    </motion.span>
                  )}

                  {/* Active highlight slider pill */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabGlow"
                      className="absolute right-2 w-1.5 h-1.5 rounded-full bg-cyber-cyan" 
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User context footer */}
        <div className="p-4 border-t border-cyber-border/20 bg-[#070A12]/40">
          {activeDNA ? (
            <div className="flex flex-col space-y-3">
              {!collapsed && (
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase font-orbitron text-cyber-cyan/60 tracking-wider">Active Core</p>
                  <p className="text-xs font-semibold truncate text-cyber-white">{activeDNA.courseName}</p>
                </div>
              )}
              <button 
                onClick={resetDNA}
                className="w-full flex items-center justify-center p-2 rounded border border-red-500/20 hover:border-red-500/50 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-orbitron uppercase tracking-wider transition-all"
              >
                <Power size={14} className={collapsed ? '' : 'mr-2'} />
                {!collapsed && <span>Eject DNA</span>}
              </button>
            </div>
          ) : (
            !collapsed && (
              <p className="text-center text-[10px] text-cyber-gray/50 uppercase font-orbitron py-2">
                No DNA Synced
              </p>
            )
          )}
        </div>
      </motion.aside>

      {/* DYNAMIC SCREEN VIEWPORT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* TOP HUD NAVBAR STATUS BAR */}
        <header className="h-16 border-b border-cyber-border/40 bg-[#0C101B]/80 backdrop-blur-xl flex items-center justify-between px-6 select-none relative z-20">
          
          {/* Cognitive Sync Telemetry */}
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-cyber-gray font-orbitron uppercase tracking-widest">Cognitive Core Sync</span>
              <div className="flex items-center space-x-2 mt-0.5">
                <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${syncMastery}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                  />
                </div>
                <span className="text-xs font-bold font-orbitron text-cyber-cyan">{syncMastery}%</span>
              </div>
            </div>
          </div>

          {/* Time & Alert Indicators */}
          <div className="flex items-center space-x-6">
            {/* Alerts Center */}
            <div className="relative cursor-pointer group">
              <Bell className="h-4 w-4 text-cyber-gray hover:text-cyber-cyan transition-colors" />
              {activeDNA && (
                <span className="absolute -top-1.5 -right-1.5 h-2 w-2 rounded-full bg-cyber-amber animate-ping" />
              )}
            </div>

            {/* Futuristic Clock */}
            <div className="flex items-center space-x-2 text-cyber-gray border-l border-white/10 pl-6">
              <Clock className="h-4 w-4 text-cyber-cyan" />
              <span className="font-orbitron text-xs tracking-wider text-cyber-white">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        </header>

        {/* VIEW CONTAINER CANVAS */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="max-w-7xl mx-auto w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
