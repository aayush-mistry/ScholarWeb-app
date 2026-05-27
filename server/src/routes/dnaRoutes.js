const express = require('express');
const multer = require('multer');
const { uploadDNA, getDNA, updateNodeMastery } = require('../controllers/dnaController');

const router = express.Router();

// Configure multer storage in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB file size limit per upload
  }
});

// Configure multi-file upload fields
const uploadFields = upload.fields([
  { name: 'syllabus', maxCount: 1 },
  { name: 'pyq', maxCount: 1 },
  { name: 'notes', maxCount: 1 }
]);

// DNA API Route Declarations
router.post('/upload', uploadFields, uploadDNA);
router.get('/:id', getDNA);
router.patch('/:id/nodes/:nodeId', updateNodeMastery);

module.exports = router;
