import React from 'react';
import type { Skill, TrendingResults } from '../api/client';
import { TrendingUp, Star, Plus, Zap } from 'lucide-react';

interface TrendingGridProps {
  trending: TrendingResults;
}

export const TrendingGrid: React.FC<TrendingGridProps> = ({ trending }) => {
  const Section = ({ title, icon: Icon, skills, color, label }: { 
    title: string, icon: any, skills: Skill[], color: string, label: string 
  }) => (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
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
                {skill.delta !== undefined && (
                  <span className="text-green-600 ml-1">+{skill.delta}</span>
                )}
              </div>
              <div className={`text-xs font-bold ${color.replace('text-', 'text-').replace('-500', '-600')} ${color.replace('text-', 'bg-').replace('-500', '-50')} px-2 py-0.5 rounded-full`}>
                {label}
              </div>
            </div>
          </div>
        ))}
        {skills.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
            No data available in this category yet.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <Section 
        title="Fastest Growth (7d)" 
        icon={TrendingUp} 
        skills={trending.growth} 
        color="text-green-500"
        label="Trending"
      />
      <Section 
        title="New Comers" 
        icon={Plus} 
        skills={trending.new_comers} 
        color="text-blue-500"
        label="New"
      />
      <Section 
        title="Rising Stars (Revivals)" 
        icon={Zap} 
        skills={trending.revivals} 
        color="text-orange-500"
        label="Revival"
      />
    </div>
  );
};
