import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-sm font-medium">{title}</span>
        <Icon className="w-5 h-5 text-blue-500" />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {description && <div className="text-xs text-gray-400">{description}</div>}
    </div>
  );
};
