import React, { useState, useEffect } from 'react';
import { useScholarDNA } from '../context/ScholarDNAContext';
import GlassCard from '../components/common/GlassCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';
import { 
  Search as SearchIcon, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight,
  BrainCircuit,
  AlertTriangle,
  Globe,
  Youtube,
  Layers,
  Award,
  CheckCircle2
} from 'lucide-react';

const Search = () => {
  const { activeDNA, updateNodeMastery } = useScholarDNA();
  
  // Search parameters
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [syllabusMapping, setSyllabusMapping] = useState(null);
  const [selectedResultId, setSelectedResultId] = useState(null);
  const [outOfScope, setOutOfScope] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'article' | 'video' | 'wiki'
  
  // Quick mastery bump success state
  const [bumpSuccess, setBumpSuccess] = useState(false);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!query) return;

    setIsSearching(true);
    setOutOfScope(false);
    setResults([]);
    setSyllabusMapping(null);
    setSelectedResultId(null);
    setBumpSuccess(false);

    try {
      const dnaId = activeDNA?._id || 'simulated';
      const response = await axios.get(`${API_BASE}/api/search`, {
        params: { q: query, dnaId }
      });

      if (response.data && response.data.success) {
        if (response.data.outOfScope) {
          setOutOfScope(true);
        } else {
          setResults(response.data.results);
          setSyllabusMapping(response.data.syllabusMapping);
          if (response.data.results.length > 0) {
            setSelectedResultId(response.data.results[0].id);
          }
        }
      }
    } catch (err) {
      console.warn('[Search API] Unreachable. Triggering high fidelity client search simulation...');
      await simulateClientSearch();
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * High-fidelity offline search simulations (perfect for showcases!)
   */
  const simulateClientSearch = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const queryLower = query.toLowerCase();
        
        // Out of syllabus detection
        const blockList = ['pizza', 'bake', 'recipe', 'game', 'fortnite', 'gossip', 'celebrity', 'vacation', 'resort', 'flight', 'movies', 'music video'];
        const hasBlockWord = blockList.some(word => queryLower.includes(word));

        let matchedTopic = null;
        let matchedUnit = null;

        if (activeDNA && activeDNA.units) {
          for (let unit of activeDNA.units) {
            for (let topic of unit.topics) {
              if (topic.title.toLowerCase().includes(queryLower) || queryLower.includes(topic.title.toLowerCase()) ||
                  queryLower.includes('complexity') || queryLower.includes('dijkstra') || queryLower.includes('tree') || queryLower.includes('list')) {
                matchedTopic = topic;
                matchedUnit = unit;
                break;
              }
            }
            if (matchedTopic) break;
          }
        } else {
          // Default syllabus values
          const fallbackTopics = [
            { id: "big_o_analysis", title: "Time & Space Complexity", unitNumber: 1, unitTitle: "Complexity & Linear Structures", pyq: 8, weight: 18 },
            { id: "linked_lists", title: "Singly & Doubly Linked Lists", unitNumber: 1, unitTitle: "Complexity & Linear Structures", pyq: 3, weight: 12 },
            { id: "binary_trees", title: "Binary Search Trees (BST)", unitNumber: 2, unitTitle: "Non-Linear Structures & Trees", pyq: 12, weight: 25 },
            { id: "avl_trees", title: "Self-Balancing AVL Trees", unitNumber: 2, unitTitle: "Non-Linear Structures & Trees", pyq: 5, weight: 15 }
          ];
          for (let topic of fallbackTopics) {
            if (queryLower.includes(topic.title.toLowerCase()) || topic.title.toLowerCase().includes(queryLower) ||
                queryLower.includes('complexity') || queryLower.includes('dijkstra') || queryLower.includes('tree') || queryLower.includes('list')) {
              matchedTopic = topic;
              matchedUnit = { unitNumber: topic.unitNumber, title: topic.unitTitle };
              break;
            }
          }
        }

        if (hasBlockWord || !matchedTopic) {
          setOutOfScope(true);
        } else {
          const sims = [
            {
              id: 'web_1',
              title: `Comprehensive Guide to ${matchedTopic.title}`,
              description: `Detailed textual explanation exploring core concepts of ${matchedTopic.title}. Includes practical examples, asymptotic boundaries, and mathematical proofs.`,
              source: 'Web Resource',
              url: '#',
              type: 'article'
            },
            {
              id: 'yt_1',
              title: `${matchedTopic.title} Lectures // In-depth Explanation`,
              description: `Visual walkthrough of ${matchedTopic.title} covering structural operations, algorithmic complexities, and mock problem check-offs.`,
              source: 'YouTube Lecture',
              url: '#',
              type: 'video'
            },
            {
              id: 'wiki_1',
              title: `Wikipedia: ${matchedTopic.title}`,
              description: `Formal encyclopedia breakdown of ${matchedTopic.title}. Examines historical development, abstract formalizations, and related algorithms.`,
              source: 'Wikipedia Core',
              url: '#',
              type: 'wiki'
            }
          ];

          setResults(sims);
          setSyllabusMapping({
            nodeId: matchedTopic.id,
            topicTitle: matchedTopic.title,
            unitNumber: matchedUnit.unitNumber || 1,
            unitTitle: matchedUnit.title || "Complexity Analysis",
            importance: matchedTopic.importance || 'high',
            pyqFrequency: matchedTopic.pyqFrequency || 5,
            weightage: matchedTopic.weightage || 15,
            relevanceScore: 98
          });
          setSelectedResultId(sims[0].id);
        }
        resolve();
      }, 1500);
    });
  };

  const getSourceIcon = (type) => {
    if (type === 'video') return <Youtube className="text-red-400 h-4 w-4" />;
    if (type === 'wiki') return <BookOpen className="text-cyan-400 h-4 w-4" />;
    return <Globe className="text-cyber-gray h-4 w-4" />;
  };

  const filteredResults = results.filter(res => {
    if (activeTab === 'all') return true;
    return res.type === activeTab;
  });

  const selectedResult = results.find(r => r.id === selectedResultId);

  // Sync mastery bump handler
  const handleQuickSync = () => {
    if (!syllabusMapping) return;
    
    // Bump target node mastery level by 20% in global state!
    updateNodeMastery(syllabusMapping.nodeId, 85, 'mastered');
    setBumpSuccess(true);
  };

  return (
    <div className="space-y-8 select-none">
      {/* HEADER HUD STATUS */}
      <div className="border-b border-cyber-border/20 pb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-orbitron font-extrabold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple">
            SYLLABUS-AWARE SEARCH
          </h1>
          <p className="text-xs text-cyber-gray mt-1 uppercase tracking-wider">
            Query global academic vaults. Results are dynamically filtered and mapped directly to your ScholarDNA.
          </p>
        </div>
      </div>

      {/* SEARCH BAR CONSOLE */}
      <GlassCard glowColor="cyan" hoverScale={false}>
        <form onSubmit={handleSearchSubmit} className="flex gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cyber-gray" />
            <input
              type="text"
              placeholder="Query syllabus topics... (e.g. Time Complexity, Binary Trees, AVL Rotations)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
              className="w-full bg-[#08090C] border border-cyber-border hover:border-cyber-cyan/40 focus:border-cyber-cyan rounded-lg pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:shadow-cyan-glow text-cyber-white transition-all font-orbitron"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-lg font-orbitron font-bold uppercase text-xs tracking-widest text-white shadow-cyan-glow hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all hover:scale-[1.02]"
          >
            Query Vault
          </button>
        </form>
      </GlassCard>

      <AnimatePresence mode="wait">

        {isSearching ? (
          /* CASE 1: SEARCHING PULSING skeletons */
          <motion.div
            key="searching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <SkeletonLoader lines={3} />
                <SkeletonLoader lines={3} />
              </div>
              <SkeletonLoader lines={5} />
            </div>
          </motion.div>
        ) : outOfScope ? (
          /* CASE 2: OUT OF SCOPE DISTRACTION SHIELD LOCK */
          <motion.div
            key="lockout"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-2xl mx-auto py-12 text-center"
          >
            <GlassCard glowColor="amber" hoverScale={false}>
              <div className="space-y-6 py-4">
                <div className="h-16 w-16 bg-cyber-amber/10 border-2 border-cyber-amber rounded-full flex items-center justify-center mx-auto shadow-amber-glow animate-cyber-pulse">
                  <ShieldAlert size={32} className="text-cyber-amber" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-orbitron font-extrabold text-lg text-cyber-white tracking-widest uppercase">
                    [INTEGRITY SHIELD ACTIVE]
                  </h3>
                  <h4 className="font-orbitron font-bold text-xs text-cyber-amber uppercase tracking-wider">
                    Content Request Blocked: Out of Syllabus Scope
                  </h4>
                  <p className="text-[11px] text-cyber-gray leading-relaxed max-w-sm mx-auto mt-2 font-orbitron">
                    ScholarDNA identified this search as unrelated to your active course targets. We shield your HUD from academic distractions to accelerate mastery sync speeds.
                  </p>
                </div>

                <div className="p-3 bg-cyber-amber/5 border border-cyber-amber/15 rounded text-[10px] text-cyber-gray leading-relaxed max-w-md mx-auto">
                  ⚠️ Ingested ScholarDNA filter enforces focused search limits. Try searching academic concepts like <strong>Complexity, Graphs, Dijkstra, or Trees</strong>.
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ) : results.length > 0 ? (
          /* CASE 3: VALID DETECTED SEARCH DETAILS & INTERACTIVE SIDEBAR */
          <motion.div
            key="results-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* LEFT VIEWPORT: CONTENT RESULTS LIST */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Tab Filters */}
              <div className="flex space-x-2 border-b border-cyber-border/20 pb-2">
                {['all', 'article', 'video', 'wiki'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      px-4 py-1.5 rounded font-orbitron text-[10px] uppercase tracking-wider border transition-all
                      ${activeTab === tab
                        ? 'bg-cyber-cyan/5 border-cyber-cyan/30 text-cyber-cyan'
                        : 'border-transparent text-cyber-gray hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    {tab} source
                  </button>
                ))}
              </div>

              {/* Results Cards List */}
              <div className="space-y-4">
                {filteredResults.map((res) => {
                  const isSelected = selectedResultId === res.id;
                  return (
                    <div
                      key={res.id}
                      onClick={() => { setSelectedResultId(res.id); setBumpSuccess(false); }}
                      className={`
                        p-4 rounded-xl border bg-[#131722]/35 backdrop-blur-md transition-all cursor-pointer flex justify-between items-center group relative overflow-hidden
                        ${isSelected 
                          ? 'border-cyber-cyan/40 bg-cyber-cyan/5 shadow-cyan-glow' 
                          : 'border-white/5 hover:border-white/15 hover:bg-[#131722]/50'
                        }
                      `}
                    >
                      <div className="space-y-2 flex-1 pr-4">
                        <div className="flex items-center space-x-2">
                          {getSourceIcon(res.type)}
                          <span className="text-[9px] uppercase font-orbitron text-cyber-gray">{res.source}</span>
                        </div>
                        <h4 className={`font-orbitron font-bold text-xs uppercase ${isSelected ? 'text-cyber-cyan' : 'text-cyber-white group-hover:text-cyber-cyan transition-colors'}`}>
                          {res.title}
                        </h4>
                        <p className="text-[10px] text-cyber-gray leading-relaxed max-w-xl">
                          {res.description}
                        </p>
                      </div>

                      <ChevronRight size={16} className={`text-cyber-gray transition-colors group-hover:text-cyber-cyan ${isSelected ? 'text-cyber-cyan' : ''}`} />
                    </div>
                  );
                })}

                {filteredResults.length === 0 && (
                  <div className="py-8 text-center text-cyber-gray font-orbitron text-xs">
                    No results match the active source filter tabs.
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR: INTERACTIVE SYLLABUS PANEL */}
            {syllabusMapping && (
              <div className="lg:col-span-1 space-y-6">
                <GlassCard glowColor="purple" hoverScale={false}>
                  <div className="space-y-5">
                    
                    {/* Header */}
                    <div className="border-b border-cyber-purple/15 pb-2">
                      <span className="text-[8px] uppercase font-orbitron text-cyber-cyan tracking-widest block">
                        Syllabus context match
                      </span>
                      <h3 className="font-orbitron font-bold text-sm uppercase text-cyber-white mt-0.5">
                        {syllabusMapping.topicTitle}
                      </h3>
                    </div>

                    {/* Telemetry indices badges */}
                    <div className="space-y-3 font-orbitron text-[10px]">
                      {/* Covered Unit */}
                      <div className="flex justify-between items-center bg-white/5 p-2 border border-white/5 rounded">
                        <span className="text-cyber-gray">SYLLABUS MODULE</span>
                        <span className="text-cyber-white font-semibold">Unit 0{syllabusMapping.unitNumber}</span>
                      </div>

                      {/* Relevance rating */}
                      <div className="flex justify-between items-center bg-white/5 p-2 border border-white/5 rounded">
                        <span className="text-cyber-gray">CONCEPT RELEVANCE</span>
                        <span className="text-cyber-cyan font-bold border border-cyber-cyan/20 px-2 py-0.5 rounded bg-cyber-cyan/5">
                          {syllabusMapping.relevanceScore}% MATCH
                        </span>
                      </div>

                      {/* Exam Importance percentage */}
                      <div className="flex justify-between items-center bg-white/5 p-2 border border-white/5 rounded">
                        <span className="text-cyber-gray">EXAM EXCLUSIVITY</span>
                        <span className="text-cyber-purple font-bold border border-cyber-purple/20 px-2 py-0.5 rounded bg-cyber-purple/5">
                          {syllabusMapping.weightage}% WEIGHT
                        </span>
                      </div>

                      {/* Appears in PYQs indicator */}
                      <div className="flex justify-between items-center bg-white/5 p-2 border border-white/5 rounded">
                        <span className="text-cyber-gray">PYQ FREQUENCY</span>
                        <span className="text-cyber-amber font-bold border border-cyber-amber/20 px-2 py-0.5 rounded bg-cyber-amber/5 animate-pulse">
                          {syllabusMapping.pyqFrequency} TIMES
                        </span>
                      </div>
                    </div>

                    {/* Mastery Gap sync controls */}
                    <div className="p-3 bg-cyber-purple/5 border border-cyber-purple/10 rounded-lg space-y-4">
                      <div className="flex items-start space-x-2">
                        <BrainCircuit size={16} className="text-cyber-purple mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-orbitron text-cyber-gray tracking-wider block">Mastery gap analysis</span>
                          <p className="text-[10px] text-cyber-white leading-relaxed">
                            Completing study of this verified resource will synchronize topic mastery level to 85%.
                          </p>
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {!bumpSuccess ? (
                          <button
                            onClick={handleQuickSync}
                            className="w-full py-2.5 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-orbitron font-bold uppercase text-[10px] tracking-wider rounded hover:shadow-cyan-glow hover:scale-[1.01] transition-all"
                          >
                            Sync Completed Learning
                          </button>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-2.5 bg-green-500/10 border border-green-500/30 rounded flex items-center justify-center space-x-1.5 text-green-400 font-orbitron uppercase text-[9px] font-bold"
                          >
                            <CheckCircle2 size={12} className="animate-bounce" />
                            <span>DNA Telemetry Updated Successfully!</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* External Link action */}
                    {selectedResult && (
                      <a
                        href={selectedResult.url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center p-2 border border-cyber-cyan/30 hover:border-cyber-cyan/80 bg-cyber-cyan/5 hover:bg-cyber-cyan/10 rounded font-orbitron uppercase text-[9px] tracking-widest text-cyber-cyan transition-all"
                      >
                        <ExternalLink size={12} className="mr-2" />
                        Explore Resource Document
                      </a>
                    )}

                  </div>
                </GlassCard>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default Search;
