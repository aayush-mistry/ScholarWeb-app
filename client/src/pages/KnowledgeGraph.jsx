import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background,
  useNodesState,
  useEdgesState
} from 'react-flow-renderer';
import { useScholarDNA } from '../context/ScholarDNAContext';
import GlassCard from '../components/common/GlassCard';
import CyberNode from '../components/graph/CyberNode';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  GitFork, 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle,
  XCircle,
  Dna
} from 'lucide-react';

// Register custom React Flow node types
const nodeTypes = {
  customNode: CyberNode
};

const KnowledgeGraph = () => {
  const { activeDNA, updateNodeMastery } = useScholarDNA();
  const navigate = useNavigate();
  
  // React Flow hooks for managing elements
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // HUD Selected Node Details
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Sync activeDNA data to React Flow node elements
  useEffect(() => {
    if (!activeDNA || !activeDNA.units) return;

    const parsedNodes = [];
    const parsedEdges = [];

    activeDNA.units.forEach((unit, uIdx) => {
      unit.topics.forEach((topic, tIdx) => {
        // Arrange nodes dynamically in columns per Unit
        const posX = uIdx * 280 + 80;
        const posY = tIdx * 140 + 60;

        // Custom Node declaration
        parsedNodes.push({
          id: topic.id,
          type: 'customNode',
          data: { 
            title: topic.title,
            masteryLevel: topic.masteryLevel || 0,
            importance: topic.importance,
            id: topic.id,
            description: topic.description,
            subtopics: topic.subtopics,
            referenceMaterials: topic.referenceMaterials,
            unitTitle: unit.title,
            unitNumber: unit.unitNumber
          },
          position: { x: posX, y: posY }
        });

        // Custom Edge connections for prerequisites
        if (topic.prerequisites && topic.prerequisites.length > 0) {
          topic.prerequisites.forEach(prereqId => {
            const isPrereqMastered = activeDNA.units.some(u => 
              u.topics.some(t => t.id === prereqId && t.masteryLevel >= 80)
            );

            parsedEdges.push({
              id: `edge-${prereqId}-${topic.id}`,
              source: prereqId,
              target: topic.id,
              animated: true,
              style: { 
                stroke: isPrereqMastered ? '#22C55E' : '#FF9900', 
                strokeWidth: 2,
                strokeDasharray: '6 6'
              }
            });
          });
        }
      });
    });

    setNodes(parsedNodes);
    setEdges(parsedEdges);

    // Auto select first topic on load if none is selected
    if (parsedNodes.length > 0 && !selectedTopic) {
      setSelectedTopic(parsedNodes[0].data);
    }
  }, [activeDNA]);

  // Handle in-flow node click selections
  const onNodeClick = useCallback((event, node) => {
    setSelectedTopic(node.data);
  }, []);

  // Sync selected topic with global context updates in real-time
  useEffect(() => {
    if (selectedTopic && nodes.length > 0) {
      const updated = nodes.find(n => n.id === selectedTopic.id);
      if (updated) {
        setSelectedTopic(updated.data);
      }
    }
  }, [nodes]);

  // Adjust understanding levels directly via HUD actions
  const handleSetUnderstanding = (level) => {
    if (!selectedTopic) return;
    
    let mastery = 10;
    let status = 'unstarted';

    if (level === 'complete') {
      mastery = 90;
      status = 'mastered';
    } else if (level === 'partial') {
      mastery = 55;
      status = 'in-progress';
    }

    updateNodeMastery(selectedTopic.id, mastery, status);
  };

  const currentMastery = selectedTopic?.masteryLevel || 0;

  return (
    <div className="space-y-8 select-none">
      {/* HEADER HUD STATUS */}
      <div className="border-b border-cyber-border/20 pb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-orbitron font-extrabold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple">
            LIVE KNOWLEDGE GRAPH MODULE
          </h1>
          <p className="text-xs text-cyber-gray mt-1 uppercase tracking-wider">
            Upgraded interactive React Flow neural network mapping and explicit understanding trackers.
          </p>
        </div>
      </div>

      {activeDNA ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
          
          {/* COLUMN 1 & 2: REACT FLOW GRAPH CANVAS VIEWPORT */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2 relative"
          >
            <GlassCard glowColor="purple" hoverScale={false} className="p-0 h-[480px] overflow-hidden border border-cyber-purple/20">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                fitView
                className="bg-[#0A0D16]/50"
              >
                {/* Visual HUD grid backdrop */}
                <Background color="rgba(0, 240, 255, 0.08)" gap={16} size={1} />
                <Controls className="bg-cyber-cardBg border border-cyber-border/30 rounded text-cyber-white [color-scheme:dark] select-none scale-90" />
                <MiniMap 
                  nodeColor={(node) => {
                    const mastery = node.data?.masteryLevel || 0;
                    if (mastery >= 80) return '#22C55E';
                    if (mastery >= 30) return '#FF9900';
                    return '#EF4444';
                  }}
                  maskColor="rgba(8, 9, 12, 0.85)"
                  className="bg-[#0F1322]/90 border border-cyber-border/20 rounded scale-90"
                />
              </ReactFlow>

              {/* Subtitle Telemetry overlay */}
              <div className="absolute bottom-4 left-4 p-3 bg-[#070A12]/95 border border-cyber-border/20 rounded font-orbitron text-[9px] uppercase tracking-wider text-cyber-gray space-y-1.5 backdrop-blur-md z-20">
                <div className="flex items-center space-x-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
                  <span>Completely Understood (&gt;= 80%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FF9900] shadow-[0_0_8px_#FF9900]" />
                  <span>Partially Understood (30-79%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#EF4444] shadow-[0_0_8px_#EF4444]" />
                  <span>Not Understood (&lt; 30%)</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* COLUMN 3: HUD UNDERSTANDING TELEMETRY PANEL */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <AnimatePresence mode="wait">
              {selectedTopic ? (
                <motion.div
                  key={selectedTopic.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <GlassCard glowColor="cyan" hoverScale={false}>
                    <div className="space-y-4">
                      
                      {/* Title Header */}
                      <div className="border-b border-cyber-cyan/15 pb-2">
                        <span className="text-[8px] uppercase font-orbitron text-cyber-purple tracking-widest block">
                          Unit 0{selectedTopic.unitNumber} // {selectedTopic.unitTitle}
                        </span>
                        <h3 className="font-orbitron font-extrabold text-sm uppercase text-cyber-white mt-0.5">
                          {selectedTopic.title}
                        </h3>
                      </div>

                      <p className="text-xs text-cyber-gray leading-relaxed">
                        {selectedTopic.description}
                      </p>

                      {/* EXPLICIT UNDERSTANDING CATEGORY TRACKER */}
                      <div className="space-y-3 pt-2">
                        <span className="text-[9px] uppercase font-orbitron text-cyber-cyan/60 tracking-wider flex items-center">
                          <BrainCircuit size={12} className="mr-1.5 animate-pulse" />
                          Track Understanding Status
                        </span>

                        <div className="grid grid-cols-1 gap-2.5">
                          {/* 1. Completely Understood */}
                          <motion.button
                            onClick={() => handleSetUnderstanding('complete')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                              w-full p-3 rounded-lg border transition-all text-left flex items-center justify-between group btn-cyber
                              ${currentMastery >= 80 
                                ? 'bg-green-500/10 border-green-500/50 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.25)]' 
                                : 'border-white/5 bg-white/5 text-cyber-gray hover:text-white hover:border-green-500/20'
                              }
                            `}
                          >
                            <span className="font-orbitron font-bold text-xs uppercase">Completely Understood</span>
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <CheckCircle2 size={16} className={`group-hover:scale-110 transition-transform ${currentMastery >= 80 ? 'text-green-400 animate-pulse' : 'text-cyber-gray/30'}`} />
                            </motion.div>
                          </motion.button>

                          {/* 2. Partially Understood */}
                          <motion.button
                            onClick={() => handleSetUnderstanding('partial')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                              w-full p-3 rounded-lg border transition-all text-left flex items-center justify-between group btn-cyber
                              ${currentMastery >= 30 && currentMastery < 80 
                                ? 'bg-cyber-amber/10 border-cyber-amber/50 text-cyber-amber shadow-[0_0_10px_rgba(255,153,0,0.25)]' 
                                : 'border-white/5 bg-white/5 text-cyber-gray hover:text-white hover:border-cyber-amber/20'
                              }
                            `}
                          >
                            <span className="font-orbitron font-bold text-xs uppercase">Partially Understood</span>
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: -10 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <HelpCircle size={16} className={`group-hover:scale-110 transition-transform ${currentMastery >= 30 && currentMastery < 80 ? 'text-cyber-amber' : 'text-cyber-gray/30'}`} />
                            </motion.div>
                          </motion.button>

                          {/* 3. Not Understood */}
                          <motion.button
                            onClick={() => handleSetUnderstanding('weak')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                              w-full p-3 rounded-lg border transition-all text-left flex items-center justify-between group btn-cyber
                              ${currentMastery < 30 
                                ? 'bg-red-500/10 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.25)]' 
                                : 'border-white/5 bg-white/5 text-cyber-gray hover:text-white hover:border-red-500/20'
                              }
                            `}
                          >
                            <span className="font-orbitron font-bold text-xs uppercase">Not Understood</span>
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <XCircle size={16} className={`group-hover:scale-110 transition-transform ${currentMastery < 30 ? 'text-red-400' : 'text-cyber-gray/30'}`} />
                            </motion.div>
                          </motion.button>
                        </div>
                      </div>

                      {/* Subtopics reference checkmarks */}
                      <div className="space-y-2 pt-2">
                        <span className="text-[9px] uppercase font-orbitron text-cyber-purple/60 tracking-wider">Concept targets</span>
                        <div className="space-y-1.5">
                          {selectedTopic.subtopics?.map((sub, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-xs text-cyber-gray font-orbitron bg-black/20 p-2 rounded border border-white/5">
                              <CheckCircle2 size={12} className={currentMastery >= 80 ? 'text-green-400' : 'text-cyber-gray/40'} />
                              <span>{sub.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ) : (
                <div className="text-center text-cyber-gray font-orbitron text-xs py-8">
                  Select a neural node inside the React Flow canvas to audit mastery metrics.
                </div>
              )}
            </AnimatePresence>
          </motion.div>

        </motion.div>
      ) : (
        /* DISCONNECT TERMINAL STATE */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-full max-w-lg space-y-6">
            <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto shadow-glass">
              <GitFork size={28} className="text-cyber-gray animate-pulse" />
            </div>

            <div>
              <h2 className="font-orbitron font-bold text-lg tracking-wider text-cyber-white">GRAPH blue prints offline</h2>
              <p className="text-xs text-cyber-gray leading-relaxed max-w-sm mx-auto mt-2">
                ScholarDNA model is missing. Please upload your syllabus to chart the cognitive node networks.
              </p>
            </div>

            <motion.button
              onClick={() => navigate('/upload')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded font-orbitron font-bold uppercase text-xs tracking-widest text-white shadow-cyan-glow hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all btn-cyber"
            >
              Feed DNA Engine
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraph;
