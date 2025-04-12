import { useMap } from '@uidotdev/usehooks'
import { useCallback, useEffect, useState } from 'react'

import { GameSettings } from './types'

export const defaultSettigns: GameSettings = {
  enabled: false,
  dataType: 'any',
  saves: [],
  name: '',
  url: '',
  favicon: '',
  showFavicon: true,
}

/**
 * A custom hook for managing state in chrome.storage.local
 * @param key The storage key.
 * @param defaultValue The default value if none exists in storage.
 * @returns A stateful value and a function to update it.
 */
export const useChromeStorageState = <T>(
  key: string,
  defaultValue: T,
): [T, (newValue: T | ((prev: T) => T)) => void] => {
  const [state, setState] = useState<T>(defaultValue)

  useEffect(() => {
    // Fetch initial value from chrome.storage
    chrome.storage.local.get(key, (data) => {
      if (data[key] !== undefined) {
        setState(data[key] as T)
      } else {
        setState(defaultValue)
      }
    })

    // Listen for changes in storage
    const handleStorageChange = (
      changes: Record<string, chrome.storage.StorageChange>,
    ) => {
      if (changes[key]) {
        setState(changes[key].newValue as T)
      }
    }
    chrome.storage.onChanged.addListener(handleStorageChange)

    return () => chrome.storage.onChanged.removeListener(handleStorageChange)
  }, [defaultValue, key])

  // Function to update state and storage
  const setChromeStorageState = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setState((prev) => {
        const updatedValue =
          newValue instanceof Function ? newValue(prev) : newValue
        chrome.storage.local.set({ [key]: updatedValue })
        return updatedValue
      })
    },
    [key],
  )

  return [state, setChromeStorageState]
}

export const useGameSettings = (
  url?: string,
): ReturnType<typeof useChromeStorageState<GameSettings>> => {
  // return this is there is no key for consistency
  const defaultState = useState<GameSettings>(defaultSettigns)
  const chromeStorageState = useChromeStorageState<GameSettings>(
    url || 'default',
    defaultSettigns,
  )
  return url ? chromeStorageState : defaultState
}

export const useAllGameSettings = () => {
  const settings = useMap<string>()

  const fetchSettings = useCallback(() => {
    chrome.storage.local.get(null, (data) => {
      Object.entries(data).forEach(([key, value]) => {
        settings.set(key, value)
      })
    })
  }, [settings])

  const onChange = useCallback(
    (changes: Record<string, chrome.storage.StorageChange>) =>
      Object.entries(changes).forEach(([key, { newValue }]) => {
        if (!newValue) {
          settings.delete(key)
          return
        }
        settings.set(key, newValue)
      }),
    [settings],
  )

  useEffect(() => {
    fetchSettings()
    chrome.storage.onChanged.addListener(onChange)
    return () => {
      chrome.storage.onChanged.removeListener(onChange)
    }
  }, [fetchSettings, onChange])

  const deleteGame = useCallback(
    (url: string) => {
      chrome.storage.local.remove(url)
      settings.delete(url)
    },
    [settings],
  )

  return { settings, deleteGame }
}
