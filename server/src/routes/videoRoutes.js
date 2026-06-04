const express = require('express');
const { 
  analyzeVideo, 
  extractTranscript, 
  generateQuiz, 
  mapTopics 
} = require('../controllers/videoController');

const router = express.Router();

// Video analysis and transcript extraction
router.post('/analyze', analyzeVideo);
router.post('/transcript', extractTranscript);

// Quiz generation
router.get('/:videoId/quiz', generateQuiz);

// Topic mapping
router.post('/:videoId/map-topics', mapTopics);

module.exports = router;
