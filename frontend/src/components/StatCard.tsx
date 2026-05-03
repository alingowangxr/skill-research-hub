import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, description, trend }) => {
  return (
    <div className="glass p-6 rounded-2xl shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3 group">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend.isUp ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</span>
        <div className="text-3xl font-black text-slate-900 mt-1 tabular-nums">{value}</div>
      </div>
      {description && <div className="text-[11px] text-slate-400 font-medium">{description}</div>}
    </div>
  );
};
