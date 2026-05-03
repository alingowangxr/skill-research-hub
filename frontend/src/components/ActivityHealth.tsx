import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ActivityHealthProps {
  data: {
    active: number;
    stale: number;
    decaying: number;
    dead: number;
  };
}

export const ActivityHealth: React.FC<ActivityHealthProps> = ({ data }) => {
  const chartData = [
    { name: 'Active', value: data.active, color: '#22c55e' },
    { name: 'Stale', value: data.stale, color: '#eab308' },
    { name: 'Decaying', value: data.decaying, color: '#f97316' },
    { name: 'Dead', value: data.dead, color: '#ef4444' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
      <h3 className="text-gray-900 font-bold">Ecosystem Activity Health</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
