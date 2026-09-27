import { MeetingAnalysisResult } from './types';

export interface HistoryItem {
  id: string;
  title: string;
  transcript: string;
  customPrompt?: string;
  createdAt: string;
  wordCount: number;
  charCount: number;
  result: MeetingAnalysisResult;
  actionItemCount: number;
  decisionCount: number;
  coverageScore?: number;
}

const STORAGE_KEY = 'meetwise_transcript_history_v1';

/**
 * Retrieves all stored transcript analyses from browser localStorage.
 * Initially empty ([]).
 */
export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read history from localStorage:', err);
    return [];
  }
}

/**
 * Saves a new completed transcript analysis item into localStorage.
 */
export function saveHistoryItem(item: Omit<HistoryItem, 'id' | 'createdAt'>): HistoryItem {
  const history = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  // Prepend to show newest first, limit to latest 50 items to prevent quota issues
  const updated = [newItem, ...history.filter((h) => h.transcript !== item.transcript)].slice(0, 50);

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save item to localStorage:', err);
    }
  }

  return newItem;
}

/**
 * Deletes a single history entry by ID.
 */
export function deleteHistoryItem(id: string): HistoryItem[] {
  const history = getHistory();
  const filtered = history.filter((item) => item.id !== id);
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.error('Failed to delete item from localStorage:', err);
    }
  }
  return filtered;
}

/**
 * Clears all history from localStorage.
 */
export function clearAllHistory(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear history from localStorage:', err);
    }
  }
}
