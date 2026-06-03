import API from './api';

/**
 * ScholarDNA Service - Handles all DNA-related API calls
 */

export const dnaService = {
  /**
   * Upload syllabus files and generate ScholarDNA
   */
  async uploadSyllabus(formData) {
    try {
      const response = await API.post('/dna/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('[DNA Service] Upload failed:', error);
      throw error;
    }
  },

  /**
   * Fetch a ScholarDNA profile by ID
   */
  async getDNA(dnaId) {
    try {
      const response = await API.get(`/dna/${dnaId}`);
      return response.data;
    } catch (error) {
      console.error('[DNA Service] Fetch failed:', error);
      throw error;
    }
  },

  /**
   * Update mastery level for a specific node
   */
  async updateNodeMastery(dnaId, nodeId, masteryLevel, status) {
    try {
      const response = await API.patch(`/dna/${dnaId}/nodes/${nodeId}`, {
        masteryLevel,
        learningStatus: status,
      });
      return response.data;
    } catch (error) {
      console.error('[DNA Service] Update mastery failed:', error);
      throw error;
    }
  },

  /**
   * Get all DNAs for current user
   */
  async listDNAs() {
    try {
      const response = await API.get('/dna');
      return response.data;
    } catch (error) {
      console.error('[DNA Service] List failed:', error);
      throw error;
    }
  },

  /**
   * Delete a ScholarDNA profile
   */
  async deleteDNA(dnaId) {
    try {
      const response = await API.delete(`/dna/${dnaId}`);
      return response.data;
    } catch (error) {
      console.error('[DNA Service] Delete failed:', error);
      throw error;
    }
  },
};

export default dnaService;
