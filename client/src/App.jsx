import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ScholarDNAProvider } from './context/ScholarDNAContext';
import DashboardLayout from './layouts/DashboardLayout';
import { AnimatePresence, motion } from 'framer-motion';

// Ingestion Page Components
import Dashboard from './pages/Dashboard';
import DNAUpload from './pages/DNAUpload';
import KnowledgeGraph from './pages/KnowledgeGraph';
import VideoHub from './pages/VideoHub';
import Guard from './pages/Guard';
import ExamTracker from './pages/ExamTracker';

// Page transition wrapper
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1] 
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

// Animated routes component
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <Dashboard />
          </PageTransition>
        } />
        <Route path="/upload" element={
          <PageTransition>
            <DNAUpload />
          </PageTransition>
        } />
        <Route path="/graph" element={
          <PageTransition>
            <KnowledgeGraph />
          </PageTransition>
        } />
        <Route path="/video" element={
          <PageTransition>
            <VideoHub />
          </PageTransition>
        } />
        <Route path="/guard" element={
          <PageTransition>
            <Guard />
          </PageTransition>
        } />
        <Route path="/tracker" element={
          <PageTransition>
            <ExamTracker />
          </PageTransition>
        } />
        {/* Fallback route redirection */}
        <Route path="*" element={
          <PageTransition>
            <Dashboard />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ScholarDNAProvider>
      <Router>
        <DashboardLayout>
          <AnimatedRoutes />
        </DashboardLayout>
      </Router>
    </ScholarDNAProvider>
  );
}

export default App;
