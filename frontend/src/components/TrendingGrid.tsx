import React from 'react';
import type { Skill } from '../api/client';
import { TrendingUp, Star } from 'lucide-react';

interface TrendingGridProps {
  skills: Skill[];
}

export const TrendingGrid: React.FC<TrendingGridProps> = ({ skills }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Trending Now</h2>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-sm font-bold text-gray-900 truncate mb-1">
              {skill.name || skill.id}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Star className="w-3 h-3" />
                {skill.stars.toLocaleString()}
              </div>
              <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                Hot
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
