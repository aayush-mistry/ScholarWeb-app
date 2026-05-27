import React from 'react';
import { useScholarDNA } from '../context/ScholarDNAContext';
import GlassCard from '../components/common/GlassCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Dna, 
  GitFork, 
  Video, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Terminal,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Zap,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { activeDNA } = useScholarDNA();
  const navigate = useNavigate();

  // Find dynamic prioritized nodes based on high importance & low mastery
  const getPrioritizedStudyPlan = () => {
    if (!activeDNA || !activeDNA.units) return [];
    let priorityNodes = [];
    activeDNA.units.forEach(unit => {
      unit.topics.forEach(topic => {
        if (topic.masteryLevel < 70) {
          priorityNodes.push({
            ...topic,
            unitTitle: unit.title
          });
        }
      });
    });

    // Sort by importance (high first) and mastery (lowest first)
    return priorityNodes.sort((a, b) => {
      if (a.importance === 'high' && b.importance !== 'high') return -1;
      if (a.importance !== 'high' && b.importance === 'high') return 1;
      return a.masteryLevel - b.masteryLevel;
    }).slice(0, 3);
  };

  const prioritizedNodes = getPrioritizedStudyPlan();

  return (
    <div className="space-y-8 select-none">
      {/* HUD GREETING BLOCK */}
      <div className="border-b border-cyber-border/20 pb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-orbitron font-extrabold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple">
            SCHOLARWEB HUD // SYSTEM CORE
          </h1>
          <p className="text-xs text-cyber-gray mt-1 uppercase tracking-wider">
            AI-powered educational operating system active. Neural cognitive sync operational.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2 text-[10px] uppercase font-orbitron border border-cyber-cyan/30 px-3 py-1.5 rounded bg-cyber-cyan/5 text-cyber-cyan">
          <BrainCircuit size={14} className="animate-pulse" />
          <span>Cognitive Engine Synced</span>
        </div>
      </div>

      {activeDNA ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          
          {/* COLUMN 1: TELEMETRY RADAR DIAL */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard glowColor="cyan" hoverScale={false}>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-cyber-cyan/15 pb-2">
                  <span className="text-[10px] uppercase font-orbitron text-cyber-cyan/60 tracking-wider">Cognitive Telemetry</span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Terminal size={14} className="text-cyber-cyan" />
                  </motion.div>
                </div>

                {/* Cybernetic Dial Graphic */}
                <div className="flex flex-col items-center justify-center py-6 relative">
                  <div className="relative h-40 w-40 flex items-center justify-center">
                    {/* Ring background */}
                    <div className="absolute inset-0 rounded-full border-[8px] border-white/5" />
                    {/* Glowing Accent Arc */}
                    <motion.div 
                      className="absolute inset-0 rounded-full border-[8px] border-t-cyber-cyan border-r-cyber-purple border-b-transparent border-l-transparent opacity-80"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Inner pulsing ring */}
                    <motion.div 
                      className="absolute inset-4 rounded-full border-2 border-cyber-cyan/30"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    <div className="text-center">
                      <span className="text-[9px] uppercase font-orbitron text-cyber-gray block tracking-widest">Global Master</span>
                      <motion.span 
                        className="text-3xl font-extrabold font-orbitron text-cyber-cyan"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        {Math.round(activeDNA.units?.reduce((acc, u) => acc + u.topics?.reduce((a, t) => a + t.masteryLevel, 0), 0) / activeDNA.units?.reduce((acc, u) => acc + u.topics?.length, 0)) || 0}%
                      </motion.span>
                    </div>
                  </div>
                </div>

                {/* Telemetry log outputs */}
                <div className="space-y-2 text-[10px] font-orbitron text-cyber-gray bg-black/40 p-3 rounded border border-white/5">
                  <div className="flex justify-between items-center">
                    <span>[SYS STATUS]</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-cyber-cyan">SYNC ACTIVE</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>[INTEGRITY SCORE]</span>
                    <span className="text-cyber-cyan">100% VALIDATED</span>
                  </div>
                  <div className="flex justify-between">
                    <span>[NEURAL ENTRANCE]</span>
                    <span className="text-cyber-purple">GEMINI FLASH-1.5</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Exam Countdown Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <GlassCard glowColor="purple" hoverScale={true} onClick={() => navigate('/tracker')} className="cursor-pointer btn-cyber">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-cyber-purple border-b border-cyber-purple/10 pb-2">
                    <span className="text-[10px] uppercase font-orbitron text-cyber-purple/60 tracking-wider">Exam countdown</span>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Calendar size={14} />
                    </motion.div>
                  </div>
                  {activeDNA.targetExamDate ? (
                    <div>
                      <motion.h3 
                        className="text-2xl font-bold font-orbitron text-cyber-white"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        {Math.ceil((new Date(activeDNA.targetExamDate) - new Date()) / (1000 * 60 * 60 * 24))} Days
                      </motion.h3>
                      <p className="text-[10px] text-cyber-gray mt-1 uppercase tracking-wider font-orbitron">
                        Remaining until Midterm exam target
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-bold font-orbitron text-cyber-white">No Date Synced</h3>
                      <p className="text-[10px] text-cyber-gray mt-1 uppercase tracking-wider font-orbitron">
                        Configure exam tracker targets in schedule panel
                      </p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* COLUMN 2 & 3: REVISION PLANNER & MODULE ACCENTS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Active Study Deck */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard glowColor="cyan" hoverScale={false}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-cyber-cyan border-b border-cyber-cyan/15 pb-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={16} />
                    </motion.div>
                    <h3 className="font-orbitron font-bold text-xs uppercase tracking-wider">AI revision priority queue</h3>
                  </div>

                  {prioritizedNodes.length > 0 ? (
                    <div className="space-y-3">
                      {prioritizedNodes.map((node, index) => (
                        <motion.div 
                          key={node.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between hover:border-cyber-cyan/30 hover:bg-cyber-cyan/5 transition-all cursor-pointer group hover-lift"
                          onClick={() => navigate('/upload')}
                        >
                          <div>
                            <span className="text-[8px] uppercase font-orbitron text-cyber-purple tracking-widest">{node.unitTitle}</span>
                            <h4 className="font-orbitron font-bold text-xs uppercase text-cyber-white group-hover:text-cyber-cyan transition-colors mt-0.5">{node.title}</h4>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <span className="text-[9px] uppercase font-orbitron text-cyber-gray block">Mastery</span>
                              <span className="text-xs font-bold text-cyber-cyan font-orbitron">{node.masteryLevel}%</span>
                            </div>
                            <motion.div
                              className="text-cyber-gray group-hover:text-cyber-cyan transition-colors"
                              whileHover={{ x: 5 }}
                            >
                              <ChevronRight size={14} />
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-6 text-center text-cyber-gray/60 font-orbitron text-xs"
                    >
                      🎉 Excellent! All syllabus nodes mastered (above 70%).
                    </motion.div>
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* Quick access system controls */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <GlassCard glowColor="purple" className="flex flex-col justify-between cursor-pointer hover-lift" onClick={() => navigate('/graph')}>
                <div className="space-y-2">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <GitFork className="text-cyber-purple h-6 w-6" />
                  </motion.div>
                  <h4 className="font-orbitron font-bold text-xs uppercase text-cyber-white tracking-widest">Knowledge Graph</h4>
                  <p className="text-[10px] text-cyber-gray leading-relaxed">
                    View prerequisite edges and visual mastery levels.
                  </p>
                </div>
              </GlassCard>

              <GlassCard glowColor="cyan" className="flex flex-col justify-between cursor-pointer hover-lift" onClick={() => navigate('/video')}>
                <div className="space-y-2">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Video className="text-cyber-cyan h-6 w-6" />
                  </motion.div>
                  <h4 className="font-orbitron font-bold text-xs uppercase text-cyber-white tracking-widest">Video Analyzer</h4>
                  <p className="text-[10px] text-cyber-gray leading-relaxed">
                    Parse lectures and extract timestamped conceptual check-offs.
                  </p>
                </div>
              </GlassCard>

              <GlassCard glowColor="amber" className="flex flex-col justify-between cursor-pointer hover-lift" onClick={() => navigate('/guard')}>
                <div className="space-y-2">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ShieldCheck className="text-cyber-amber h-6 w-6" />
                  </motion.div>
                  <h4 className="font-orbitron font-bold text-xs uppercase text-cyber-white tracking-widest">Truth Guard</h4>
                  <p className="text-[10px] text-cyber-gray leading-relaxed">
                    Fact check web resources against syllabus facts.
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </div>

        </motion.div>
      ) : (
        /* DISCONNECT TERMINAL STATE */
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-full max-w-lg space-y-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="h-16 w-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto shadow-glass"
            >
              <Dna size={28} className="text-cyber-gray" />
            </motion.div>

            <div>
              <h2 className="font-orbitron font-bold text-lg tracking-wider text-cyber-white">COGNITIVE INTERFACE OFFLINE</h2>
              <p className="text-xs text-cyber-gray leading-relaxed max-w-sm mx-auto mt-2">
                ScholarDNA model is missing. Please feed a course syllabus PDF to construct your learning blueprints.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/upload')}
              className="px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded font-orbitron font-bold uppercase text-xs tracking-widest text-white shadow-cyan-glow hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all btn-cyber"
            >
              Upload Syllabus & Ingest DNA
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
