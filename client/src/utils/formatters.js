/**
 * Format date to readable string
 */
export const formatDate = (date, format = 'long') => {
  const options = {
    long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    short: { year: '2-digit', month: 'short', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
  };

  return new Date(date).toLocaleDateString('en-US', options[format] || options.long);
};

/**
 * Format time remaining in HH:MM:SS
 */
export const formatTimeRemaining = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * Format countdown timer (e.g., "5 days 3 hours")
 */
export const formatCountdown = (days, hours = 0, minutes = 0) => {
  const parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);

  return parts.join(' ') || '0 minutes';
};

export default {
  formatDate,
  formatTimeRemaining,
  formatCountdown,
};
