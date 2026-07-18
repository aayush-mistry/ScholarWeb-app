const express = require('express');
const multer = require('multer');
const { 
  verifyClaims, 
  verifyFile, 
  getReport, 
  batchVerify 
} = require('../controllers/guardController');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Verify claims
router.post('/verify', verifyClaims);

// Verify file
router.post('/verify-file', upload.single('file'), verifyFile);

// Get report
router.get('/report/:claimId', getReport);

// Batch verify
router.post('/batch-verify', batchVerify);

module.exports = router;
