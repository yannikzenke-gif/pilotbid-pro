import React, { useState } from 'react';
import { Preference, PreferenceType } from '../types';
import { Plus, X, Star, Ban, Clock, Map, Calendar, DollarSign, Coffee, Layers } from 'lucide-react';

interface PreferenceManagerProps {
  preferences: Preference[];
  setPreferences: React.Dispatch<React.SetStateAction<Preference[]>>;
}

const PreferenceManager: React.FC<PreferenceManagerProps> = ({ preferences, setPreferences }) => {
  const [activeType, setActiveType] = useState<PreferenceType>('ROUTE');
  const [inputValue, setInputValue] = useState('');
  
  const [startTime, setStartTime] = useState('06');
  const [endTime, setEndTime] = useState('12');
  const [dateValue, setDateValue] = useState('');
  const [weekdayValue, setWeekdayValue] = useState('0');

  const addPreference = () => {
    if (activeType === 'ROUTE' && !inputValue.trim()) return;
    if (activeType === 'AVOID_AIRPORT' && !inputValue.trim()) return;
    if (activeType === 'MAX_DURATION' && !inputValue.trim()) return;
    if (activeType === 'SPECIFIC_DATE_OFF' && !dateValue) return;

    let value = inputValue;
    let label = '';

    switch (activeType) {
      case 'STRATEGY_MONEY':
        value = 'true';
        label = 'Strategy: Maximize Earnings';
        if (preferences.some(p => p.type === 'STRATEGY_MONEY')) return;
        break;
      case 'AVOID_RED_EYE':
        value = 'true';
        label = 'Avoid: Red Eye Arrivals (00:00-07:00)';
        if (preferences.some(p => p.type === 'AVOID_RED_EYE')) return;
        break;
      case 'SPECIFIC_DATE_OFF':
        value = dateValue;
        label = `OFF: ${dateValue}`;
        break;
      case 'DAY_OF_WEEK_OFF':
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        value = weekdayValue;
        label = `OFF: Every ${days[parseInt(weekdayValue)]}`;
        break;
      case 'MAX_LEGS_PER_DAY':
        value = inputValue || '2';
        label = `Max Legs/Day: ${value}`;
        break;
      case 'ROUTE':
        label = `Prefer Route: ${value.toUpperCase()}`;
        break;
      case 'AVOID_AIRPORT':
        label = `Avoid Airport: ${value.toUpperCase()}`;
        break;
      case 'MAX_DURATION':
        label = `Max Duration: ${value} days`;
        break;
      case 'TIME_WINDOW':
        value = `${startTime}-${endTime}`;
        label = `Time: ${startTime}:00 - ${endTime}:00`;
        break;
    }

    const newPref: Preference = {
      id: Date.now().toString(),
      type: activeType,
      value,
      label
    };

    setPreferences(prev => [...prev, newPref]);
    setInputValue('');
    setDateValue('');
  };

  const removePreference = (id: string) => {
    setPreferences(prev => prev.filter(p => p.id !== id));
  };

  const getIcon = (type: PreferenceType) => {
    switch (type) {
        case 'STRATEGY_MONEY': return <DollarSign className="w-3 h-3" />;
        case 'SPECIFIC_DATE_OFF': return <Calendar className="w-3 h-3" />;
        case 'DAY_OF_WEEK_OFF': return <Coffee className="w-3 h-3" />;
        case 'AVOID_RED_EYE': return <Ban className="w-3 h-3" />;
        case 'MAX_LEGS_PER_DAY': return <Layers className="w-3 h-3" />;
        case 'AVOID_AIRPORT': return <Ban className="w-3 h-3" />;
        case 'TIME_WINDOW': return <Clock className="w-3 h-3" />;
        default: return <Map className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-amber-500" />
        Priorities & Preferences
      </h2>
      
      <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-end bg-slate-50 p-4 rounded-lg mb-4">
        <div className="w-full xl:w-1/3">
          <label className="block text-xs font-medium text-slate-500 mb-1">I want to...</label>
          <select 
            value={activeType}
            onChange={(e) => setActiveType(e.target.value as PreferenceType)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-aviation-500 outline-none"
          >
            <optgroup label="Work-Life Balance">
                <option value="SPECIFIC_DATE_OFF">Block Specific Date Off</option>
                <option value="DAY_OF_WEEK_OFF">Block Day of Week (e.g. Sundays)</option>
                <option value="MAX_DURATION">Limit Trip Duration</option>
                <option value="AVOID_RED_EYE">Avoid Red-Eye Arrivals</option>
                <option value="MAX_LEGS_PER_DAY">Limit Flights per Day</option>
            </optgroup>
            <optgroup label="Strategy">
                <option value="STRATEGY_MONEY">Maximize Earnings (High Block Hours)</option>
            </optgroup>
            <optgroup label="Routing">
                <option value="ROUTE">Prefer Airport/Route</option>
                <option value="TIME_WINDOW">Prefer Departure Time</option>
                <option value="AVOID_AIRPORT">Avoid Airport</option>
            </optgroup>
          </select>
        </div>

        <div className="w-full xl:w-1/3">
          <label className="block text-xs font-medium text-slate-500 mb-1">Details</label>
          
          {activeType === 'TIME_WINDOW' && (
            <div className="flex items-center gap-2">
              <select value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full px-2 py-2 rounded-lg border border-slate-300 text-sm">
                {Array.from({length: 24}, (_, i) => i).map(h => <option key={h} value={h}>{h}:00</option>)}
              </select>
              <span className="text-slate-400">-</span>
              <select value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full px-2 py-2 rounded-lg border border-slate-300 text-sm">
                {Array.from({length: 24}, (_, i) => i).map(h => <option key={h} value={h}>{h}:00</option>)}
              </select>
            </div>
          )}

          {activeType === 'SPECIFIC_DATE_OFF' && (
             <input 
                type="date"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-aviation-500 outline-none"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
             />
          )}

          {activeType === 'DAY_OF_WEEK_OFF' && (
             <select 
                value={weekdayValue} 
                onChange={e => setWeekdayValue(e.target.value)} 
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
             >
                <option value="0">Sundays</option>
                <option value="1">Mondays</option>
                <option value="2">Tuesdays</option>
                <option value="3">Wednesdays</option>
                <option value="4">Thursdays</option>
                <option value="5">Fridays</option>
                <option value="6">Saturdays</option>
             </select>
          )}

          {(activeType === 'STRATEGY_MONEY' || activeType === 'AVOID_RED_EYE') && (
              <div className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-sm text-slate-500 italic">
                  No additional input needed.
              </div>
          )}

          {['ROUTE', 'AVOID_AIRPORT', 'MAX_DURATION', 'MAX_LEGS_PER_DAY'].includes(activeType) && (
            <input
              type={activeType.includes('MAX') ? 'number' : 'text'}
              placeholder={activeType === 'MAX_LEGS_PER_DAY' ? 'e.g. 2' : activeType === 'ROUTE' ? 'e.g. JFK' : 'Value'}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-aviation-500 outline-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPreference()}
            />
          )}
        </div>

        <button 
          onClick={addPreference}
          className="bg-aviation-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-aviation-700 transition-colors flex items-center justify-center gap-1 w-full xl:w-auto"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {preferences.length === 0 ? (
        <p className="text-sm text-slate-400 italic">No preferences added. Add rules to rank flights by what matters to you.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {preferences.map(pref => {
             const isNegative = ['AVOID_AIRPORT', 'AVOID_RED_EYE', 'SPECIFIC_DATE_OFF'].includes(pref.type);
             const isStrategy = pref.type === 'STRATEGY_MONEY';
             
             let colorClass = 'bg-blue-50 text-blue-800 border-blue-100';
             if (isNegative) colorClass = 'bg-red-50 text-red-700 border-red-100';
             if (isStrategy) colorClass = 'bg-emerald-50 text-emerald-800 border-emerald-100';

             return (
                <div 
                key={pref.id} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${colorClass}`}
                >
                {getIcon(pref.type)}
                {pref.label}
                <button 
                    onClick={() => removePreference(pref.id)} 
                    className={`hover:bg-black/10 rounded-full p-0.5 transition-colors`}
                >
                    <X className="w-3 h-3" />
                </button>
                </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PreferenceManager;