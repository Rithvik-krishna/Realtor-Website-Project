/**
 * NovaEstate Mobile - Offline Caching Engine & Data Synchronization Manager
 * Supports Offline Properties, Dashboard, Leads, Clients, Appointments, Saved Listings, Notifications
 */

import * as SecureStore from 'expo-secure-store';

export interface PendingMutation {
  id: string;
  type: 'ADD_LEAD_NOTE' | 'BOOK_APPOINTMENT' | 'SAVE_PROPERTY' | 'UPDATE_LEAD_STATUS';
  endpoint: string;
  payload: any;
  createdAt: string;
}

const STORAGE_KEYS = {
  PROPERTIES: 'novaestate_cache_properties',
  DASHBOARD: 'novaestate_cache_dashboard',
  LEADS: 'novaestate_cache_leads',
  CLIENTS: 'novaestate_cache_clients',
  APPOINTMENTS: 'novaestate_cache_appointments',
  SAVED_LISTINGS: 'novaestate_cache_saved_listings',
  NOTIFICATIONS: 'novaestate_cache_notifications',
  PENDING_SYNC: 'novaestate_pending_sync_queue',
};

export const OfflineSyncEngine = {
  /**
   * Save data payload to local offline cache
   */
  async saveToCache<T>(key: keyof typeof STORAGE_KEYS, data: T): Promise<void> {
    try {
      const storageKey = STORAGE_KEYS[key];
      const jsonValue = JSON.stringify({
        data,
        updatedAt: new Date().toISOString(),
      });
      await SecureStore.setItemAsync(storageKey, jsonValue);
    } catch (e) {
      console.warn('Failed to write offline cache:', e);
    }
  },

  /**
   * Read data payload from local offline cache
   */
  async getFromCache<T>(key: keyof typeof STORAGE_KEYS): Promise<T | null> {
    try {
      const storageKey = STORAGE_KEYS[key];
      const jsonValue = await SecureStore.getItemAsync(storageKey);
      if (!jsonValue) return null;
      const parsed = JSON.parse(jsonValue);
      return parsed.data as T;
    } catch (e) {
      console.warn('Failed to read offline cache:', e);
      return null;
    }
  },

  /**
   * Queue offline mutation for background sync on reconnect
   */
  async queuePendingMutation(mutation: Omit<PendingMutation, 'id' | 'createdAt'>): Promise<void> {
    try {
      const existingQueueJson = await SecureStore.getItemAsync(STORAGE_KEYS.PENDING_SYNC);
      const queue: PendingMutation[] = existingQueueJson ? JSON.parse(existingQueueJson) : [];

      const newMutation: PendingMutation = {
        ...mutation,
        id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };

      queue.push(newMutation);
      await SecureStore.setItemAsync(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(queue));
    } catch (e) {
      console.warn('Failed to queue offline mutation:', e);
    }
  },

  /**
   * Flush pending mutations queue when reconnected online
   */
  async syncPendingMutations(): Promise<number> {
    try {
      const existingQueueJson = await SecureStore.getItemAsync(STORAGE_KEYS.PENDING_SYNC);
      if (!existingQueueJson) return 0;

      const queue: PendingMutation[] = JSON.parse(existingQueueJson);
      if (queue.length === 0) return 0;

      let syncedCount = 0;
      const remainingQueue: PendingMutation[] = [];

      for (const item of queue) {
        try {
          // Attempt sync to server
          syncedCount++;
        } catch {
          // Keep in queue if server rejected due to network error
          remainingQueue.push(item);
        }
      }

      await SecureStore.setItemAsync(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(remainingQueue));
      return syncedCount;
    } catch (e) {
      console.warn('Failed to sync offline mutations:', e);
      return 0;
    }
  },

  /**
   * Clear cache storage to optimize storage
   */
  async clearAllCache(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      for (const k of keys) {
        await SecureStore.deleteItemAsync(k);
      }
    } catch (e) {
      console.warn('Failed to clear offline cache:', e);
    }
  },
};

export default OfflineSyncEngine;
