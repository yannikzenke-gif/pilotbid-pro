export interface Pairing {
  pairingNumber: string;
  preAssigned: string;
  duration: number;
  aircraftType: string;
  departureTime: Date;
  arrivalTime: Date;
  details: string;
  blockHours: string;
  blockHoursDecimal: number;
  layovers: string[];
}

export interface ScoredPairing extends Pairing {
  score: number;
  matches: string[]; // Descriptions of what matched (e.g. "Preferred Route: JFK")
}

export type PreferenceType = 
  | 'ROUTE' 
  | 'TIME_WINDOW' 
  | 'MAX_DURATION' 
  | 'AVOID_AIRPORT'
  | 'SPECIFIC_DATE_OFF'   // User wants a specific calendar date free
  | 'DAY_OF_WEEK_OFF'     // User wants specific weekdays free (e.g. Sundays)
  | 'STRATEGY_MONEY'      // Maximize Block Hours
  | 'AVOID_RED_EYE'       // Avoid arrivals between 00:00 - 07:00
  | 'MAX_LEGS_PER_DAY';   // Limit number of flights per day

export interface Preference {
  id: string;
  type: PreferenceType;
  value: string; // Stored as string, parsed based on type
  label: string; // Display name
}

export interface FilterState {
  minDuration: number;
  maxDuration: number;
  aircraftTypes: string[];
  searchQuery: string;
  startDate: string;
  endDate: string;
  minBlockHours: number;
}

export enum ViewMode {
  LIST = 'LIST',
  STATS = 'STATS',
  AI_CHAT = 'AI_CHAT'
}