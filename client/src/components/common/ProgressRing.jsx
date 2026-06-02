import React from 'react';

const ProgressRing = ({
  radius = 52,
  stroke = 10,
  progress = 0,
  label = 'Completion',
  accent = 'cyan',
  className = '',
}) => {
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const accentColor = {
    cyan: 'var(--cyber-cyan)',
    purple: 'var(--cyber-purple)',
    amber: 'var(--cyber-amber)',
  }[accent] || 'var(--cyber-cyan)';

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg width={radius * 2} height={radius * 2} className="block">
        <circle
          stroke="rgba(255,255,255,0.08)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={accentColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-700 ease-out"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold text-white">{Math.round(progress)}%</span>
        <span className="text-[11px] uppercase tracking-[0.3em] text-cyber-gray mt-1">{label}</span>
      </div>
    </div>
  );
};

export default ProgressRing;
