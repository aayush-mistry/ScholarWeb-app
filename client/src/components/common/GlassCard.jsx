import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Glowing Cybernetic Glass Panel
 */
const GlassCard = ({ 
  children, 
  className = '', 
  glowColor = 'cyan', // 'cyan' | 'purple' | 'amber' | 'none'
  hoverScale = true, 
  onClick = null 
}) => {
  const glowClasses = {
    cyan: 'border-cyber-cyan/15 hover:border-cyber-cyan/40 hover:shadow-cyan-glow',
    purple: 'border-cyber-purple/15 hover:border-cyber-purple/40 hover:shadow-purple-glow',
    amber: 'border-cyber-amber/15 hover:border-cyber-amber/40 hover:shadow-amber-glow',
    none: 'border-white/5 hover:border-white/15'
  };

  const glowColors = {
    cyan: 'rgba(0, 240, 255, 0.3)',
    purple: 'rgba(157, 0, 255, 0.3)',
    amber: 'rgba(255, 153, 0, 0.3)',
    none: 'rgba(255, 255, 255, 0.1)'
  };

  const isClickable = typeof onClick === 'function';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={hoverScale ? { scale: 1.02, y: -4 } : {}}
      whileTap={isClickable && hoverScale ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl border bg-[#131722]/45 backdrop-blur-md 
        transition-all duration-300 ease-out
        ${glowClasses[glowColor]} 
        ${isClickable ? 'cursor-pointer' : ''} 
        ${className}
      `}
      style={{
        boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 0 1px ${glowColors[glowColor]}`
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColors[glowColor]} 0%, transparent 70%)`
        }}
        animate={{
          opacity: [0, 0.1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Background cyber grid overlay for texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-60" />
      
      {/* Radial corner light sweep */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-radial from-white/5 to-transparent rounded-full pointer-events-none" />
      
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          backgroundSize: '200% 100%'
        }}
        animate={{
          backgroundPosition: ['0% 0%', '200% 0%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Main card body */}
      <div className="relative z-10 p-5">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;
