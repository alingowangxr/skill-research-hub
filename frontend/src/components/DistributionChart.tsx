import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DistributionChartProps {
  data: Record<string, number>;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([range, count]) => ({
    range,
    count,
  }));

  const COLORS = ['#94a3b8', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
      <h3 className="text-gray-900 font-bold">Star Distribution (Long Tail)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="range" axisLine={false} tickLine={false} fontSize={12} />
            <YAxis hide />
            <Tooltip 
              cursor={{fill: '#f8fafc'}}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
