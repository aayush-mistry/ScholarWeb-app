import React from 'react';

/**
 * Cybernetic Skeletal HUD Loader
 */
const SkeletonLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* HUD Scanner sweep line simulation */}
      <div className="relative w-full overflow-hidden rounded-lg border border-cyber-cyan/10 bg-[#131722]/30 p-5 backdrop-blur-md">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-cyber-cyan animate-cyber-pulse" />
        
        {/* Terminal Header Shell */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-3 w-3 rounded-full bg-cyber-cyan/30 animate-ping" />
          <div className="h-4 w-32 rounded bg-cyber-cyan/20 animate-pulse" />
        </div>

        {/* Dynamic Skeleton Lines */}
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, idx) => (
            <div 
              key={idx} 
              className="h-3 rounded bg-cyber-gray/10 animate-pulse"
              style={{
                width: idx === lines - 1 ? '60%' : idx % 2 === 0 ? '90%' : '100%',
                animationDelay: `${idx * 0.15}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
