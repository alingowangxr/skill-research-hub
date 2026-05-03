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
    { name: 'Active', value: data.active, color: '#10b981' },
    { name: 'Stale', value: data.stale, color: '#f59e0b' },
    { name: 'Decaying', value: data.decaying, color: '#f97316' },
    { name: 'Dead', value: data.dead, color: '#ef4444' },
  ];

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <div className="glass p-8 rounded-3xl shadow-soft flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-slate-900 font-black text-lg tracking-tight">Ecosystem Vitality</h3>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Activity Health Lifecycle</p>
      </div>
      <div className="h-72 relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-slate-900 leading-none">{total}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Total Skills</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: '1px solid rgba(255,255,255,0.2)', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)',
                padding: '12px'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle" 
              formatter={(value) => <span className="text-xs font-bold text-slate-600 px-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
