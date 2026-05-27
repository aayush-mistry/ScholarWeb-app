import React, { useState, useRef } from 'react';
import { useScholarDNA } from '../context/ScholarDNAContext';
import GlassCard from '../components/common/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Upload,
  FileText,
  Target,
  Brain,
  ChevronRight
} from 'lucide-react';

const Guard = () => {
  const { activeDNA } = useScholarDNA();
  const fileInputRef = useRef(null);
  
  // States
  const [claimText, setClaimText] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!claimText && !uploadedFile) return;

    setIsVerifying(true);
    // Simulate Fact Ingestion Scan
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
    }, 2500);
  };

  const handleFileUpload = (file) => {
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setClaimText(e.target.result);
        setUploadedFile(file);
      };
      reader.readAsText(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Mock verification outputs checking against ScholarDNA facts
  const mockVerifications = {
    score: 65,
    claims: [
      {
        text: "Average searching complexity in a Skewed Binary Search Tree is always O(log N).",
        isAccurate: false,
        correction: "In a skewed Binary Search Tree (where nodes lean strictly in one direction, mimicking a linked list), the search complexity degrades to worst-case O(N). Average O(log N) is only guaranteed if the tree remains balanced.",
        nodeId: "binary_trees",
        confidence: 0.15,
        topicMatch: "Binary Search Trees",
        relevanceScore: 0.85
      },
      {
        text: "Self-Balancing AVL Trees guarantee O(log N) worst-case search by enforcing node balancing factors.",
        isAccurate: true,
        correction: null,
        nodeId: "avl_trees",
        confidence: 0.95,
        topicMatch: "AVL Trees",
        relevanceScore: 0.92
      },
      {
        text: "Red-Black Trees maintain balance through color properties and rotations.",
        isAccurate: true,
        correction: null,
        nodeId: "red_black_trees",
        confidence: 0.88,
        topicMatch: "Red-Black Trees",
        relevanceScore: 0.78
      }
    ]
  };

  const handleReset = () => {
    setClaimText('');
    setVerified(false);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Text highlighting component with underline visualization
  const TextHighlighter = ({ text, isAccurate, confidence }) => {
    const underlineColor = isAccurate ? 'border-green-500' : 'border-red-500';
    const glowAnimation = isAccurate ? 'underline-green-animated' : 'underline-red-animated';
    const bgColor = isAccurate ? 'bg-green-500/5' : 'bg-red-500/5';
    
    return (
      <span className={`relative inline-block border-b-2 ${underlineColor} ${glowAnimation} ${bgColor} px-1 py-0.5 transition-all duration-300 cursor-pointer hover:opacity-80`}>
        {text}
      </span>
    );
  };

  // Confidence indicator component
  const ConfidenceIndicator = ({ confidence }) => {
    const percentage = Math.round(confidence * 100);
    const color = confidence >= 0.8 ? 'text-green-400' : confidence >= 0.5 ? 'text-yellow-400' : 'text-red-400';
    const barColor = confidence >= 0.8 ? 'bg-green-500' : confidence >= 0.5 ? 'bg-yellow-500' : 'bg-red-500';
    
    return (
      <div className="flex items-center space-x-2">
        <span className={`text-[10px] font-orbitron font-bold ${color}`}>{percentage}%</span>
        <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full ${barColor}`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 select-none">
      {/* HEADER SECTION */}
      <div className="border-b border-cyber-border/20 pb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-orbitron font-extrabold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple">
            TRUTH INTEGRITY GUARD
          </h1>
          <p className="text-xs text-cyber-gray mt-1 uppercase tracking-wider">
            Validate external learning claims, notes, and AI answers against the course fact base in ScholarDNA.
          </p>
        </div>
      </div>

      {activeDNA ? (
        <AnimatePresence mode="wait">

          {/* STATE A / B: Verify form or results (single child for AnimatePresence) */}
          {!verified ? (
            <motion.div
              key="verify-input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-3xl mx-auto py-6"
            >
              <GlassCard glowColor="amber" hoverScale={false}>
                <form onSubmit={handleVerify} className="space-y-6">
                  <div className="flex items-center space-x-3 text-cyber-amber border-b border-cyber-amber/15 pb-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ShieldAlert size={20} />
                    </motion.div>
                    <h3 className="font-orbitron font-bold text-sm tracking-wider uppercase">Claim Verification Console</h3>
                  </div>

                  {/* File Upload Area */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
                      dragActive 
                        ? 'border-cyber-cyan bg-cyber-cyan/5 scale-105' 
                        : 'border-cyber-border/30 hover:border-cyber-cyan/50 hover:scale-102'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt"
                      onChange={handleFileInputChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center cursor-pointer space-y-3"
                    >
                      <motion.div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          uploadedFile ? 'bg-green-500/20' : 'bg-cyber-cyan/10'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {uploadedFile ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <FileText className="text-green-400" size={24} />
                          </motion.div>
                        ) : (
                          <Upload className="text-cyber-cyan" size={24} />
                        )}
                      </motion.div>
                      <div className="text-center">
                        <p className="text-xs font-orbitron text-cyber-white">
                          {uploadedFile ? uploadedFile.name : 'Drag & drop study notes or click to upload'}
                        </p>
                        <p className="text-[10px] text-cyber-gray mt-1">Supports .txt files</p>
                      </div>
                    </label>
                    {uploadedFile && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        type="button"
                        onClick={() => {
                          setUploadedFile(null);
                          setClaimText('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 text-cyber-gray hover:text-red-400 transition-colors hover:scale-110"
                      >
                        <XCircle size={16} />
                      </motion.button>
                    )}
                  </motion.div>

                  <div className="flex items-center space-x-2 text-cyber-gray/50">
                    <div className="flex-1 h-px bg-cyber-border/30"></div>
                    <span className="text-[10px] uppercase font-orbitron">or paste directly</span>
                    <div className="flex-1 h-px bg-cyber-border/30"></div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase font-orbitron text-cyber-gray tracking-wider">
                      Paste statement, study guide notes, or chatGPT answers to verify:
                    </label>
                    <textarea
                      rows={6}
                      placeholder="e.g. Average searching complexity in a Skewed Binary Search Tree is always O(log N)..."
                      value={claimText}
                      onChange={(e) => setClaimText(e.target.value)}
                      required
                      className="w-full bg-[#08090C] border border-cyber-border hover:border-cyber-amber/40 focus:border-cyber-amber rounded p-3.5 text-xs focus:outline-none focus:shadow-amber-glow text-cyber-white transition-all font-orbitron leading-relaxed"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isVerifying || (!claimText && !uploadedFile)}
                    className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-cyber-amber to-cyber-purple rounded font-orbitron font-bold uppercase text-xs tracking-widest text-white shadow-amber-glow transition-all btn-cyber disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    whileHover={{ scale: !isVerifying && (claimText || uploadedFile) ? 1.02 : 1 }}
                    whileTap={{ scale: !isVerifying && (claimText || uploadedFile) ? 0.98 : 1 }}
                  >
                    {isVerifying ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <RotateCcw size={14} className="mr-2" />
                        </motion.div>
                        Comparing against core postulates...
                      </>
                    ) : (
                      <>
                        <motion.div
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Sparkles size={14} className="mr-2" />
                        </motion.div>
                        Verify Fact Integrity
                      </>
                    )}
                  </motion.button>
                </form>
              </GlassCard>
            </motion.div>
          ) : (
            /* STATE B: VERIFIED DETAILED OUTPUTS */
            <motion.div
              key="verify-results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Telemetry Integrity Score (Column 1) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="space-y-6"
              >
                <GlassCard glowColor="amber" hoverScale={false}>
                  <div className="space-y-6 text-center">
                    <div className="border-b border-cyber-amber/15 pb-2 text-left">
                      <span className="text-[10px] uppercase font-orbitron text-cyber-amber/60 tracking-wider">Integrity Audit</span>
                      <h3 className="font-orbitron font-bold text-sm uppercase text-cyber-white mt-0.5">Credibility Summary</h3>
                    </div>

                    {/* Glowing Score Arc */}
                    <div className="flex flex-col items-center py-4">
                      <motion.div 
                        className="h-28 w-28 rounded-full border-4 border-cyber-amber/20 flex items-center justify-center relative shadow-amber-glow"
                        animate={{ boxShadow: ['0 0 20px rgba(255,153,0,0.2)', '0 0 40px rgba(255,153,0,0.4)', '0 0 20px rgba(255,153,0,0.2)'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <div className="text-center">
                          <motion.span 
                            className="text-3xl font-extrabold font-orbitron text-cyber-amber"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            {mockVerifications.score}%
                          </motion.span>
                          <span className="text-[8px] uppercase font-orbitron text-cyber-gray block mt-0.5">FACTUAL</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Topic Match Summary */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-orbitron text-cyber-gray">
                        <span>Topics Detected</span>
                        <span className="text-cyber-cyan">{mockVerifications.claims.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {mockVerifications.claims.map((claim, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-cyber-purple/10 border border-cyber-purple/20 rounded text-[9px] font-orbitron text-cyber-purple"
                          >
                            {claim.topicMatch}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-cyber-amber/5 rounded border border-cyber-amber/20 text-[10px] text-cyber-gray leading-relaxed text-left flex items-start space-x-2">
                      <AlertTriangle size={16} className="text-cyber-amber flex-shrink-0 mt-0.5" />
                      <span>
                        Factual anomalies identified. The audited text diverges from the verified syllabus postulates stored in your ScholarDNA.
                      </span>
                    </div>

                    <motion.button
                      onClick={handleReset}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-2 border border-cyber-cyan/30 hover:border-cyber-cyan/60 bg-cyber-cyan/5 hover:bg-cyber-cyan/10 rounded font-orbitron uppercase text-[10px] tracking-widest text-cyber-cyan transition-all btn-cyber"
                    >
                      Audit Another Claim
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Paragraph Comparison View (Column 2 & 3) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="lg:col-span-2 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-cyber-border/20 pb-2">
                  <h3 className="font-orbitron font-bold text-xs uppercase tracking-widest text-cyber-gray">
                    Paragraph Comparison Analysis
                  </h3>
                  <div className="flex items-center space-x-4 text-[9px] font-orbitron">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-0.5 bg-green-500"></div>
                      <span className="text-cyber-gray">Correct</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-0.5 bg-red-500"></div>
                      <span className="text-cyber-gray">Misinformation</span>
                    </div>
                  </div>
                </div>

                {/* Original Text with Inline Highlights */}
                <GlassCard glowColor="cyan" hoverScale={false}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-cyber-cyan border-b border-cyber-cyan/15 pb-2">
                      <FileText size={16} />
                      <h4 className="font-orbitron font-bold text-[10px] uppercase tracking-wider">Analyzed Content</h4>
                      <div className="flex items-center space-x-1 ml-auto">
                        <Brain size={12} className="text-cyber-cyan animate-pulse" />
                        <span className="text-[8px] font-orbitron text-cyber-cyan/80">AI ANALYZED</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-[#08090C] rounded-lg border border-cyber-border/30 scan-effect">
                      <div className="text-sm leading-relaxed font-orbitron text-cyber-white space-y-3">
                        {mockVerifications.claims.map((claim, idx) => (
                          <p key={idx} className="relative">
                            <TextHighlighter 
                              text={claim.text} 
                              isAccurate={claim.isAccurate} 
                              confidence={claim.confidence}
                            />
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Detailed Analysis Cards */}
                <div className="space-y-3">
                  {mockVerifications.claims.map((claim, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`
                        p-4 rounded-xl border bg-[#131722]/35 backdrop-blur-md transition-all space-y-3 relative overflow-hidden
                        ${claim.isAccurate 
                          ? 'border-green-500/20 hover:border-green-500/40 shadow-[0_0_8px_rgba(34,197,94,0.05)]' 
                          : 'border-cyber-amber/20 hover:border-cyber-amber/40 shadow-[0_0_8px_rgba(255,153,0,0.05)]'
                        }
                      `}
                    >
                      {/* Header with confidence and topic */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {claim.isAccurate ? (
                            <CheckCircle className="text-green-400 h-4 w-4" />
                          ) : (
                            <XCircle className="text-cyber-amber h-4 w-4" />
                          )}
                          <span className={`font-orbitron font-bold text-[10px] uppercase tracking-wider ${claim.isAccurate ? 'text-green-400' : 'text-cyber-amber'}`}>
                            {claim.isAccurate ? 'FACT ACCURATE' : 'MISINFORMATION ANOMALY'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <ConfidenceIndicator confidence={claim.confidence} />
                          <span className="text-[8px] uppercase font-orbitron text-cyber-purple/80 border border-cyber-purple/20 bg-cyber-purple/5 px-2 py-0.5 rounded">
                            {claim.topicMatch}
                          </span>
                        </div>
                      </div>

                      {/* Claim text with highlight */}
                      <div className="pl-6">
                        <TextHighlighter 
                          text={claim.text} 
                          isAccurate={claim.isAccurate} 
                          confidence={claim.confidence}
                        />
                      </div>

                      {/* Relevance Score */}
                      <div className="flex items-center space-x-2 pl-6">
                        <Target size={12} className="text-cyber-cyan" />
                        <span className="text-[9px] font-orbitron text-cyber-gray">Relevance:</span>
                        <span className="text-[9px] font-orbitron text-cyber-cyan">
                          {Math.round(claim.relevanceScore * 100)}%
                        </span>
                      </div>

                      {/* Correction quote */}
                      {!claim.isAccurate && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-cyber-purple/5 border border-cyber-purple/10 rounded-lg pl-3 ml-6 space-y-2"
                        >
                          <div className="flex items-center space-x-1.5 text-cyber-cyan font-orbitron text-[9px] uppercase tracking-widest">
                            <BookOpen size={12} />
                            <span>Official Syllabus Truth (ScholarDNA Reference)</span>
                          </div>
                          <p className="text-[10px] text-cyber-gray leading-relaxed font-orbitron">
                            {claim.correction}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

            </motion.div>
            )}

        </AnimatePresence>
      ) : (
        /* DISCONNECT TERMINAL STATE */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-full max-w-lg space-y-6">
            <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto shadow-glass">
              <ShieldAlert size={28} className="text-cyber-gray animate-pulse" />
            </div>

            <div>
              <h2 className="font-orbitron font-bold text-lg tracking-wider text-cyber-white">INTEGRITY GUARD OFFLINE</h2>
              <p className="text-xs text-cyber-gray leading-relaxed max-w-sm mx-auto mt-2">
                ScholarDNA model is missing. Please sync your syllabus to establish factual integrity reference banks.
              </p>
            </div>

            <button
              onClick={() => navigate('/upload')}
              className="px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded font-orbitron font-bold uppercase text-xs tracking-widest text-white shadow-cyan-glow hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all hover:scale-105"
            >
              Verify Fact blueprint
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guard;
