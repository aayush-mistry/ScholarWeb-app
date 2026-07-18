<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
﻿import React, { useState, useEffect } from 'react';
>>>>>>> e790a5f9057e66b31bd109b0ebf17dd5e5794264
import { useLocation } from 'react-router-dom';
import { useScholarDNA } from '../context/ScholarDNAContext';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const { activeDNA, resetDNA } = useScholarDNA();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateCognitiveSync = () => {
    if (!activeDNA || !activeDNA.units) return 0;
    let totalTopics = 0;
    let totalMastery = 0;

    activeDNA.units.forEach((unit) => {
      unit.topics.forEach((topic) => {
        totalTopics += 1;
        totalMastery += topic.masteryLevel || 0;
      });
    });

    if (totalTopics === 0) return 0;
    return Math.round(totalMastery / totalTopics);
  };

  const syncMastery = calculateCognitiveSync();

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-cyber-bg text-white flex overflow-hidden scanlines">
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0 opacity-[0.03]" />
=======
    <div className="min-h-screen bg-[#08090C] text-white flex overflow-hidden scanlines">
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0 opacity-20" />
>>>>>>> e790a5f9057e66b31bd109b0ebf17dd5e5794264

      <Sidebar activeDNA={activeDNA} resetDNA={resetDNA} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <TopBar syncMastery={syncMastery} activeDNA={activeDNA} currentTime={currentTime} />

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
