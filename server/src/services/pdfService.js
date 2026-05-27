const pdfParse = require('pdf-parse');

/**
 * Extracts raw text content from a PDF file buffer.
 * @param {Buffer} fileBuffer - The uploaded file buffer.
 * @returns {Promise<string>} - Extracted text content.
 */
const extractTextFromPDF = async (fileBuffer) => {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text || '';
  } catch (error) {
    console.error(`[PDF Parse Service Error] Failed to parse: ${error.message}`);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

module.exports = {
  extractTextFromPDF
};
