const ScholarDNA = require('../models/ScholarDNA');
const { extractTextFromPDF } = require('../services/pdfService');
const { generateScholarDNA } = require('../services/geminiService');

/**
 * Handle multipart uploads, extract text, call Gemini, and save the ScholarDNA object.
 */
const uploadDNA = async (req, res) => {
  try {
    const { courseName, targetExamDate, userId } = req.body;

    // Check if files were uploaded
    if (!req.files || !req.files['syllabus']) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing syllabus file. Syllabus upload is required.' 
      });
    }

    console.log('[ScholarDNA Engine] Starting document processing pipeline...');

    // Extract text from Syllabus PDF
    const syllabusBuffer = req.files['syllabus'][0].buffer;
    const syllabusText = await extractTextFromPDF(syllabusBuffer);
    console.log(`[ScholarDNA Engine] Syllabus text extracted (${syllabusText.length} characters)`);

    // Extract text from optional PYQ PDF
    let pyqText = '';
    if (req.files['pyq'] && req.files['pyq'][0]) {
      const pyqBuffer = req.files['pyq'][0].buffer;
      pyqText = await extractTextFromPDF(pyqBuffer);
      console.log(`[ScholarDNA Engine] PYQs text extracted (${pyqText.length} characters)`);
    }

    // Extract text from optional Notes/Question Bank PDF
    let notesText = '';
    if (req.files['notes'] && req.files['notes'][0]) {
      const notesBuffer = req.files['notes'][0].buffer;
      notesText = await extractTextFromPDF(notesBuffer);
      console.log(`[ScholarDNA Engine] Notes text extracted (${notesText.length} characters)`);
    }

    // Run AI Extraction via Gemini
    console.log('[ScholarDNA Engine] Initiating Gemini analysis...');
    const parsedDNA = await generateScholarDNA(
      syllabusText, 
      pyqText, 
      notesText, 
      courseName || 'Imported Syllabus Course'
    );
    console.log('[ScholarDNA Engine] Gemini analysis complete. Saving to DB...');

    // Create custom fallback user ID if not provided (hackathon speed)
    const activeUserId = userId || '65e23a4bf9121a001fb1e204';

    // Construct the Mongoose object
    const newDNA = new ScholarDNA({
      userId: activeUserId,
      courseName: parsedDNA.courseName,
      courseDescription: parsedDNA.courseDescription,
      units: parsedDNA.units,
      targetExamDate: targetExamDate ? new Date(targetExamDate) : null
    });

    const savedDNA = await newDNA.save();
    console.log(`[ScholarDNA Engine] Saved successfully! ID: ${savedDNA._id}`);

    return res.status(201).json({
      success: true,
      message: 'ScholarDNA compiled successfully!',
      dna: savedDNA
    });

  } catch (error) {
    console.error(`[ScholarDNA Engine Error] Pipeline failed: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to compile ScholarDNA profile.',
      error: error.message
    });
  }
};

/**
 * Fetch a ScholarDNA profile by ID.
 */
const getDNA = async (req, res) => {
  try {
    const { id } = req.params;
    const dna = await ScholarDNA.findById(id);

    if (!dna) {
      return res.status(404).json({
        success: false,
        message: 'ScholarDNA profile not found.'
      });
    }

    return res.status(200).json({
      success: true,
      dna
    });
  } catch (error) {
    console.error(`[ScholarDNA Controller Error] Fetch failed: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error fetching ScholarDNA profile.',
      error: error.message
    });
  }
};

/**
 * Update the mastery levels and study status of a specific node manually or via interactive quizzes.
 */
const updateNodeMastery = async (req, res) => {
  try {
    const { id, nodeId } = req.params;
    const { masteryLevel, learningStatus } = req.body;

    const dna = await ScholarDNA.findById(id);
    if (!dna) {
      return res.status(404).json({ success: false, message: 'ScholarDNA not found' });
    }

    // Locate the topic inside units
    let topicFound = false;
    for (let unit of dna.units) {
      const topic = unit.topics.find(t => t.id === nodeId);
      if (topic) {
        if (masteryLevel !== undefined) topic.masteryLevel = Number(masteryLevel);
        if (learningStatus !== undefined) topic.learningStatus = learningStatus;
        topicFound = true;
        break;
      }
    }

    if (!topicFound) {
      return res.status(404).json({ success: false, message: `Topic node '${nodeId}' not found in syllabus.` });
    }

    await dna.save();

    return res.status(200).json({
      success: true,
      message: `Node '${nodeId}' updated successfully!`,
      dna
    });

  } catch (error) {
    console.error(`[ScholarDNA Controller Error] Node update failed: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error updating topic node.',
      error: error.message
    });
  }
};

module.exports = {
  uploadDNA,
  getDNA,
  updateNodeMastery
};
