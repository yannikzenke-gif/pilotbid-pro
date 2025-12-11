import React from 'react';
import { ScoredPairing } from '../types';
import { format } from 'date-fns';
import { Clock, MapPin, CalendarDays, Plane, Star, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PairingCardProps {
  pairing: ScoredPairing;
}

const PairingCard: React.FC<PairingCardProps> = ({ pairing }) => {
  const routeDisplay = pairing.details ? pairing.details.replace(/-/g, ' → ') : '';

  const getScoreColor = (score: number) => {
    if (score >= 50) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score > 0) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score < 0) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-slate-500 bg-slate-100 border-slate-200';
  };

  const scoreClass = getScoreColor(pairing.score);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-aviation-300 group flex flex-col h-full">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-slate-900">Pairing {pairing.pairingNumber}</span>
              {pairing.preAssigned && (
                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Pre-Assigned
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Plane className="w-3 h-3" />
              <span>{pairing.aircraftType}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
             <div className={`px-2 py-1 rounded-lg text-sm font-bold border flex items-center gap-1 ${scoreClass}`}>
                <Star className="w-3 h-3 fill-current" />
                Score: {pairing.score}
             </div>
             <div className="text-[10px] text-slate-400 font-medium">{pairing.duration} Days • {pairing.blockHours} BH</div>
          </div>
        </div>

        {pairing.matches && pairing.matches.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {pairing.matches.map((match, idx) => {
              const isViolation = match.includes('Violated') || match.includes('Conflicts');
              return (
                <span 
                  key={idx} 
                  className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                    isViolation 
                        ? 'bg-red-50 text-red-600 border-red-100' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  }`}
                >
                  {isViolation ? <AlertCircle className="w-2.5 h-2.5" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
                  {match}
                </span>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
              <CalendarDays className="w-3 h-3" /> Departure
            </div>
            <div className="font-semibold text-slate-700 text-sm">
              {format(pairing.departureTime, 'MMM dd, yyyy')}
            </div>
            <div className="text-xs text-slate-500">
              {format(pairing.departureTime, 'HH:mm')}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Arrival
            </div>
            <div className="font-semibold text-slate-700 text-sm">
              {format(pairing.arrivalTime, 'MMM dd, yyyy')}
            </div>
            <div className="text-xs text-slate-500">
              {format(pairing.arrivalTime, 'HH:mm')}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3 mt-auto">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600 leading-relaxed font-mono break-words">
              {routeDisplay}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PairingCard;