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
    <div className="glass p-8 rounded-3xl shadow-soft flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-slate-900 font-black text-lg tracking-tight">Market Concentration</h3>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Star Distribution (Long Tail)</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="range" 
              axisLine={false} 
              tickLine={false} 
              fontSize={11} 
              tick={{fill: '#64748b', fontWeight: 600}}
              dy={10}
            />
            <YAxis hide />
            <Tooltip 
              cursor={{fill: 'rgba(59, 130, 246, 0.03)'}}
              contentStyle={{ 
                borderRadius: '16px', 
                border: '1px solid rgba(255,255,255,0.2)', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)',
                padding: '12px'
              }}
              labelStyle={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
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
