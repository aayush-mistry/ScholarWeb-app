import React, { memo } from 'react';
import { Handle, Position } from 'react-flow-renderer';

const CyberNode = ({ data, selected }) => {
  const mastery = data.masteryLevel || 0;
  
  // Categorize understanding levels
  const getUnderstandingStatus = () => {
    if (mastery >= 80) return { label: 'Completely Understood', color: '#22C55E', shadow: 'rgba(34,197,94,0.4)' };
    if (mastery >= 30) return { label: 'Partially Understood', color: '#FF9900', shadow: 'rgba(255,153,0,0.4)' };
    return { label: 'Not Understood', color: '#EF4444', shadow: 'rgba(239,68,68,0.4)' };
  };

  const status = getUnderstandingStatus();

  // SVG Progress Ring calculations
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (mastery / 100) * circumference;

  return (
    <div className="relative group select-none">
      {/* React Flow Connection Handles */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ background: '#00F0FF', width: '6px', height: '6px', border: 'none' }} 
      />

      {/* Cybernetic Floating Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 p-2 rounded bg-[#0A0D16]/95 border border-cyber-border/40 backdrop-blur-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 text-center font-orbitron shadow-glass">
        <p className="text-[9px] font-bold text-cyber-white truncate">{data.title}</p>
        <p className="text-[8px] mt-0.5" style={{ color: status.color }}>{status.label}</p>
        <p className="text-[8px] text-cyber-cyan font-bold mt-1">{mastery}% Mastery</p>
      </div>

      {/* Main Node Sphere Container */}
      <div 
        className={`
          h-14 w-14 rounded-full flex items-center justify-center bg-[#131722]/85 border transition-all duration-300
          ${selected ? 'border-cyber-cyan scale-105' : 'border-white/5'}
        `}
        style={{
          boxShadow: `0 0 15px ${status.shadow}`
        }}
      >
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          {/* Progress Ring Track */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="3.5"
          />
          {/* Active Glowing Mastery Ring */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="transparent"
            stroke={status.color}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Initials Label */}
        <span className="font-orbitron font-extrabold text-[9px] uppercase tracking-wider text-cyber-white relative z-10">
          {data.title ? data.title.split(' ').map(w => w[0]).join('').slice(0, 3) : 'ND'}
        </span>
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ background: '#9D00FF', width: '6px', height: '6px', border: 'none' }} 
      />
    </div>
  );
};

export default memo(CyberNode);
