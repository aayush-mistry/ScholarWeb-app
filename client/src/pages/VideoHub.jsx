import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScholarDNA } from '../context/ScholarDNAContext';
import GlassCard from '../components/common/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Video,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Download,
  HelpCircle as QuizIcon,
  Database
} from 'lucide-react';

const VideoHub = () => {
  const navigate = useNavigate();
  const { activeDNA, updateNodeMastery } = useScholarDNA();

  // HUD STATES
  const [videoUrl, setVideoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [selectedTimestamp, setSelectedTimestamp] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [syncSuccess, setSyncSuccess] = useState(false);

  // QUIZ STATES
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  // References for safe asynchronously timed operations
  const isMounted = useRef(true);
  const analysisTimer = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (analysisTimer.current) clearTimeout(analysisTimer.current);
    };
  }, []);

  // -----------------------------
  // MOCK DATA
  // -----------------------------
  const mockTranscript = [
    { time: 0, text: 'Welcome back! Today we are diving into algorithmic asymptotic analysis.', nodeId: 'big_o_analysis' },
    { time: 35, text: 'CPU resource allocations depend directly on inputs.', nodeId: 'big_o_analysis' },
    { time: 82, text: 'Big-O defines the absolute worst-case scenario.', nodeId: 'big_o_analysis' },
    { time: 145, text: 'Linked lists allocate nodes dynamically.', nodeId: 'linked_lists' },
    { time: 210, text: 'Head insertions are O(1).', nodeId: 'linked_lists' }
  ];

  const mockCoveredTopics = [
    {
      topicId: 'big_o_analysis',
      title: 'Time & Space Complexity',
      unitNumber: 1,
      unitTitle: 'Complexity & Linear Structures',
      timestamp: 0,
      importance: 'high',
      pyqFrequency: 8,
      weightage: 18,
      keyConcept: 'Asymptotic worst-case upper boundary guarantees.'
    },
    {
      topicId: 'linked_lists',
      title: 'Singly & Doubly Linked Lists',
      unitNumber: 1,
      unitTitle: 'Complexity & Linear Structures',
      timestamp: 145,
      importance: 'medium',
      pyqFrequency: 3,
      weightage: 12,
      keyConcept: 'Dynamic pointer-linked memory node allocations.'
    }
  ];

  const mockQuiz = [
    {
      question: 'Which notation represents worst-case upper bound?',
      options: ['Big-O (O)', 'Big-Omega (Ω)', 'Big-Theta (Θ)', 'Little-o (o)'],
      correct: 0,
      explanation: 'Big-O represents asymptotic upper bound.'
    },
    {
      question: 'Worst-case search complexity in singly linked list?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      correct: 2,
      explanation: 'Traversal is sequential therefore O(N).'
    }
  ];

  const mockLectureNotes = `
# ScholarWeb AI Notes

## Big-O Complexity
- Worst-case upper bound
- Runtime analysis

## Linked Lists
- Dynamic memory allocation
- O(1) insertion at head
`;

  // Dynamic maximum calculation for track progress bar matching
  const maxVideoTime = mockTranscript?.length > 0 
    ? Math.max(...mockTranscript.map(t => t.time)) + 30 
    : 240;

  // -----------------------------
  // ANALYZE HANDLER
  // -----------------------------
  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!videoUrl) return;

    setIsAnalyzing(true);
    setSyncSuccess(false);

    const steps = [
      { msg: 'Connecting to media source stream...', time: 800 },
      { msg: 'Extracting vocabulary transcript vectors...', time: 800 },
      { msg: 'Mapping topic timeline boundaries...', time: 800 },
      { msg: 'Calculating PYQ priorities...', time: 600 },
      { msg: 'Scaffolding markdown study logs...', time: 500 }
    ];

    let currentStep = 0;

    const runSteps = () => {
      if (!isMounted.current) return;

      if (currentStep < steps.length) {
        setAnalysisStatus(steps[currentStep].msg);
        analysisTimer.current = setTimeout(() => {
          currentStep++;
          runSteps();
        }, steps[currentStep].time);
      } else {
        setIsAnalyzing(false);
        setAnalyzed(true);
      }
    };

    runSteps();
  };

  // -----------------------------
  // EXPORT NOTES
  // -----------------------------
  const handleExportMarkdown = () => {
    const blob = new Blob([mockLectureNotes], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'scholar_notes.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // -----------------------------
  // SYNC DNA
  // -----------------------------
  const handleSyncToDNA = () => {
    updateNodeMastery?.('big_o_analysis', 65, 'in-progress');
    setSyncSuccess(true);
  };

  // -----------------------------
  // QUIZ SUBMIT
  // -----------------------------
  const handleAnswerSubmit = () => {
    if (selectedOption === null || !mockQuiz?.[currentQuestion]) return;

    const isCorrect = selectedOption === mockQuiz[currentQuestion]?.correct;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
    setShowExplanation(true);
  };

  // -----------------------------
  // NEXT QUESTION
  // -----------------------------
  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);

    const totalQuestions = mockQuiz?.length || 0;

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setQuizComplete(true);
      updateNodeMastery?.('big_o_analysis', 70, 'in-progress');
    }
  };

  // -----------------------------
  // RESETS
  // -----------------------------
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizScore(0);
    setQuizComplete(false);
  };

  const handleResetAnalyzer = () => {
    if (analysisTimer.current) clearTimeout(analysisTimer.current);
    setVideoUrl('');
    setAnalyzed(false);
    setIsAnalyzing(false);
    resetQuiz();
  };

  return (
    <div className="space-y-8 select-none">
      {/* HEADER */}
      <div className="border-b border-cyber-border/20 pb-4 flex justify-between items-center">
        <div>
          <h1 className="font-orbitron font-bold text-2xl text-cyber-cyan">
            VIDEO LECTURE ANALYZER
          </h1>
          <p className="text-xs text-cyber-gray mt-1">
            AI powered lecture indexing system.
          </p>
        </div>

        {analyzed && (
          <button
            onClick={handleResetAnalyzer}
            className="flex items-center px-4 py-2 border border-cyber-cyan/30 rounded transition-colors hover:bg-cyber-cyan/10"
          >
            <RotateCcw size={14} className="mr-2" />
            Reset
          </button>
        )}
      </div>

      {/* ACTIVE DNA BLOCK */}
      {activeDNA ? (
        <AnimatePresence mode="wait">
          {!analyzed ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto"
            >
              <GlassCard glowColor="cyan">
                <form onSubmit={handleAnalyze} className="space-y-6">
                  <div className="text-center">
                    <Video size={48} className="mx-auto text-cyber-cyan" />
                    <h3 className="mt-4 font-bold">Feed Video URL</h3>
                  </div>

                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Paste YouTube URL"
                    required
                    disabled={isAnalyzing}
                    className="w-full p-3 rounded bg-black border border-cyber-border text-white focus:outline-none focus:border-cyber-cyan"
                  />

                  <button
                    type="submit"
                    disabled={isAnalyzing || !videoUrl}
                    className="w-full py-3 rounded bg-cyber-cyan text-black font-bold transition-opacity disabled:opacity-50"
                  >
                    {isAnalyzing ? analysisStatus : 'Analyze Video'}
                  </button>
                </form>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* LEFT SIDE */}
              <div className="lg:col-span-2 space-y-6">
                {/* PLAYER */}
                <GlassCard glowColor="cyan">
                  <div className="aspect-video bg-black flex items-center justify-center relative rounded overflow-hidden">
                    <Play size={44} className="text-cyber-cyan" />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                      <div
                        className="h-full bg-cyber-cyan transition-all duration-300"
                        style={{
                          width: `${Math.min((selectedTimestamp / maxVideoTime) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </GlassCard>

                {/* TOPICS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockCoveredTopics?.map((topic, idx) => (
                    <motion.div
                      key={topic?.topicId || idx}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedTimestamp(topic?.timestamp || 0)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTimestamp === topic?.timestamp
                          ? 'border-cyber-cyan bg-cyber-cyan/5'
                          : 'border-cyber-border bg-transparent'
                      }`}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-bold text-cyber-white">{topic?.title}</h4>
                        <span className="text-cyber-cyan text-xs">{topic?.weightage}%</span>
                      </div>
                      <p className="text-xs text-cyber-gray mt-2">{topic?.keyConcept}</p>
                    </motion.div>
                  ))}
                </div>

                {/* EXPORT / SYNC */}
                <GlassCard>
                  <div className="flex gap-4">
                    <button
                      onClick={handleExportMarkdown}
                      className="px-4 py-2 border border-cyber-border rounded flex items-center hover:bg-white/5 transition-colors"
                    >
                      <Download size={14} className="mr-2" />
                      Export
                    </button>

                    {!syncSuccess ? (
                      <button
                        onClick={handleSyncToDNA}
                        className="px-4 py-2 bg-cyber-cyan text-black rounded flex items-center font-semibold hover:opacity-90 transition-opacity"
                      >
                        <Database size={14} className="mr-2" />
                        Sync DNA
                      </button>
                    ) : (
                      <div className="px-4 py-2 border border-green-500 text-green-400 rounded flex items-center bg-green-500/10">
                        <CheckCircle2 size={14} className="mr-2" />
                        Synced
                      </div>
                    )}
                  </div>
                </GlassCard>

                {/* TRANSCRIPT */}
                <GlassCard glowColor="purple">
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {mockTranscript?.map((t, idx) => {
                      const isPlaying = selectedTimestamp === t?.time;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedTimestamp(t?.time || 0)}
                          className={`p-3 rounded cursor-pointer border transition-all ${
                            isPlaying
                              ? 'border-cyber-cyan bg-cyber-cyan/10 text-white'
                              : 'border-transparent bg-white/5 text-cyber-gray hover:bg-white/10'
                          }`}
                        >
                          <p className="text-xs">{t?.text}</p>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </div>

              {/* RIGHT SIDE - QUIZ */}
              <div>
                <GlassCard glowColor="amber">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <QuizIcon size={16} className="mr-2 text-cyber-amber" />
                      <h3 className="font-bold text-xs uppercase tracking-wider text-cyber-white">
                        Quiz
                      </h3>
                    </div>

                    {!quizComplete ? (
                      <div className="space-y-4">
                        <div className="flex justify-between text-xs text-cyber-gray">
                          <span>Question {currentQuestion + 1} of {mockQuiz?.length}</span>
                          <span>Score: {quizScore}</span>
                        </div>

                        <h4 className="text-sm font-semibold text-cyber-white">
                          {mockQuiz?.[currentQuestion]?.question || 'No question found'}
                        </h4>

                        <div className="space-y-2">
                          {mockQuiz?.[currentQuestion]?.options?.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => !showExplanation && setSelectedOption(idx)}
                              disabled={showExplanation}
                              className={`w-full text-left p-3 rounded border text-xs transition-all ${
                                selectedOption === idx
                                  ? 'bg-cyber-cyan/10 border-cyber-cyan text-white'
                                  : 'bg-black/20 border-cyber-border text-cyber-gray hover:bg-black/40'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>

                        {!showExplanation ? (
                          <button
                            onClick={handleAnswerSubmit}
                            disabled={selectedOption === null}
                            className="w-full py-3 rounded bg-cyber-cyan text-black font-bold text-sm transition-opacity disabled:opacity-50"
                          >
                            Submit
                          </button>
                        ) : (
                          <div className="space-y-3 pt-2 border-t border-cyber-border/30">
                            {selectedOption === mockQuiz?.[currentQuestion]?.correct ? (
                              <div className="text-green-400 flex items-center text-sm font-medium">
                                <CheckCircle2 size={16} className="mr-2" />
                                Correct!
                              </div>
                            ) : (
                              <div className="text-red-400 flex items-center text-sm font-medium">
                                <XCircle size={16} className="mr-2" />
                                Incorrect
                              </div>
                            )}

                            <p className="text-xs text-cyber-gray leading-relaxed">
                              {mockQuiz?.[currentQuestion]?.explanation}
                            </p>

                            <button
                              onClick={handleNextQuestion}
                              className="w-full py-3 rounded bg-cyber-purple text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                              {currentQuestion >= (mockQuiz?.length || 0) - 1
                                ? 'Finish Quiz'
                                : 'Next Question'}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center space-y-4 py-6">
                        <CheckCircle2 size={40} className="mx-auto text-green-400" />
                        <h3 className="font-bold text-cyber-white">Quiz Complete</h3>
                        <p className="text-sm text-cyber-gray">
                          Score: {quizScore} / {mockQuiz?.length}
                        </p>
                        <button
                          onClick={resetQuiz}
                          className="px-4 py-2 rounded border border-cyber-cyan text-cyber-cyan text-xs font-semibold hover:bg-cyber-cyan/10 transition-colors"
                        >
                          Reset Quiz
                        </button>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        /* OFFLINE HOLDER */
        <div className="text-center py-20">
          <Video size={48} className="mx-auto text-cyber-gray" />
          <h2 className="mt-4 font-bold text-lg text-cyber-white">VIDEO PARSER OFFLINE</h2>
          <p className="text-sm text-cyber-gray mt-2">Upload your syllabus first.</p>
          <button
            onClick={() => navigate('/upload')}
            className="mt-6 px-6 py-3 rounded bg-cyber-cyan text-black font-bold transition-transform hover:scale-105"
          >
            Upload DNA
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoHub;