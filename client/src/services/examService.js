import API from './api';

/**
 * Exam Service - Handles exam tracking and revision planning
 */

export const examService = {
  /**
   * Create an exam schedule
   */
  async createExamSchedule(dnaId, examData) {
    try {
      const response = await API.post(`/exam/${dnaId}/schedule`, examData);
      return response.data;
    } catch (error) {
      console.error('[Exam Service] Schedule creation failed:', error);
      throw error;
    }
  },

  /**
   * Get revision plan for exam
   */
  async getRevisionPlan(dnaId, examDate) {
    try {
      const response = await API.get(`/exam/${dnaId}/revision-plan`, {
        params: { examDate },
      });
      return response.data;
    } catch (error) {
      console.error('[Exam Service] Revision plan fetch failed:', error);
      throw error;
    }
  },

  /**
   * Get dynamic study tasks based on time remaining and mastery
   */
  async getStudyTasks(dnaId) {
    try {
      const response = await API.get(`/exam/${dnaId}/study-tasks`);
      return response.data;
    } catch (error) {
      console.error('[Exam Service] Study tasks fetch failed:', error);
      throw error;
    }
  },

  /**
   * Update task completion status
   */
  async updateTaskStatus(dnaId, taskId, completed) {
    try {
      const response = await API.patch(`/exam/${dnaId}/tasks/${taskId}`, {
        completed,
      });
      return response.data;
    } catch (error) {
      console.error('[Exam Service] Task update failed:', error);
      throw error;
    }
  },

  /**
   * Set exam reminder
   */
  async setReminder(dnaId, reminderData) {
    try {
      const response = await API.post(`/exam/${dnaId}/reminders`, reminderData);
      return response.data;
    } catch (error) {
      console.error('[Exam Service] Reminder set failed:', error);
      throw error;
    }
  },
};

export default examService;
