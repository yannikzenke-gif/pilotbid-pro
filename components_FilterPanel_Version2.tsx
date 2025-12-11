import React from 'react';
import { FilterState } from '../types';
import { Calendar, Clock, Plane, Search } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  uniqueAircraft: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, uniqueAircraft }) => {
  
  const handleAircraftToggle = (ac: string) => {
    setFilters(prev => {
      const exists = prev.aircraftTypes.includes(ac);
      return {
        ...prev,
        aircraftTypes: exists 
          ? prev.aircraftTypes.filter(t => t !== ac)
          : [...prev.aircraftTypes, ac]
      };
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-aviation-600" />
          Search & Filter
        </h2>
        <input
          type="text"
          placeholder="Search destination (e.g., MIA, JFK)..."
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-aviation-500 focus:border-aviation-500 outline-none text-sm"
          value={filters.searchQuery}
          onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
        />
      </div>

      <div className="border-t border-slate-100 pt-4">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Duration (Days)
        </h3>
        <div className="px-2">
          <div className="flex justify-between text-xs text-slate-600 mb-2">
            <span>{filters.minDuration} days</span>
            <span>{filters.maxDuration} days</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={filters.maxDuration}
            onChange={(e) => setFilters(prev => ({ ...prev, maxDuration: parseInt(e.target.value) }))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-aviation-600"
          />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Plane className="w-4 h-4" />
          Aircraft
        </h3>
        <div className="flex flex-wrap gap-2">
          {uniqueAircraft.map(ac => (
            <button
              key={ac}
              onClick={() => handleAircraftToggle(ac)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filters.aircraftTypes.includes(ac)
                  ? 'bg-aviation-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ac}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Dates
        </h3>
        <div className="space-y-2">
            <div className="flex flex-col">
                <label className="text-xs text-slate-500 mb-1">Start Date</label>
                <input 
                    type="date" 
                    className="text-sm border border-slate-300 rounded px-2 py-1 text-slate-700"
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                />
            </div>
            <div className="flex flex-col">
                <label className="text-xs text-slate-500 mb-1">End Date</label>
                <input 
                    type="date" 
                    className="text-sm border border-slate-300 rounded px-2 py-1 text-slate-700"
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                />
            </div>
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-slate-100">
        <button
            onClick={() => setFilters({
                minDuration: 1,
                maxDuration: 10,
                aircraftTypes: uniqueAircraft,
                searchQuery: '',
                startDate: '',
                endDate: '',
                minBlockHours: 0
            })}
            className="w-full py-2 text-sm text-aviation-600 hover:bg-aviation-50 rounded-lg transition-colors"
        >
            Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;