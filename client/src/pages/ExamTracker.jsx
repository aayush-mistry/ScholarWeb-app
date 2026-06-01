import React, { useState, useRef, useEffect } from 'react';
import { useScholarDNA } from '../context/ScholarDNAContext';
import GlassCard from '../components/common/GlassCard';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarRange, 
  Sparkles, 
  Clock, 
  CheckSquare, 
  Square,
  AlertCircle,
  BrainCircuit,
  Bookmark,
  Upload,
  FileText,
  Bell,
  TrendingUp,
  Target,
  Calendar,
  ChevronRight
} from 'lucide-react';

const ExamTracker = () => {
  const { activeDNA, updateNodeMastery } = useScholarDNA();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // States
  const [uploadedTimetable, setUploadedTimetable] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [showReminderSettings, setShowReminderSettings] = useState(false);

  // Calculate days remaining to target exam
  const calculateDaysRemaining = () => {
    if (!activeDNA || !activeDNA.targetExamDate) return null;
    const diffTime = new Date(activeDNA.targetExamDate) - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = calculateDaysRemaining();

  // Calculate syllabus completion
  const calculateSyllabusCompletion = () => {
    if (!activeDNA || !activeDNA.units) return { covered: 0, left: 0, percentage: 0 };
    
    let totalTopics = 0;
    let coveredTopics = 0;
    
    activeDNA.units.forEach(unit => {
      unit.topics.forEach(topic => {
        totalTopics++;
        if (topic.masteryLevel >= 80) {
          coveredTopics++;
        }
      });
    });
    
    const leftTopics = totalTopics - coveredTopics;
    const percentage = totalTopics > 0 ? Math.round((coveredTopics / totalTopics) * 100) : 0;
    
    return { covered: coveredTopics, left: leftTopics, percentage, total: totalTopics };
  };

  const syllabusCompletion = calculateSyllabusCompletion();

  // File upload handlers
  const handleTimetableUpload = (file) => {
    if (file && (file.type === 'text/plain' || file.type === 'application/json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target.result);
          setUploadedTimetable(content);
        } catch {
          // If not JSON, treat as plain text
          setUploadedTimetable({ raw: e.target.result, fileName: file.name });
        }
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
      handleTimetableUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleTimetableUpload(e.target.files[0]);
    }
  };

  // Reminder system
  const addReminder = (daysBefore, message) => {
    const newReminder = {
      id: Date.now(),
      daysBefore,
      message,
      enabled: true
    };
    setReminders([...reminders, newReminder]);
  };

  const toggleReminder = (id) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  // Initialize default reminders
  useEffect(() => {
    if (reminders.length === 0) {
      addReminder(7, 'One week until exam! Final review phase.');
      addReminder(3, '3 days remaining - Focus on weak areas.');
      addReminder(1, 'Exam tomorrow! Good luck!');
    }
  }, []);

  // Compile list of study schedule tasks dynamically based on topic mastery levels
  const getDynamicRevisionTasks = () => {
    if (!activeDNA || !activeDNA.units) return [];
    
    const tasks = [];
    activeDNA.units.forEach(unit => {
      unit.topics.forEach(topic => {
        // Only generate tasks for topics that are not fully mastered yet
        if (topic.masteryLevel < 90) {
          // Priority score = (Importance weight) / (Mastery Level + 1)
          const importanceMultiplier = topic.importance === 'high' ? 3 : topic.importance === 'medium' ? 2 : 1;
          const priorityScore = (importanceMultiplier * 100) / (topic.masteryLevel + 1);

          tasks.push({
            id: topic.id,
            title: `Master: ${topic.title}`,
            description: `Review subtopics and complete dynamic quiz check-offs`,
            topicTitle: topic.title,
            mastery: topic.masteryLevel,
            importance: topic.importance,
            priorityScore
          });
        }
      });
    });

    // Sort tasks by priority score descending (higher score = more urgent)
    return tasks.sort((a, b) => b.priorityScore - a.priorityScore);
  };

  const revisionQueue = getDynamicRevisionTasks();

  return (
    <div className="space-y-8 select-none">
      {/* HEADER SECTION */}
      <div className="border-b border-cyber-border/20 pb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-orbitron font-extrabold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple">
            SYLLABUS tracker & EXAM HUD
          </h1>
          <p className="text-xs text-cyber-gray mt-1 uppercase tracking-wider">
            Monitor target exam countdown deadlines and prioritize daily study queues.
          </p>
        </div>
      </div>

      {activeDNA ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          
          {/* COLUMN 1: COUNTDOWN CARDS & PROGRESS */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Countdown Card */}
            <GlassCard glowColor="purple" hoverScale={false}>
              <div className="space-y-6">
                <div className="border-b border-cyber-purple/15 pb-2">
                  <span className="text-[10px] uppercase font-orbitron text-cyber-purple/60 tracking-wider">Exam telemetry</span>
                  <h3 className="font-orbitron font-bold text-sm uppercase text-cyber-white mt-0.5">Countdown Node</h3>
                </div>

                {daysRemaining !== null ? (
                  <div className="text-center space-y-2 py-4">
                    <div className="inline-block relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      >
                        <Clock size={40} className="text-cyber-purple mx-auto" />
                      </motion.div>
                      <div className="absolute inset-0 bg-cyber-purple/20 blur-xl rounded-full pointer-events-none" />
                    </div>
                    <div>
                      <motion.h2 
                        className="text-4xl font-extrabold font-orbitron text-cyber-white"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        {daysRemaining} Days
                      </motion.h2>
                      <p className="text-[10px] text-cyber-gray uppercase font-orbitron tracking-widest mt-1">Remaining until Target</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-cyber-gray font-orbitron text-xs">
                    ⚠️ No target exam date synced. Ingest dates in upload module.
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Progress Partitions - Exactly Two Clean Partitions */}
            <GlassCard glowColor="cyan" hoverScale={false}>
              <div className="space-y-4">
                <div className="border-b border-cyber-cyan/15 pb-2">
                  <span className="text-[10px] uppercase font-orbitron text-cyber-cyan/60 tracking-wider">Syllabus Progress</span>
                  <h3 className="font-orbitron font-bold text-sm uppercase text-cyber-white mt-0.5">Completion Status</h3>
                </div>

                {/* Percentage Display */}
                <div className="text-center py-4">
                  <div className="relative inline-block">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="rgba(0, 240, 255, 0.2)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <motion.circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - syllabusCompletion.percentage / 100)}`}
                        className="text-cyber-cyan"
                        initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - syllabusCompletion.percentage / 100) }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-extrabold font-orbitron text-cyber-cyan">
                        {syllabusCompletion.percentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Two Clean Progress Partitions */}
                <div className="space-y-3">
                  {/* Covered Partition */}
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <CheckSquare className="text-green-400" size={16} />
                        <span className="font-orbitron font-bold text-xs uppercase text-green-400">Covered</span>
                      </div>
                      <span className="text-lg font-extrabold font-orbitron text-green-400">{syllabusCompletion.covered}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(syllabusCompletion.covered / syllabusCompletion.total) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-green-500"
                      />
                    </div>
                  </div>

                  {/* Left Partition */}
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Square className="text-red-400" size={16} />
                        <span className="font-orbitron font-bold text-xs uppercase text-red-400">Left</span>
                      </div>
                      <span className="text-lg font-extrabold font-orbitron text-red-400">{syllabusCompletion.left}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(syllabusCompletion.left / syllabusCompletion.total) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Exam Timetable Upload */}
            <GlassCard glowColor="amber" hoverScale={false}>
              <div className="space-y-4">
                <div className="border-b border-cyber-amber/15 pb-2">
                  <span className="text-[10px] uppercase font-orbitron text-cyber-amber/60 tracking-wider">Exam Schedule</span>
                  <h3 className="font-orbitron font-bold text-sm uppercase text-cyber-white mt-0.5">Timetable Upload</h3>
                </div>

                <div
                  className={`relative border-2 border-dashed rounded-lg p-4 transition-all ${
                    dragActive 
                      ? 'border-cyber-cyan bg-cyber-cyan/5' 
                      : 'border-cyber-border/30 hover:border-cyber-cyan/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.json"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="timetable-upload"
                  />
                  <label
                    htmlFor="timetable-upload"
                    className="flex flex-col items-center justify-center cursor-pointer space-y-2"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      uploadedTimetable ? 'bg-green-500/20' : 'bg-cyber-cyan/10'
                    }`}>
                      {uploadedTimetable ? (
                        <FileText className="text-green-400" size={20} />
                      ) : (
                        <Upload className="text-cyber-cyan" size={20} />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-orbitron text-cyber-white">
                        {uploadedTimetable ? 'Timetable uploaded' : 'Drag & drop timetable'}
                      </p>
                      <p className="text-[9px] text-cyber-gray mt-0.5">.txt or .json</p>
                    </div>
                  </label>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* COLUMN 2 & 3: UNIT-WISE TRACKING & TIMELINE */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Unit-wise Tracking with Visual Progress Bars */}
            <GlassCard glowColor="cyan" hoverScale={false}>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-cyber-cyan/15 pb-2">
                  <div className="flex items-center space-x-2 text-cyber-cyan">
                    <Target size={16} />
                    <h3 className="font-orbitron font-bold text-xs uppercase tracking-wider">Unit-wise Progress</h3>
                  </div>
                  <span className="text-[9px] font-orbitron text-cyber-gray">{syllabusCompletion.total} Total Topics</span>
                </div>

                {activeDNA && activeDNA.units ? (
                  <div className="space-y-4">
                    {activeDNA.units.map((unit, unitIdx) => {
                      const unitTopics = unit.topics;
                      const unitCovered = unitTopics.filter(t => t.masteryLevel >= 80).length;
                      const unitPercentage = Math.round((unitCovered / unitTopics.length) * 100);
                      
                      return (
                        <div key={unitIdx} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <ChevronRight className="text-cyber-cyan" size={14} />
                              <span className="font-orbitron font-bold text-xs text-cyber-white">{unit.title}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-[10px] font-orbitron text-cyber-gray">
                                {unitCovered}/{unitTopics.length}
                              </span>
                              <span className={`text-xs font-bold font-orbitron ${
                                unitPercentage >= 80 ? 'text-green-400' : unitPercentage >= 50 ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {unitPercentage}%
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${unitPercentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full ${
                                unitPercentage >= 80 ? 'bg-green-500' : unitPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-cyber-gray/60 font-orbitron text-xs">
                    No units available
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Calendar/Timeline Section */}
            <GlassCard glowColor="purple" hoverScale={false}>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-cyber-purple border-b border-cyber-purple/15 pb-2">
                  <Calendar size={16} />
                  <h3 className="font-orbitron font-bold text-xs uppercase tracking-wider">Exam Timeline</h3>
                </div>

                <div className="space-y-3">
                  {/* Timeline Items */}
                  <div className="relative pl-6">
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-cyber-purple/30"></div>
                    
                    {daysRemaining !== null && (
                      <>
                        <div className="relative mb-4">
                          <div className="absolute -left-4 w-3 h-3 bg-cyber-purple rounded-full border-2 border-cyber-purple/50"></div>
                          <div className="p-3 bg-cyber-purple/10 border border-cyber-purple/20 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-orbitron font-bold text-xs text-cyber-purple">Today</span>
                              <span className="text-[9px] font-orbitron text-cyber-gray">{new Date().toLocaleDateString()}</span>
                            </div>
                            <p className="text-[10px] text-cyber-gray mt-1">Start focused revision</p>
                          </div>
                        </div>

                        <div className="relative mb-4">
                          <div className="absolute -left-4 w-3 h-3 bg-cyber-amber rounded-full border-2 border-cyber-amber/50"></div>
                          <div className="p-3 bg-cyber-amber/10 border border-cyber-amber/20 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-orbitron font-bold text-xs text-cyber-amber">7 Days Before</span>
                              <span className="text-[9px] font-orbitron text-cyber-gray">
                                {daysRemaining > 7 ? new Date(Date.now() + (daysRemaining - 7) * 24 * 60 * 60 * 1000).toLocaleDateString() : 'Passed'}
                              </span>
                            </div>
                            <p className="text-[10px] text-cyber-gray mt-1">Final review phase begins</p>
                          </div>
                        </div>

                        <div className="relative mb-4">
                          <div className="absolute -left-4 w-3 h-3 bg-red-500 rounded-full border-2 border-red-500/50"></div>
                          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-orbitron font-bold text-xs text-red-400">Exam Day</span>
                              <span className="text-[9px] font-orbitron text-cyber-gray">
                                {activeDNA?.targetExamDate ? new Date(activeDNA.targetExamDate).toLocaleDateString() : 'TBD'}
                              </span>
                            </div>
                            <p className="text-[10px] text-cyber-gray mt-1">Target examination date</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Automated Reminders System */}
            <GlassCard glowColor="amber" hoverScale={false}>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-cyber-amber/15 pb-2">
                  <div className="flex items-center space-x-2 text-cyber-amber">
                    <Bell size={16} />
                    <h3 className="font-orbitron font-bold text-xs uppercase tracking-wider">Automated Reminders</h3>
                  </div>
                  <button
                    onClick={() => setShowReminderSettings(!showReminderSettings)}
                    className="text-[9px] font-orbitron text-cyber-amber hover:text-cyber-amber/80 transition-colors"
                  >
                    {showReminderSettings ? 'Hide' : 'Manage'}
                  </button>
                </div>

                <div className="space-y-2">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className={`p-3 border rounded-lg flex items-center justify-between ${
                        reminder.enabled 
                          ? 'bg-cyber-amber/5 border-cyber-amber/20' 
                          : 'bg-gray-800/30 border-gray-700/30 opacity-60'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleReminder(reminder.id)}
                          className={`w-4 h-4 rounded border transition-all ${
                            reminder.enabled 
                              ? 'bg-cyber-amber border-cyber-amber' 
                              : 'border-gray-600'
                          }`}
                        >
                          {reminder.enabled && <CheckSquare size={12} className="text-black" />}
                        </button>
                        <div>
                          <p className="text-[10px] font-orbitron text-cyber-white">{reminder.daysBefore} days before</p>
                          <p className="text-[9px] text-cyber-gray">{reminder.message}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="text-cyber-gray hover:text-red-400 transition-colors"
                      >
                        <AlertCircle size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {showReminderSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 border-t border-cyber-amber/15"
                  >
                    <button
                      onClick={() => addReminder(5, '5 days remaining - Intensive review')}
                      className="w-full py-2 bg-cyber-amber/10 hover:bg-cyber-amber/20 border border-cyber-amber/30 rounded font-orbitron text-[10px] text-cyber-amber transition-all"
                    >
                      + Add 5-Day Reminder
                    </button>
                  </motion.div>
                )}
              </div>
            </GlassCard>

            {/* Dynamic Revision Tasks (Preserved) */}
            <GlassCard glowColor="cyan" hoverScale={false}>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-cyber-cyan border-b border-cyber-cyan/15 pb-2">
                  <Sparkles size={16} />
                  <h3 className="font-orbitron font-bold text-xs uppercase tracking-wider">AI Prioritized Revision Docket</h3>
                </div>

                {revisionQueue.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {revisionQueue.slice(0, 5).map((task) => (
                      <div 
                        key={task.id}
                        onClick={() => {
                          const newMastery = Math.min((task.mastery || 0) + 15, 100);
                          const status = newMastery >= 80 ? 'mastered' : 'in-progress';
                          updateNodeMastery(task.id, newMastery, status);
                        }}
                        className="p-3 bg-[#111522]/40 border border-cyber-border/15 hover:border-cyber-cyan/30 rounded-xl flex items-center justify-between cursor-pointer transition-all group relative overflow-hidden"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="mt-0.5 text-cyber-cyan group-hover:scale-110 transition-transform">
                            {task.mastery >= 80 ? (
                              <CheckSquare size={14} className="text-green-400" />
                            ) : (
                              <Square size={14} />
                            )}
                          </div>
                          <div>
                            <h4 className="font-orbitron font-bold text-[10px] uppercase text-cyber-white group-hover:text-cyber-cyan transition-colors">
                              {task.title}
                            </h4>
                            <p className="text-[9px] text-cyber-gray mt-0.5 leading-relaxed">
                              {task.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <span className="text-[8px] uppercase font-orbitron text-cyber-gray block">Mastery</span>
                            <span className="text-[10px] font-bold text-cyber-cyan font-orbitron">{task.mastery}%</span>
                          </div>
                          
                          <span className={`text-[8px] uppercase font-orbitron px-2 py-0.5 border rounded-full ${
                            task.importance === 'high' 
                              ? 'text-red-400 border-red-500/30 bg-red-500/5' 
                              : 'text-cyber-amber border-cyber-amber/30 bg-cyber-amber/5'
                          }`}>
                            {task.importance}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-cyber-gray/60 font-orbitron text-xs">
                    🎉 Outstanding work! All syllabus nodes have been fully mastered!
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>

        </motion.div>
      ) : (
        /* DISCONNECT TERMINAL STATE */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-full max-w-lg space-y-6">
            <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto shadow-glass">
              <CalendarRange size={28} className="text-cyber-gray animate-pulse" />
            </div>

            <div>
              <h2 className="font-orbitron font-bold text-lg tracking-wider text-cyber-white">EXAM TRACKER OFFLINE</h2>
              <p className="text-xs text-cyber-gray leading-relaxed max-w-sm mx-auto mt-2">
                ScholarDNA model is missing. Please ingest your syllabus to set countdown targets and review priority dockets.
              </p>
            </div>

            <button
              onClick={() => navigate('/upload')}
              className="px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded font-orbitron font-bold uppercase text-xs tracking-widest text-white shadow-cyan-glow hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all hover:scale-105"
            >
              Configure exam timeline
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamTracker;
