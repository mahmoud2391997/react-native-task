import { MMKV } from 'react-native-mmkv';

let storage: MMKV | null = null;

try {
  storage = new MMKV();
} catch (error) {
  console.error('Failed to initialize MMKV:', error);
  // Fallback to a mock storage implementation
  storage = null;
}

const createMockStorage = () => ({
  getString: (key: string) => undefined,
  set: (key: string, value: string) => {},
  delete: (key: string) => {},
});

export const mmkvStorage = {
  getItem: (key: string): string | null => {
    if (!storage) return null;
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: (key: string, value: string): void => {
    if (!storage) return;
    try {
      storage.set(key, value);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded. Clearing cache and retrying.');
        // Clear storage and retry
        storage.clearAll();
        try {
          storage.set(key, value);
        } catch (retryError) {
          console.error('Failed to set item even after clearing cache:', retryError);
        }
      } else {
        console.error('Failed to set item in storage:', error);
      }
    }
  },
  removeItem: (key: string): void => {
    if (!storage) return;
    storage.delete(key);
  },
};