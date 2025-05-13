import { MMKV } from "react-native-mmkv"

export const storage = new MMKV()

const Storage = {
  setItem: (key, value) => {
    storage.set(key, JSON.stringify(value))
    return Promise.resolve(true)
  },
  getItem: (key) => {
    const value = storage.getString(key)
    return Promise.resolve(value ? JSON.parse(value) : undefined)
  },
  removeItem: (key) => {
    storage.delete(key)
    return Promise.resolve()
  },
  removeAllItems: async () => {
    const keys = storage.getAllKeys();
    keys.forEach((key) => {
      storage.delete(key);
    });
    return Promise.resolve();
  },
  getStorageKeys: () => {
    const value = storage.getAllKeys();
    return Promise.resolve(value || [])
  },
}

export default Storage