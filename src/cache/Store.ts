import {  Logger } from '@nestjs/common';
import { CacheEntry } from './CacheEntry';

export class Store {
    private readonly logger = new Logger(Store.name, { timestamp: true });
    
    entries: Map<string, CacheEntry>;
    //TODO replace Map with lruCache lib 
    // lru: Array<string>;
    constructor() {
        this.entries = new Map<string, CacheEntry>();
    }
    
    /**
     * Retrieves the CacheEntry associated with the given key, or undefined if no such entry exists.
     * @param key the key to retrieve the CacheEntry for
     * @returns the CacheEntry associated with the given key, or undefined if no such entry exists
     */
    get(key: string): CacheEntry | undefined {
      return this.entries.get(key);
    }

  /**
   * Sets the CacheEntry associated with the given key to a new value and returns the CacheEntry.
   * If an entry already exists for the key, its value is updated.
   * @param key the key to set the CacheEntry for
   * @param value the value to set the CacheEntry to
   * @returns the CacheEntry associated with the given key after setting the value
   */
  set(key: string, value: string): CacheEntry {
    let cacheEntry = new CacheEntry(key, value, Date.now());
    this.entries.set(key, cacheEntry);
    return cacheEntry
  }

  /**
   * Checks if a CacheEntry with the given key exists in the Store.
   * @param key the key to check
   * @returns true if a CacheEntry with the given key exists, false otherwise
   */
  has(key: string): boolean {
    return this.entries.has(key);
  }

  /**
   * Deletes the CacheEntry associated with the given key, if it exists.
   * If no CacheEntry exists for the given key, this method does nothing.
   * @param key the key of the CacheEntry to delete
   */
  delete(key: string): void {
    this.entries.delete(key);
  }

  /**
   * Clears all CacheEntries in the Store.
   * After calling this method, the Store will be empty.
   */
  clear(): void {
    this.entries.clear();
  }
  
  /**
   * Converts the Store to a JSON object.
   * The resulting JSON object will have the same keys as the Store,
   * and the values will be the corresponding CacheEntry's toJSON() result.
   * @returns the JSON object representing the Store
   */
  toJSON(): any {
    const entries: Record<string, object> = {};
    for (const [key, val] of this.entries) {
      entries[key] = val.toJSON();
    }
    return entries;
  }

  
}
