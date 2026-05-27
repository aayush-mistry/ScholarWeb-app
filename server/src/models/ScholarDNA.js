const mongoose = require('mongoose');

// Schema for subtopics within a parent topic
const SubtopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }
});

// Schema for a single syllabus topic (node) in the DNA
const TopicNodeSchema = new mongoose.Schema({
  id: { type: String, required: true }, // e.g. "topic_1", "calc_derivatives"
  title: { type: String, required: true },
  description: { type: String },
  subtopics: [SubtopicSchema],
  importance: { 
    type: String, 
    enum: ['high', 'medium', 'low'], 
    default: 'medium' 
  },
  pyqFrequency: { type: Number, default: 0 }, // Number of times this topic appeared in PYQs
  weightage: { type: Number, default: 0 }, // Calculated percentage weightage (0 - 100)
  prerequisites: [{ type: String }], // Array of topic IDs that are prerequisites
  masteryLevel: { type: Number, min: 0, max: 100, default: 0 }, // Student mastery %
  learningStatus: {
    type: String,
    enum: ['unstarted', 'in-progress', 'mastered'],
    default: 'unstarted'
  },
  referenceMaterials: [{ type: String }] // Text quotes/pages stored for verification
});

// Schema for a higher-level course Unit grouping several topics
const UnitSchema = new mongoose.Schema({
  unitNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  topics: [TopicNodeSchema]
});

// The master ScholarDNA schema
const ScholarDNASchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseName: { type: String, required: true },
  courseDescription: { type: String },
  units: [UnitSchema], // Embedded units hierarchy
  targetExamDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook to automatically update updatedAt
ScholarDNASchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ScholarDNA', ScholarDNASchema);
