// MINEGOV AI - Offline Queue & Synchronization Service
import type { OfflineQueueItem } from '../types';

const STORAGE_KEY = 'minegov_offline_queue';

export function getOfflineQueue(): OfflineQueueItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToOfflineQueue(item: Omit<OfflineQueueItem, 'id' | 'timestamp'>): OfflineQueueItem {
  const newItem: OfflineQueueItem = {
    ...item,
    id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    timestamp: new Date().toISOString(),
  };

  const current = getOfflineQueue();
  const updated = [...current, newItem];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newItem;
}

export function clearOfflineQueue(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}
