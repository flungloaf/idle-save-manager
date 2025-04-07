type StorageChange = { oldValue: unknown; newValue: unknown }

const storage = new Map<string, unknown>()
const listeners: ((
  changes: Record<string, StorageChange>,
  areaName: string,
) => void)[] = []

const chromeMock = {
  storage: {
    local: {
      get: (
        keys: string | string[] | Record<string, unknown> | null,
        callback: (items: Record<string, unknown>) => void,
      ) => {
        const result: Record<string, unknown> = {}

        if (keys === null) {
          storage.forEach((value, key) => (result[key] = value))
        } else if (typeof keys === 'string') {
          result[keys] = storage.get(keys)
        } else if (Array.isArray(keys)) {
          keys.forEach((k) => (result[k] = storage.get(k)))
        } else {
          Object.entries(keys).forEach(([k, defaultVal]) => {
            result[k] = storage.get(k) ?? defaultVal
          })
        }

        callback(result)
      },

      set: (items: Record<string, unknown>, callback?: () => void) => {
        const changes: Record<string, StorageChange> = {}
        for (const [key, value] of Object.entries(items)) {
          const oldValue = storage.get(key)
          storage.set(key, value)
          changes[key] = { oldValue, newValue: value }
        }

        listeners.forEach((fn) => fn(changes, 'local'))
        callback?.()
      },

      remove: (keys: string | string[], callback?: () => void) => {
        const keysArray = Array.isArray(keys) ? keys : [keys]
        const changes: Record<string, StorageChange> = {}

        keysArray.forEach((key) => {
          const oldValue = storage.get(key)
          storage.delete(key)
          changes[key] = { oldValue, newValue: undefined }
        })

        listeners.forEach((fn) => fn(changes, 'local'))
        callback?.()
      },

      clear: (callback?: () => void) => {
        const changes: Record<string, StorageChange> = {}
        for (const [key, oldValue] of storage.entries()) {
          changes[key] = { oldValue, newValue: undefined }
        }

        storage.clear()
        listeners.forEach((fn) => fn(changes, 'local'))
        callback?.()
      },
    },

    onChanged: {
      addListener: (fn: (typeof listeners)[number]) => listeners.push(fn),
      removeListener: (fn: (typeof listeners)[number]) => {
        const index = listeners.indexOf(fn)
        if (index !== -1) listeners.splice(index, 1)
      },
      hasListener: (fn: (typeof listeners)[number]) => listeners.includes(fn),
    },
  },
}

export default chromeMock
