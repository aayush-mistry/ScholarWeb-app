import React from 'react';
import { motion } from 'framer-motion';

const glowStyles = {
  cyan: 'border-cyber-cyan/20 hover:border-cyber-cyan/40 shadow-cyan-glow',
  purple: 'border-cyber-purple/20 hover:border-cyber-purple/40 shadow-purple-glow',
  amber: 'border-cyber-amber/20 hover:border-cyber-amber/40 shadow-amber-glow',
  none: 'border-white/10 shadow-glass',
};

const GlassCard = ({
  children,
  className = '',
  glowColor = 'cyan',
  hoverScale = true,
  onClick = null,
}) => {
  const isClickable = typeof onClick === 'function';
  const selectedGlow = glowStyles[glowColor] || glowStyles.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      whileHover={hoverScale ? { scale: 1.02, y: -3 } : {}}
      whileTap={isClickable && hoverScale ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`glass-card ${selectedGlow} ${isClickable ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="glass-card-overlay" />
      <div className="glass-card-content p-5">{children}</div>
    </motion.div>
  );
};

export default GlassCard;
