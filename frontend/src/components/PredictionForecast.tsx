import React from 'react';
import { TrendingUp, Skull, Zap, AlertTriangle } from 'lucide-react';

interface PredictionForecastProps {
  predictions: {
    exploding: Array<{ id: string; name: string; score: number; delta: number; stars: number }>;
    dying: Array<{ id: string; name: string; risk: number; last_active: number; stars: number }>;
  };
}

export const PredictionForecast: React.FC<PredictionForecastProps> = ({ predictions }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Exploding Skills */}
      <div className="glass p-8 rounded-3xl shadow-soft border-l-4 border-red-500 flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/20 blur-3xl -mr-16 -mt-16" />
        <div className="flex items-center gap-2 text-red-600">
          <Zap className="w-5 h-5 fill-current animate-pulse" />
          <h3 className="font-black text-lg tracking-tight">Hot Prospects</h3>
        </div>
        <div className="flex flex-col gap-4 relative">
          {predictions.exploding.length > 0 ? predictions.exploding.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-4 bg-white/40 hover:bg-white/60 rounded-2xl border border-red-100/50 transition-all hover:scale-[1.02] cursor-default">
              <div className="flex flex-col">
                <span className="font-black text-slate-900">{s.name}</span>
                <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1">Growth: +{s.delta} / Score: {s.score}</span>
              </div>
              <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1 rounded-full font-black text-sm">
                <TrendingUp className="w-4 h-4" />
                {s.stars}
              </div>
            </div>
          )) : (
            <p className="text-slate-400 text-sm font-medium italic py-10 text-center">No high-momentum signals detected.</p>
          )}
        </div>
      </div>

      {/* Dying Skills */}
      <div className="glass p-8 rounded-3xl shadow-soft border-l-4 border-slate-400 flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100/30 blur-3xl -mr-16 -mt-16" />
        <div className="flex items-center gap-2 text-slate-500">
          <Skull className="w-5 h-5" />
          <h3 className="font-black text-lg tracking-tight">Endangered Skills</h3>
        </div>
        <div className="flex flex-col gap-4 relative">
          {predictions.dying.length > 0 ? predictions.dying.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50/40 hover:bg-slate-50/60 rounded-2xl border border-slate-200/50 transition-all">
              <div className="flex flex-col">
                <span className="font-bold text-slate-700">{s.name}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Inactive: {s.last_active}d / Risk: {s.risk}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 bg-slate-100 px-3 py-1 rounded-full font-bold text-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                {s.stars}
              </div>
            </div>
          )) : (
            <p className="text-slate-400 text-sm font-medium italic py-10 text-center">Ecosystem stability remains high.</p>
          )}
        </div>
      </div>
    </div>
  );
};
