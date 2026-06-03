/**
 * Calculate days remaining until exam
 */
export const calculateDaysRemaining = (examDate) => {
  if (!examDate) return null;
  const diffTime = new Date(examDate) - new Date();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calculate syllabus completion percentage
 */
export const calculateCompletionPercentage = (dna) => {
  if (!dna || !dna.units) return 0;

  let totalTopics = 0;
  let completedTopics = 0;

  dna.units.forEach((unit) => {
    unit.topics.forEach((topic) => {
      totalTopics++;
      if (topic.masteryLevel >= 80) {
        completedTopics++;
      }
    });
  });

  return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
};

/**
 * Calculate average mastery across all topics
 */
export const calculateAverageMastery = (dna) => {
  if (!dna || !dna.units || dna.units.length === 0) return 0;

  let totalMastery = 0;
  let topicCount = 0;

  dna.units.forEach((unit) => {
    unit.topics.forEach((topic) => {
      totalMastery += topic.masteryLevel || 0;
      topicCount++;
    });
  });

  return topicCount > 0 ? Math.round(totalMastery / topicCount) : 0;
};

/**
 * Get priority-ordered study list based on mastery and importance
 */
export const getPrioritizedStudyPlan = (dna, limit = 10) => {
  if (!dna || !dna.units) return [];

  const priorityNodes = [];
  dna.units.forEach((unit) => {
    unit.topics.forEach((topic) => {
      if (topic.masteryLevel < 80) {
        const importanceScore = {
          high: 3,
          medium: 2,
          low: 1,
        }[topic.importance] || 1;

        priorityNodes.push({
          ...topic,
          unitTitle: unit.title,
          priorityScore: (importanceScore * 100) / (topic.masteryLevel + 1),
        });
      }
    });
  });

  return priorityNodes.sort((a, b) => b.priorityScore - a.priorityScore).slice(0, limit);
};

/**
 * Calculate exam readiness score
 */
export const calculateExamReadiness = (dna, examDate) => {
  const avgMastery = calculateAverageMastery(dna);
  const daysRemaining = calculateDaysRemaining(examDate);

  if (!daysRemaining || daysRemaining < 0) return 0;

  // Formula: (mastery + (daysRemaining * 5)) capped at 100
  return Math.min(100, avgMastery + Math.floor((daysRemaining / 30) * 20));
};

export default {
  calculateDaysRemaining,
  calculateCompletionPercentage,
  calculateAverageMastery,
  getPrioritizedStudyPlan,
  calculateExamReadiness,
};
