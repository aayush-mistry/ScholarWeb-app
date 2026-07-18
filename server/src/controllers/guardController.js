/**
 * Guard Controller - Handles fact-checking and misinformation detection
 */

const verifyClaims = async (req, res) => {
  try {
    const { claimText, dnaId } = req.body;

    if (!claimText) {
      return res.status(400).json({
        success: false,
        message: 'Missing claim text',
      });
    }

    // TODO: Integrate with Gemini for fact-checking against ScholarDNA
    // For now, return mock verification
    const mockVerification = {
      score: 75,
      claims: [
        {
          text: claimText,
          isAccurate: true,
          confidence: 0.92,
          correction: null,
        },
      ],
    };

    return res.status(200).json({
      success: true,
      verification: mockVerification,
    });
  } catch (error) {
    console.error('[Guard Controller] Verification failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Fact verification failed',
      error: error.message,
    });
  }
};

const verifyFile = async (req, res) => {
  try {
    const { dnaId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Missing file',
      });
    }

    // TODO: Extract text from file and run verification
    const mockVerification = {
      fileName: req.file.originalname,
      score: 80,
      claims: [],
    };

    return res.status(200).json({
      success: true,
      verification: mockVerification,
    });
  } catch (error) {
    console.error('[Guard Controller] File verification failed:', error);
    return res.status(500).json({
      success: false,
      message: 'File verification failed',
      error: error.message,
    });
  }
};

const getReport = async (req, res) => {
  try {
    const { claimId } = req.params;

    // TODO: Retrieve detailed report from database
    const mockReport = {
      claimId,
      status: 'verified',
      details: [],
    };

    return res.status(200).json({
      success: true,
      report: mockReport,
    });
  } catch (error) {
    console.error('[Guard Controller] Report fetch failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Report fetch failed',
      error: error.message,
    });
  }
};

const batchVerify = async (req, res) => {
  try {
    const { claims, dnaId } = req.body;

    if (!Array.isArray(claims)) {
      return res.status(400).json({
        success: false,
        message: 'Claims must be an array',
      });
    }

    // TODO: Batch verify claims using Gemini
    const mockResults = claims.map((claim) => ({
      text: claim,
      isAccurate: true,
      confidence: 0.85,
    }));

    return res.status(200).json({
      success: true,
      results: mockResults,
    });
  } catch (error) {
    console.error('[Guard Controller] Batch verification failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Batch verification failed',
      error: error.message,
    });
  }
};

module.exports = {
  verifyClaims,
  verifyFile,
  getReport,
  batchVerify,
};
