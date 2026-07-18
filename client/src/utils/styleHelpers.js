/**
 * Get mastery level color
 */
export const getMasteryColor = (masteryLevel) => {
  if (masteryLevel >= 80) return { color: '#22C55E', label: 'Mastered', status: 'mastered' };
  if (masteryLevel >= 50) return { color: '#FF9900', label: 'In Progress', status: 'in-progress' };
  return { color: '#EF4444', label: 'Not Started', status: 'unstarted' };
};

/**
 * Get importance badge styling
 */
export const getImportanceStyle = (importance) => {
  const styles = {
    high: 'text-red-400 bg-red-500/10 border-red-500/30',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    low: 'text-green-400 bg-green-500/10 border-green-500/30',
  };
  return styles[importance] || styles.medium;
};

/**
 * Get topic status icon
 */
export const getStatusIcon = (masteryLevel) => {
  if (masteryLevel >= 80) return '✓';
  if (masteryLevel >= 50) return '◐';
  return '○';
};

export default {
  getMasteryColor,
  getImportanceStyle,
  getStatusIcon,
};
