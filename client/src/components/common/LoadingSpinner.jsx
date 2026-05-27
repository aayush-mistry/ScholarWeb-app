import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Futuristic Loading Spinner Component
 */
const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className={`${sizes[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 border-2 border-cyber-cyan/20 rounded-full" />
        {/* Inner ring */}
        <div className="absolute inset-2 border-2 border-cyber-cyan/40 rounded-full border-t-transparent border-r-transparent" />
        {/* Core */}
        <div className="absolute inset-4 bg-cyber-cyan/20 rounded-full animate-pulse" />
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="text-cyber-cyan" size={size === 'small' ? 16 : size === 'medium' ? 24 : 32} />
        </div>
      </motion.div>
      
      {text && (
        <motion.p
          className={`font-orbitron text-cyber-gray ${textSizes[size]} uppercase tracking-widest`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

/**
 * Full Page Loading Overlay
 */
export const PageLoader = ({ text = 'Initializing ScholarDNA...' }) => {
  return (
    <div className="fixed inset-0 bg-[#08090C] flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        <LoadingSpinner size="large" text={text} />
        
        {/* Progress bar */}
        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Card Loading Skeleton
 */
export const CardSkeleton = () => {
  return (
    <div className="p-5 space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-cyber-cyan/10 rounded-lg animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-cyber-cyan/10 rounded w-1/3 animate-pulse" />
          <div className="h-2 bg-cyber-gray/20 rounded w-1/2 animate-pulse" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-2">
        <div className="h-2 bg-cyber-gray/10 rounded w-full animate-pulse" />
        <div className="h-2 bg-cyber-gray/10 rounded w-5/6 animate-pulse" />
        <div className="h-2 bg-cyber-gray/10 rounded w-4/6 animate-pulse" />
      </div>
      
      {/* Footer skeleton */}
      <div className="flex items-center justify-between pt-4">
        <div className="h-8 bg-cyber-cyan/10 rounded-lg w-24 animate-pulse" />
        <div className="h-6 bg-cyber-purple/10 rounded-full w-16 animate-pulse" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
