import Papa from 'papaparse';
import { parse, isValid } from 'date-fns';
import { Pairing } from '../types';

// Example date format in CSV: "Oct 12,2025 12:15"
const DATE_FORMAT = 'MMM dd,yyyy HH:mm';

const parseBlockHours = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours + (minutes / 60);
};

const extractLayovers = (details: string): string[] => {
  if (!details) return [];
  const stations = details.split('-').map(s => s.trim()).filter(s => s.length > 0);
  return Array.from(new Set(stations));
};

export const parseCSV = (file: File): Promise<Pairing[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const pairings: Pairing[] = [];
        
        results.data.forEach((row: any) => {
          try {
            const departureString = row['Departure'];
            const arrivalString = row['Arrival'];
            
            if (!departureString || !arrivalString) return;

            const departureTime = parse(departureString, DATE_FORMAT, new Date());
            const arrivalTime = parse(arrivalString, DATE_FORMAT, new Date());

            if (!isValid(departureTime) || !isValid(arrivalTime)) return;

            pairings.push({
              pairingNumber: row['Pairing'],
              preAssigned: row['Pre-assigned'] || '',
              duration: parseInt(row['Duration'], 10),
              aircraftType: row['AC'],
              departureTime,
              arrivalTime,
              details: row['Pairing details'],
              blockHours: row['Block hours'],
              blockHoursDecimal: parseBlockHours(row['Block hours']),
              layovers: extractLayovers(row['Pairing details'])
            });
          } catch (e) {
            console.warn("Failed to parse row", row, e);
          }
        });

        resolve(pairings);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};