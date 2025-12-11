import React from 'react';
import { Pairing } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatsViewProps {
  pairings: Pairing[];
}

const StatsView: React.FC<StatsViewProps> = ({ pairings }) => {
  const durationCounts = pairings.reduce((acc, p) => {
    acc[p.duration] = (acc[p.duration] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const durationData = Object.keys(durationCounts).map(days => ({
    name: `${days} Days`,
    count: durationCounts[parseInt(days)],
  }));

  const aircraftCounts = pairings.reduce((acc, p) => {
    acc[p.aircraftType] = (acc[p.aircraftType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const aircraftData = Object.keys(aircraftCounts).map(ac => ({
    name: ac,
    count: aircraftCounts[ac],
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Trip Duration Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={durationData}>
              <XAxis dataKey="name" fontSize={12} stroke="#64748b" />
              <YAxis fontSize={12} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f1f5f9' }}
              />
              <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Aircraft Type Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aircraftData} layout="vertical">
              <XAxis type="number" fontSize={12} stroke="#64748b" />
              <YAxis dataKey="name" type="category" fontSize={12} width={50} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f1f5f9' }}
              />
              <Bar dataKey="count" fill="#0284c7" radius={[0, 4, 4, 0]}>
                {aircraftData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0ea5e9' : '#0284c7'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div>
              <p className="text-sm text-slate-500">Total Pairings</p>
              <p className="text-3xl font-bold text-slate-800">{pairings.length}</p>
          </div>
          <div>
              <p className="text-sm text-slate-500">Avg Duration</p>
              <p className="text-3xl font-bold text-slate-800">
                  {(pairings.reduce((acc, p) => acc + p.duration, 0) / (pairings.length || 1)).toFixed(1)} Days
              </p>
          </div>
          <div>
              <p className="text-sm text-slate-500">Avg Block Hours</p>
              <p className="text-3xl font-bold text-slate-800">
                  {(pairings.reduce((acc, p) => acc + p.blockHoursDecimal, 0) / (pairings.length || 1)).toFixed(1)} hrs
              </p>
          </div>
      </div>
    </div>
  );
};

export default StatsView;