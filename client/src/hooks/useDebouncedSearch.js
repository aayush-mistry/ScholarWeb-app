import { useCallback } from 'react';

/**
 * useDebouncedSearch - Hook for debounced search queries
 */
export const useDebouncedSearch = (callback, delay = 500) => {
  let timeout;

  const debouncedSearch = useCallback((query) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(query);
    }, delay);
  }, [callback, delay]);

  return debouncedSearch;
};

export default useDebouncedSearch;
