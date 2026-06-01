import React, { useState } from 'react';
import { useScholarDNA } from '../context/ScholarDNAContext';
import GlassCard from '../components/common/GlassCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  HelpCircle, 
  AlertTriangle,
  RefreshCw,
  GitCommit
} from 'lucide-react';

const DNAUpload = () => {
  const { activeDNA, loading, processingStatus, uploadSyllabus, updateNodeMastery, resetDNA } = useScholarDNA();
  const isUploading = loading;
  
  // Form State
  const [courseName, setCourseName] = useState('');
  const [targetExamDate, setTargetExamDate] = useState('');
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [pyqFile, setPyqFile] = useState(null);
  const [notesFile, setNotesFile] = useState(null);
  
  // UI Accordion States
  const [expandedUnit, setExpandedUnit] = useState(0); // Index of expanded unit

  // Drag states
  const [isDragOver, setIsDragOver] = useState({ syllabus: false, pyq: false, notes: false });

  const handleDrag = (e, field, type) => {
    e.preventDefault();
    setIsDragOver(prev => ({ ...prev, [field]: type === 'over' }));
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    setIsDragOver(prev => ({ ...prev, [field]: false }));
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      if (field === 'syllabus') setSyllabusFile(file);
      if (field === 'pyq') setPyqFile(file);
      if (field === 'notes') setNotesFile(file);
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (field === 'syllabus') setSyllabusFile(file);
      if (field === 'pyq') setPyqFile(file);
      if (field === 'notes') setNotesFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!syllabusFile) return;

    const formData = new FormData();
    formData.append('courseName', courseName);
    formData.append('targetExamDate', targetExamDate);
    formData.append('syllabus', syllabusFile);
    if (pyqFile) formData.append('pyq', pyqFile);
    if (notesFile) formData.append('notes', notesFile);

    await uploadSyllabus(formData);
  };

  // Importance color maps
  const importanceGlows = {
    high: 'text-red-400 bg-red-500/10 border-red-500/30 glow-text-red shadow-[0_0_8px_rgba(239,68,68,0.2)]',
    medium: 'text-cyber-amber bg-cyber-amber/10 border-cyber-amber/30 shadow-[0_0_8px_rgba(255,153,0,0.2)]',
    low: 'text-green-400 bg-green-500/10 border-green-500/30 shadow-[0_0_8px_rgba(34,197,94,0.2)]'
  };

  return (
    <div className="space-y-8 select-none">
      {/* HEADER HUD BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-cyber-border/20 pb-4">
        <div>
          <h1 className="font-orbitron font-extrabold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple">
            SCHOLARDNA upload engine
          </h1>
          <p className="text-xs text-cyber-gray mt-1 uppercase tracking-wider">
            Extract syllabus schemas, index historical PYQs, and construct target study maps.
          </p>
        </div>
        {activeDNA && (
          <motion.button
            onClick={resetDNA}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 border border-cyber-cyan/30 hover:border-cyber-cyan/80 bg-cyber-cyan/5 hover:bg-cyber-cyan/10 rounded font-orbitron uppercase text-xs tracking-widest transition-all btn-cyber"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw size={14} className="mr-2" />
            </motion.div>
            Upload New Syllabus
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">

        {isUploading ? (
          /* CASE 1: PARSING PIPELINE LOADING HUD */
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="w-full max-w-xl text-center space-y-6">
              {/* Spinning DNA Visualizer */}
              <div className="relative inline-block">
                <div className="h-16 w-16 border-4 border-t-cyber-cyan border-b-cyber-purple border-l-transparent border-r-transparent rounded-full animate-spin" />
                <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-cyber-cyan animate-pulse" />
              </div>

              <div>
                <h3 className="font-orbitron text-lg font-bold tracking-widest text-cyber-cyan uppercase">
                  Cognitive Analysis In Progress
                </h3>
                <p className="text-sm font-orbitron text-cyber-purple/80 mt-2 tracking-wide animate-pulse">
                  {processingStatus}
                </p>
              </div>

              <SkeletonLoader lines={4} />
            </div>
          </motion.div>
        ) : activeDNA ? (
          /* CASE 3: EXTRACTED SCHOLARDNA SUMMARY & UNIT ACCORDIONS */
          <motion.div
            key="dna-details"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* DOCKET A: OVERVIEW RADAR PANEL (COLUMN 1) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-6"
            >
              <GlassCard glowColor="cyan" hoverScale={false}>
                <div className="space-y-4">
                  <div className="border-b border-cyber-cyan/15 pb-2">
                    <span className="text-[10px] uppercase font-orbitron text-cyber-cyan/60 tracking-wider">DNA Sync Node</span>
                    <h2 className="font-orbitron font-bold text-xl text-cyber-white tracking-wide mt-1">
                      {activeDNA.courseName}
                    </h2>
                  </div>

                  <p className="text-xs text-cyber-gray leading-relaxed">
                    {activeDNA.courseDescription}
                  </p>

                  {/* DNA Telemetry Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 border-t border-cyber-border/20 pt-4 mt-2">
                    <div className="p-3 bg-white/5 rounded border border-white/5">
                      <span className="text-[10px] uppercase font-orbitron text-cyber-gray/70">Total Units</span>
                      <p className="text-lg font-bold font-orbitron mt-1 text-cyber-cyan">{activeDNA.units?.length || 0}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded border border-white/5">
                      <span className="text-[10px] uppercase font-orbitron text-cyber-gray/70">Topic Nodes</span>
                      <p className="text-lg font-bold font-orbitron mt-1 text-cyber-purple">
                        {activeDNA.units?.reduce((acc, u) => acc + (u.topics?.length || 0), 0) || 0}
                      </p>
                    </div>
                  </div>

                  {activeDNA.targetExamDate && (
                    <div className="p-3 bg-cyber-purple/5 border border-cyber-purple/20 rounded flex items-center space-x-3 mt-4">
                      <Calendar size={18} className="text-cyber-purple" />
                      <div>
                        <p className="text-[9px] uppercase font-orbitron text-cyber-gray">Target Exam</p>
                        <p className="text-xs font-semibold font-orbitron text-cyber-white">
                          {new Date(activeDNA.targetExamDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* DOCKET B: UNIT ACCORDION LISTINGS (COLUMN 2 & 3) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:col-span-2 space-y-4"
            >
              
              <div className="flex items-center justify-between border-b border-cyber-border/20 pb-2 mb-4">
                <h3 className="font-orbitron font-bold text-xs uppercase tracking-widest text-cyber-gray">
                  Unit-wise breakdown & Mastery Map
                </h3>
              </div>

              {activeDNA.units?.map((unit, uIdx) => {
                const isExpanded = expandedUnit === uIdx;
                
                return (
                  <motion.div 
                    key={unit.unitNumber} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: uIdx * 0.1 }}
                    className="border border-cyber-border/30 rounded-xl overflow-hidden bg-[#131722]/30 backdrop-blur-md transition-all duration-300"
                  >
                    {/* Unit Accordion Trigger */}
                    <motion.button
                      onClick={() => setExpandedUnit(isExpanded ? -1 : uIdx)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`
                        w-full p-4 flex items-center justify-between transition-colors text-left
                        ${isExpanded ? 'bg-cyber-cyan/5 text-cyber-cyan border-b border-cyber-cyan/15' : 'hover:bg-white/5'}
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`
                          h-7 w-7 rounded-full flex items-center justify-center text-xs font-orbitron font-bold border
                          ${isExpanded ? 'border-cyber-cyan text-cyber-cyan' : 'border-cyber-gray/30 text-cyber-gray'}
                        `}>
                          0{unit.unitNumber}
                        </div>
                        <div>
                          <h4 className="font-orbitron font-bold text-xs uppercase tracking-widest text-cyber-white">{unit.title}</h4>
                          <p className="text-[10px] text-cyber-gray mt-0.5 truncate max-w-sm">{unit.description}</p>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </motion.button>

                    {/* Expandable Topics Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="divide-y divide-cyber-border/20 bg-black/20"
                        >
                          <div className="p-4 space-y-4">
                            {unit.topics?.map((topic, tIdx) => (
                              <motion.div 
                                key={topic.id} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: tIdx * 0.05 }}
                                whileHover={{ scale: 1.01, x: 5 }}
                                className="p-4 bg-[#111522]/50 border border-cyber-border/20 rounded-lg hover:border-cyber-cyan/30 transition-all space-y-3 relative overflow-hidden hover-lift"
                              >
                                {/* Header (Title + Importance) */}
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h5 className="font-orbitron font-bold text-xs uppercase text-cyber-white">{topic.title}</h5>
                                    <p className="text-[10px] text-cyber-gray mt-1 leading-relaxed max-w-md">{topic.description}</p>
                                  </div>
                                  
                                  <span className={`text-[9px] uppercase font-orbitron px-2 py-0.5 border rounded-full ${importanceGlows[topic.importance]}`}>
                                    {topic.importance} priority
                                  </span>
                                </div>

                                {/* Weightage Metrics */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center border-t border-white/5 pt-3">
                                  {/* Weightage Gauge */}
                                  <div>
                                    <div className="flex justify-between text-[9px] uppercase font-orbitron text-cyber-gray mb-1">
                                      <span>Calculated Weightage</span>
                                      <span className="text-cyber-cyan font-bold">{topic.weightage}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                      <div 
                                        className="h-full bg-cyber-cyan shadow-[0_0_8px_rgba(0,240,255,0.6)]" 
                                        style={{ width: `${topic.weightage}%` }}
                                      />
                                    </div>
                                  </div>

                                  {/* Frequency Indicator */}
                                  <div className="flex items-center justify-between text-[10px] text-cyber-gray font-orbitron">
                                    <div className="flex items-center space-x-1.5">
                                      <HelpCircle size={12} className="text-cyber-purple" />
                                      <span>PYQ Appearances:</span>
                                    </div>
                                    <span className="text-cyber-purple font-bold border border-cyber-purple/20 px-2 py-0.5 rounded bg-cyber-purple/5">
                                      {topic.pyqFrequency} occurrences
                                    </span>
                                  </div>
                                </div>

                                {/* Prerequisites and Dynamic Mastery Slider */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                  {/* Prerequisites list */}
                                  <div className="flex flex-wrap gap-1 items-center">
                                    {topic.prerequisites?.length > 0 && (
                                      <>
                                        <GitCommit size={10} className="text-cyber-gray/60" />
                                        <span className="text-[9px] uppercase font-orbitron text-cyber-gray mr-1">Prereqs:</span>
                                        {topic.prerequisites.map(p => (
                                          <span key={p} className="text-[8px] border border-cyber-purple/20 bg-cyber-purple/5 text-cyber-purple font-orbitron px-1.5 py-0.25 rounded">
                                            {p}
                                          </span>
                                        ))}
                                      </>
                                    )}
                                  </div>

                                  {/* Interactive Mastery Slider */}
                                  <div>
                                    <div className="flex justify-between text-[9px] uppercase font-orbitron text-cyber-gray mb-1">
                                      <span>Your mastery level</span>
                                      <span className="text-cyber-cyan font-bold">{topic.masteryLevel}%</span>
                                    </div>
                                    <input 
                                      type="range" 
                                      min="0" 
                                      max="100" 
                                      value={topic.masteryLevel || 0}
                                      onChange={(e) => {
                                        const val = Number(e.target.value);
                                        const status = val >= 80 ? 'mastered' : val >= 20 ? 'in-progress' : 'unstarted';
                                        updateNodeMastery(topic.id, val, status);
                                      }}
                                      className="w-full accent-cyber-cyan cursor-pointer h-1 bg-white/10 rounded-lg appearance-none"
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        ) : (
          /* CASE 2: UPLOAD LANDING FORM */
          <motion.form
            key="upload-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* COLUMN 1 & 2: FILE DRAG BOXES */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              
              {/* Box A: Syllabus Upload (Required) */}
              <GlassCard glowColor="cyan" hoverScale={false}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-cyber-cyan border-b border-cyber-cyan/10 pb-3">
                    <BookOpen size={20} />
                    <h3 className="font-orbitron font-bold text-sm tracking-wider uppercase">Syllabus / Course Index (Required)</h3>
                  </div>

                  <div
                    onDragOver={(e) => handleDrag(e, 'syllabus', 'over')}
                    onDragLeave={(e) => handleDrag(e, 'syllabus', 'leave')}
                    onDrop={(e) => handleDrop(e, 'syllabus')}
                    className={`
                      border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative
                      ${isDragOver.syllabus 
                        ? 'border-cyber-cyan bg-cyber-cyan/5' 
                        : syllabusFile 
                          ? 'border-cyber-cyan/40 bg-cyber-cyan/5' 
                          : 'border-cyber-border hover:border-cyber-cyan/50 hover:bg-white/5'
                      }
                    `}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      id="syllabus-input"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleFileChange(e, 'syllabus')}
                      required
                    />
                    <UploadCloud size={36} className={`mb-3 ${syllabusFile ? 'text-cyber-cyan' : 'text-cyber-gray'}`} />
                    {syllabusFile ? (
                      <div>
                        <p className="text-sm font-semibold text-cyber-cyan font-orbitron">{syllabusFile.name}</p>
                        <p className="text-[10px] text-cyber-gray mt-1 uppercase font-orbitron">PDF file selected. Ready to ingest.</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium">Drag and drop your syllabus PDF here</p>
                        <p className="text-xs text-cyber-gray mt-1">or click to browse local folders</p>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>

              {/* Box B: Past Year Questions (PYQs) */}
              <GlassCard glowColor="purple" hoverScale={false}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-cyber-purple border-b border-cyber-purple/10 pb-3">
                    <HelpCircle size={20} />
                    <h3 className="font-orbitron font-bold text-sm tracking-wider uppercase">Past Year Questions (PYQ)</h3>
                  </div>

                  <div
                    onDragOver={(e) => handleDrag(e, 'pyq', 'over')}
                    onDragLeave={(e) => handleDrag(e, 'pyq', 'leave')}
                    onDrop={(e) => handleDrop(e, 'pyq')}
                    className={`
                      border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative
                      ${isDragOver.pyq 
                        ? 'border-cyber-purple bg-cyber-purple/5' 
                        : pyqFile 
                          ? 'border-cyber-purple/40 bg-cyber-purple/5' 
                          : 'border-cyber-border hover:border-cyber-purple/50 hover:bg-white/5'
                      }
                    `}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      id="pyq-input"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleFileChange(e, 'pyq')}
                    />
                    <UploadCloud size={28} className={`mb-3 ${pyqFile ? 'text-cyber-purple' : 'text-cyber-gray'}`} />
                    {pyqFile ? (
                      <div>
                        <p className="text-sm font-semibold text-cyber-purple font-orbitron">{pyqFile.name}</p>
                        <p className="text-[10px] text-cyber-gray mt-1 uppercase font-orbitron">PYQ PDF loaded. AI will process weights.</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium">Add PYQ question papers (Optional)</p>
                        <p className="text-xs text-cyber-gray mt-1">Ingesting exam papers triggers topic frequency mapping</p>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>

              {/* Box C: Notes & Fact Bases */}
              <GlassCard glowColor="none" hoverScale={false}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-cyber-gray border-b border-cyber-border/20 pb-3">
                    <FileText size={20} />
                    <h3 className="font-orbitron font-bold text-sm tracking-wider uppercase">Reference Notes / Fact Banks</h3>
                  </div>

                  <div
                    onDragOver={(e) => handleDrag(e, 'notes', 'over')}
                    onDragLeave={(e) => handleDrag(e, 'notes', 'leave')}
                    onDrop={(e) => handleDrop(e, 'notes')}
                    className={`
                      border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative
                      ${isDragOver.notes 
                        ? 'border-cyber-gray bg-white/5' 
                        : notesFile 
                          ? 'border-cyber-gray/40 bg-white/5' 
                          : 'border-cyber-border hover:border-cyber-gray/50 hover:bg-white/5'
                      }
                    `}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      id="notes-input"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleFileChange(e, 'notes')}
                    />
                    <UploadCloud size={28} className={`mb-3 ${notesFile ? 'text-cyber-white' : 'text-cyber-gray'}`} />
                    {notesFile ? (
                      <div>
                        <p className="text-sm font-semibold text-cyber-white font-orbitron">{notesFile.name}</p>
                        <p className="text-[10px] text-cyber-gray mt-1 uppercase font-orbitron">Fact sheets loaded for Integrity verification.</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium">Add course books, slides or notes (Optional)</p>
                        <p className="text-xs text-cyber-gray mt-1">Establishes fact references for the Misinformation Guard</p>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* COLUMN 3: FORM DETAILS & INGEST TRIGGER */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-6"
            >
              <GlassCard glowColor="cyan" hoverScale={false} className="h-full flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="flex items-center space-x-2 text-cyber-cyan font-orbitron text-xs uppercase border-b border-cyber-cyan/15 pb-2">
                    <Sparkles size={16} />
                    <span>Telemetry details</span>
                  </div>

                  {/* Course Name Input */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-orbitron text-cyber-gray tracking-wider">Course / Syllabus Title</label>
                    <input
                      type="text"
                      placeholder="e.g. CS 101: Algorithms"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      required
                      className="w-full bg-[#08090C] border border-cyber-border hover:border-cyber-cyan/40 focus:border-cyber-cyan rounded p-3 text-sm focus:outline-none focus:shadow-cyan-glow transition-all"
                    />
                  </div>

                  {/* Target Exam Date */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-orbitron text-cyber-gray tracking-wider flex items-center">
                      <Calendar size={14} className="mr-1.5 text-cyber-cyan" />
                      Target Exam Date
                    </label>
                    <input
                      type="date"
                      value={targetExamDate}
                      onChange={(e) => setTargetExamDate(e.target.value)}
                      className="w-full bg-[#08090C] border border-cyber-border hover:border-cyber-cyan/40 focus:border-cyber-cyan rounded p-3 text-sm focus:outline-none focus:shadow-cyan-glow text-cyber-white transition-all [color-scheme:dark]"
                    />
                  </div>

                  {/* Quick System Warning */}
                  <div className="p-3 bg-cyber-amber/5 rounded border border-cyber-amber/20 flex items-start space-x-2">
                    <AlertTriangle size={16} className="text-cyber-amber mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] text-cyber-gray leading-relaxed">
                      Make sure uploaded files are valid PDF structures. AI parsing processes text layers to compute syllabus weights.
                    </p>
                  </div>
                </div>

                {/* Submit Trigger */}
                <motion.button
                  type="submit"
                  disabled={!syllabusFile}
                  whileHover={{ scale: syllabusFile ? 1.02 : 1 }}
                  whileTap={{ scale: syllabusFile ? 0.98 : 1 }}
                  className={`
                    w-full mt-8 flex items-center justify-center py-4 rounded font-orbitron font-bold uppercase tracking-widest text-sm transition-all btn-cyber
                    ${syllabusFile 
                      ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] text-white' 
                      : 'bg-white/5 text-cyber-gray cursor-not-allowed border border-white/5'
                    }
                  `}
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles size={16} className="mr-2" />
                  </motion.div>
                  Compile ScholarDNA
                </motion.button>
              </GlassCard>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DNAUpload;
