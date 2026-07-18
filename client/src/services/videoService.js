import API from './api';

/**
 * Video Service - Handles video analysis and transcript extraction
 */

export const videoService = {
  /**
   * Analyze a video (YouTube URL or file upload)
   */
  async analyzeVideo(videoUrl, dnaId) {
    try {
      const response = await API.post('/video/analyze', {
        videoUrl,
        dnaId,
      });
      return response.data;
    } catch (error) {
      console.error('[Video Service] Analysis failed:', error);
      throw error;
    }
  },

  /**
   * Extract transcript from YouTube video
   */
  async extractTranscript(videoUrl) {
    try {
      const response = await API.post('/video/transcript', {
        videoUrl,
      });
      return response.data;
    } catch (error) {
      console.error('[Video Service] Transcript extraction failed:', error);
      throw error;
    }
  },

  /**
   * Generate quiz from video content
   */
  async generateQuiz(videoId, dnaId) {
    try {
      const response = await API.get(`/video/${videoId}/quiz`, {
        params: { dnaId },
      });
      return response.data;
    } catch (error) {
      console.error('[Video Service] Quiz generation failed:', error);
      throw error;
    }
  },

  /**
   * Map video topics to ScholarDNA nodes
   */
  async mapTopics(videoId, dnaId) {
    try {
      const response = await API.post(`/video/${videoId}/map-topics`, {
        dnaId,
      });
      return response.data;
    } catch (error) {
      console.error('[Video Service] Topic mapping failed:', error);
      throw error;
    }
  },
};

export default videoService;
