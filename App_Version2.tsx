import React, { useState, useMemo } from 'react';
import { List, BarChart2, Bot, LogOut, Plane } from 'lucide-react';
import { parseCSV } from './services/csvService';
import { analyzeSchedule } from './services/geminiService';
import { rankPairings } from './services/rankingService';
import { Pairing, FilterState, ViewMode, Preference, ScoredPairing } from './types';
import FileUpload from './components/FileUpload';
import FilterPanel from './components/FilterPanel';
import PreferenceManager from './components/PreferenceManager';
import PairingCard from './components/PairingCard';
import StatsView from './components/StatsView';
import { isAfter, isBefore, parseISO } from 'date-fns';

const App: React.FC = () => {
  const [pairings, setPairings] = useState<Pairing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [uniqueAircraft, setUniqueAircraft] = useState<string[]>([]);
  
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    minDuration: 1,
    maxDuration: 10,
    aircraftTypes: [],
    searchQuery: '',
    startDate: '',
    endDate: '',
    minBlockHours: 0
  });

  const [preferences, setPreferences] = useState<Preference[]>([]);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    try {
      const data = await parseCSV(file);
      setPairings(data);
      
      const acTypes = Array.from(new Set(data.map(p => p.aircraftType))).sort();
      setUniqueAircraft(acTypes);
      setFilters(prev => ({ ...prev, aircraftTypes: acTypes }));
      
    } catch (error) {
      console.error("Error parsing CSV", error);
      alert("Error parsing CSV. Please ensure it follows the correct format.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPairings = useMemo(() => {
    return pairings.filter(p => {
      if (p.duration > filters.maxDuration) return false;
      if (filters.aircraftTypes.length > 0 && !filters.aircraftTypes.includes(p.aircraftType)) return false;
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchTarget = `${p.pairingNumber} ${p.details} ${p.aircraftType}`.toLowerCase();
        if (!searchTarget.includes(query)) return false;
      }
      if (filters.startDate) {
        if (isBefore(p.departureTime, parseISO(filters.startDate))) return false;
      }
      if (filters.endDate) {
        if (isAfter(p.departureTime, parseISO(filters.endDate))) return false;
      }
      return true;
    });
  }, [pairings, filters]);

  const scoredPairings: ScoredPairing[] = useMemo(() => {
    return rankPairings(filteredPairings, preferences);
  }, [filteredPairings, preferences]);

  const handleAiAsk = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');
    try {
        const response = await analyzeSchedule(scoredPairings, aiQuery);
        setAiResponse(response);
    } catch (e) {
        setAiResponse("Something went wrong with the AI service.");
    } finally {
        setIsAiLoading(false);
    }
  };

  if (pairings.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8 flex justify-center">
            <div className="bg-aviation-600 p-4 rounded-2xl shadow-lg">
                <Plane className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">PilotBid Pro</h1>
          <p className="text-lg text-slate-600 mb-12">
            The intelligent way to bid. Upload your monthly pairing CSV to get started.
          </p>
          {isLoading ? (
            <div className="flex flex-col items-center animate-pulse">
                <div className="w-8 h-8 border-4 border-aviation-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-aviation-700 font-medium">Parsing Schedule...</p>
            </div>
          ) : (
            <FileUpload onFileSelect={handleFileSelect} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-aviation-600 p-1.5 rounded-lg">
                <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg">PilotBid Pro</span>
            <span className="text-slate-300 text-sm">|</span>
            <span className="text-slate-500 text-sm font-medium">{pairings.length} Total Pairings</span>
          </div>
          <div className="flex items-center gap-2">
             <button 
                onClick={() => setPairings([])}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
             >
                <LogOut className="w-4 h-4" />
                Reset
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
            <FilterPanel 
                filters={filters} 
                setFilters={setFilters} 
                uniqueAircraft={uniqueAircraft}
            />
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
            
            <div className="bg-white p-1 rounded-xl border border-slate-200 inline-flex self-start shadow-sm">
                <button
                    onClick={() => setViewMode(ViewMode.LIST)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === ViewMode.LIST ? 'bg-aviation-50 text-aviation-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <List className="w-4 h-4" /> Pairings ({scoredPairings.length})
                </button>
                <button
                    onClick={() => setViewMode(ViewMode.STATS)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === ViewMode.STATS ? 'bg-aviation-50 text-aviation-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <BarChart2 className="w-4 h-4" /> Statistics
                </button>
                <button
                    onClick={() => setViewMode(ViewMode.AI_CHAT)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === ViewMode.AI_CHAT ? 'bg-aviation-50 text-aviation-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Bot className="w-4 h-4" /> Ask AI
                </button>
            </div>

            {viewMode === ViewMode.LIST && (
                <>
                  <PreferenceManager preferences={preferences} setPreferences={setPreferences} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {scoredPairings.length > 0 ? (
                          scoredPairings.slice(0, 100).map((p) => (
                              <PairingCard key={p.pairingNumber + p.departureTime.toString()} pairing={p} />
                          ))
                      ) : (
                          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200 border-dashed">
                              <LogOut className="w-12 h-12 mx-auto mb-3 opacity-20" />
                              <p>No pairings match your hard filters.</p>
                          </div>
                      )}
                      {scoredPairings.length > 100 && (
                          <div className="col-span-full py-4 text-center text-sm text-slate-400">
                              Showing top 100 of {scoredPairings.length} results based on score.
                          </div>
                      )}
                  </div>
                </>
            )}

            {viewMode === ViewMode.STATS && (
                <StatsView pairings={filteredPairings} />
            )}

            {viewMode === ViewMode.AI_CHAT && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
                    <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
                        {aiResponse ? (
                            <div className="bg-white p-6 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 max-w-[90%]">
                                <div className="flex items-center gap-2 mb-2 text-aviation-600 font-semibold">
                                    <Bot className="w-4 h-4" /> PilotBid Assistant
                                </div>
                                <div className="prose prose-sm prose-slate text-slate-700 whitespace-pre-wrap">
                                    {aiResponse}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                                <Bot className="w-12 h-12 mb-4 opacity-20" />
                                <h3 className="font-semibold text-slate-600 mb-2">How can I help with your schedule?</h3>
                                <p className="max-w-md text-sm">Ask me about the filtered pairings. For example: "Which of these have the longest layovers?" or "Are there any trips to Europe?"</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-white border-t border-slate-100">
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-aviation-500 focus:border-aviation-500 outline-none"
                                placeholder="Ask about these flights..."
                                value={aiQuery}
                                onChange={(e) => setAiQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAiAsk()}
                            />
                            <button 
                                onClick={handleAiAsk}
                                disabled={isAiLoading || !aiQuery.trim()}
                                className="bg-aviation-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-aviation-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAiLoading ? 'Thinking...' : 'Ask'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;