// Lightweight client-side analyzer — safe to run in browser.
// This replaces any server-only SDK usage so the app can be published as a static site.
//
// It inspects the scored pairings and returns a concise summary based on a simple heuristic.

import { ScoredPairing } from '../types';
import { format } from 'date-fns';

export const analyzeSchedule = async (pairings: ScoredPairing[], userQuery: string): Promise<string> => {
  try {
    if (!pairings || pairings.length === 0) {
      return "There are no pairings in the current filtered list. Try widening your filters (dates, aircraft, or duration) to get more results.";
    }

    const q = (userQuery || '').toLowerCase();
    const wantsLongest = q.includes('longest') || q.includes('long layover') || q.includes('long layovers');
    const wantsEurope = q.includes('europe') || q.includes('europ');
    const wantsMaxBlock = q.includes('block') || q.includes('earn') || q.includes('money') || q.includes('hours');

    const sorted = [...pairings].sort((a, b) => b.score - a.score);
    const top = sorted.slice(0, Math.min(5, sorted.length));

    const lines: string[] = [];
    lines.push(`I've reviewed ${pairings.length} filtered pairings and here are highlights based on your query: "${userQuery}".`);
    lines.push('');

    if (wantsLongest) {
      const byLayovers = [...pairings].sort((a, b) => (b.layovers?.length || 0) - (a.layovers?.length || 0));
      const pick = byLayovers[0];
      if (pick) {
        lines.push(`Longest layovers (approx): Pairing ${pick.pairingNumber} • ${pick.layovers?.length || 0} layovers — ${format(pick.departureTime, 'MMM dd HH:mm')} → ${format(pick.arrivalTime, 'MMM dd HH:mm')}`);
        lines.push('');
      }
    }

    if (wantsEurope) {
      const euroMatches = pairings.filter(p => /LON|CDG|FRA|MAD|BCN|AMS|ZRH|MXP|FCO|VIE/i.test(p.details));
      if (euroMatches.length > 0) {
        lines.push(`Trips mentioning common European airports: ${euroMatches.slice(0, 5).map(p => `Pairing ${p.pairingNumber}`).join(', ')}.`);
        lines.push('');
      } else {
        lines.push("I couldn't find obvious European trips in the filtered list.");
        lines.push('');
      }
    }

    if (wantsMaxBlock) {
      const byBlock = [...pairings].sort((a, b) => (b.blockHoursDecimal || 0) - (a.blockHoursDecimal || 0));
      const pick = byBlock[0];
      if (pick) {
        lines.push(`Highest block hours: Pairing ${pick.pairingNumber} • ${pick.blockHours} BH (${pick.blockHoursDecimal.toFixed(1)} hrs) — Score: ${pick.score}`);
        lines.push('');
      }
    }

    lines.push('Top picks (by computed score):');
    top.forEach((p, idx) => {
      const when = `${format(p.departureTime, 'MMM dd HH:mm')} → ${format(p.arrivalTime, 'MMM dd HH:mm')}`;
      const matchSnippet = (p.matches && p.matches.length > 0) ? `Matches: ${p.matches.slice(0, 3).join('; ')}` : '';
      lines.push(`${idx + 1}. Pairing ${p.pairingNumber} • Score: ${p.score} • ${when} • ${p.blockHours} BH ${matchSnippet ? ' • ' + matchSnippet : ''}`);
    });

    const scores = pairings.map(p => p.score);
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    if (max - min < 20) {
      lines.push('');
      lines.push("Note: Scores are close across pairings — consider tightening preferences or adding a strategy (e.g., Maximize Earnings) to make clearer distinctions.");
    }

    return lines.join('\n');
  } catch (err) {
    console.error('Local analyzer error:', err);
    return "Sorry, I couldn't analyze the schedule due to an internal error. Try again or ask a simpler question.";
  }
};

export default analyzeSchedule;