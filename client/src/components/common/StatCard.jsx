import React from 'react';
import GlassCard from './GlassCard';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const accentClasses = {
  cyan: 'text-cyber-cyan',
  purple: 'text-cyber-purple',
  amber: 'text-cyber-amber',
};

const StatCard = ({
  title,
  value,
  delta,
  icon: Icon,
  accent = 'cyan',
  description,
  className = '',
}) => {
  const trendPositive = delta?.value && (delta.positive ?? true);

  return (
    <GlassCard glowColor={accent} className={`overflow-hidden ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-cyber-gray mb-2">{title}</p>
          <div className="flex items-center gap-3">
            {Icon && <Icon className={`h-6 w-6 ${accentClasses[accent]}`} />}
            <h3 className="text-3xl font-semibold tracking-tight text-white">{value}</h3>
          </div>
        </div>
        {delta?.value && (
          <div className={`rounded-2xl px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] ${trendPositive ? 'bg-cyber-cyan/10 text-cyber-cyan' : 'bg-cyber-amber/10 text-cyber-amber'}`}>
            <div className="flex items-center gap-1">
              {trendPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              <span>{delta.value}</span>
            </div>
          </div>
        )}
      </div>

      {description && <p className="mt-4 text-sm text-cyber-gray leading-6">{description}</p>}
    </GlassCard>
  );
};

export default StatCard;
