import API from './api';

/**
 * Search Service - Handles syllabus-aware search queries
 */

export const searchService = {
  /**
   * Search for content within active ScholarDNA
   */
  async search(query, dnaId) {
    try {
      const response = await API.get('/search', {
        params: {
          q: query,
          dnaId: dnaId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('[Search Service] Query failed:', error);
      throw error;
    }
  },

  /**
   * Advanced search with filters
   */
  async advancedSearch(query, dnaId, filters = {}) {
    try {
      const response = await API.get('/search/advanced', {
        params: {
          q: query,
          dnaId: dnaId,
          ...filters,
        },
      });
      return response.data;
    } catch (error) {
      console.error('[Search Service] Advanced search failed:', error);
      throw error;
    }
  },

  /**
   * Get search suggestions based on partial query
   */
  async getSuggestions(query, dnaId) {
    try {
      const response = await API.get('/search/suggestions', {
        params: {
          q: query,
          dnaId: dnaId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('[Search Service] Suggestions failed:', error);
      throw error;
    }
  },
};

export default searchService;
