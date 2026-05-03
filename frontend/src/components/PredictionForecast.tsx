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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-red-600">
          <Zap className="w-5 h-5 fill-current" />
          <h3 className="font-bold text-lg">Hot Prospects (High Explosion Score)</h3>
        </div>
        <div className="flex flex-col gap-3">
          {predictions.exploding.length > 0 ? predictions.exploding.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="flex flex-col">
                <span className="font-bold text-gray-900">{s.name}</span>
                <span className="text-xs text-red-600">Growth: +{s.delta} stars / Score: {s.score}</span>
              </div>
              <div className="flex items-center gap-1 text-red-600 font-bold">
                <TrendingUp className="w-4 h-4" />
                {s.stars}
              </div>
            </div>
          )) : (
            <p className="text-gray-400 text-sm italic">No high-momentum skills detected in this cycle.</p>
          )}
        </div>
      </div>

      {/* Dying Skills */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-gray-500">
          <Skull className="w-5 h-5" />
          <h3 className="font-bold text-lg">Endangered Skills (High Death Risk)</h3>
        </div>
        <div className="flex flex-col gap-3">
          {predictions.dying.length > 0 ? predictions.dying.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex flex-col">
                <span className="font-bold text-gray-700">{s.name}</span>
                <span className="text-xs text-gray-500">Inactive: {s.last_active} days / Risk: {s.risk}%</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400 font-medium text-sm">
                <AlertTriangle className="w-4 h-4" />
                {s.stars} stars
              </div>
            </div>
          )) : (
            <p className="text-gray-400 text-sm italic">Ecosystem stability remains high.</p>
          )}
        </div>
      </div>
    </div>
  );
};
