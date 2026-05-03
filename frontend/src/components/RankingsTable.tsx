import React from 'react';
import type { Skill } from '../api/client';
import { Star } from 'lucide-react';

interface RankingsTableProps {
  skills: Skill[];
}

export const RankingsTable: React.FC<RankingsTableProps> = ({ skills }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Market Rankings</h2>
        <p className="text-sm text-gray-500">Top 50 skills by score</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-3">Rank</th>
              <th className="px-6 py-3">ID / Name</th>
              <th className="px-6 py-3 text-right">Stars</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {skills.map((skill, index) => (
              <tr key={skill.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-400">#{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">{skill.name || skill.id}</div>
                  <div className="text-xs text-gray-400">{skill.id}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 text-sm font-bold text-amber-500">
                    {skill.stars.toLocaleString()}
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
