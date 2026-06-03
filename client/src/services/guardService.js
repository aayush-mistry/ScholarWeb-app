import API from './api';

/**
 * Guard Service - Handles fact-checking and misinformation detection
 */

export const guardService = {
  /**
   * Verify claims against ScholarDNA knowledge base
   */
  async verifyClaims(claimText, dnaId) {
    try {
      const response = await API.post('/guard/verify', {
        claimText,
        dnaId,
      });
      return response.data;
    } catch (error) {
      console.error('[Guard Service] Verification failed:', error);
      throw error;
    }
  },

  /**
   * Upload a file for fact-checking
   */
  async verifyFile(formData, dnaId) {
    try {
      formData.append('dnaId', dnaId);
      const response = await API.post('/guard/verify-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('[Guard Service] File verification failed:', error);
      throw error;
    }
  },

  /**
   * Get detailed fact-check report
   */
  async getReport(claimId) {
    try {
      const response = await API.get(`/guard/report/${claimId}`);
      return response.data;
    } catch (error) {
      console.error('[Guard Service] Report fetch failed:', error);
      throw error;
    }
  },

  /**
   * Batch verify multiple claims
   */
  async batchVerify(claims, dnaId) {
    try {
      const response = await API.post('/guard/batch-verify', {
        claims,
        dnaId,
      });
      return response.data;
    } catch (error) {
      console.error('[Guard Service] Batch verification failed:', error);
      throw error;
    }
  },
};

export default guardService;
