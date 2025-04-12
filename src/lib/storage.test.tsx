import { renderHook, act } from '@testing-library/react'

import {
  useChromeStorageState,
  useGameSettings,
  defaultSettigns,
  useAllGameSettings,
} from '@/lib/storage'

beforeEach(() => {
  chrome.storage.local.clear()
})

describe('useChromeStorageState', () => {
  it('sets a default value', () => {
    const { result } = renderHook(() =>
      useChromeStorageState('testKey', 'defaultValue'),
    )
    const [state] = result.current
    expect(state).toBe('defaultValue')
  })

  it('updates the value', () => {
    const { result } = renderHook(() =>
      useChromeStorageState('testKey', 'defaultValue'),
    )
    const [, setState] = result.current

    act(() => {
      setState('newValue')
    })

    const [state] = result.current
    expect(state).toBe('newValue')
  })

  it('updates with a function', () => {
    const { result } = renderHook(() => useChromeStorageState('testKey', 0))
    const [, setState] = result.current
    act(() => {
      setState((prev) => prev + 1)
    })
    const [state] = result.current
    expect(state).toBe(1)
  })

  it('returns a value present in storage', () => {
    chrome.storage.local.set({ testKey: 'storedValue' })
    const { result } = renderHook(() =>
      useChromeStorageState('testKey', 'defaultValue'),
    )
    const [state] = result.current
    expect(state).toBe('storedValue')
  })

  it('listens to store changes', () => {
    const { result } = renderHook(() =>
      useChromeStorageState('testKey', 'defaultValue'),
    )

    const [state] = result.current
    expect(state).toBe('defaultValue')
    act(() => {
      chrome.storage.local.set({ testKey: 'changedValue' })
    })

    const [updatedState] = result.current
    expect(updatedState).toBe('changedValue')
  })

  it('unsubscribes from storage changes when changing key', () => {
    const { result, rerender } = renderHook(
      ({ key }) => useChromeStorageState(key, 'defaultValue'),
      {
        initialProps: { key: 'testKey' },
      },
    )

    const [state] = result.current
    expect(state).toBe('defaultValue')

    act(() => {
      chrome.storage.local.set({ testKey: 'changedValue' })
    })

    const [updatedState] = result.current
    expect(updatedState).toBe('changedValue')

    rerender({ key: 'anotherKey' })

    const [newState] = result.current
    expect(newState).toBe('defaultValue')
  })
})

describe('useGameSettings', () => {
  it('returns default settings when no URL is provided', () => {
    const { result } = renderHook(() => useGameSettings())
    const [state] = result.current
    expect(state).toEqual(defaultSettigns)
  })

  it('loads new settings when URL changes', async () => {
    const url = 'https://example.com'
    act(() => {
      chrome.storage.local.set({
        [url]: {
          ...defaultSettigns,
          url,
        },
      })
    })

    const { result, rerender } = renderHook(({ url }) => useGameSettings(url), {
      initialProps: { url },
    })

    const [state] = result.current
    expect(state.url).toBe(url)

    rerender({ url: 'pepega' })

    const [updatedState] = result.current
    expect(updatedState.url).not.toBe(url)
  })
})

describe('useAllGameSettings', () => {
  it('returns all game settings', async () => {
    const url1 = 'https://example.com'
    const url2 = 'https://example2.com'

    act(() => {
      chrome.storage.local.set({
        [url1]: {
          ...defaultSettigns,
          url: url1,
        },
        [url2]: {
          ...defaultSettigns,
          url: url2,
        },
      })
    })

    const { result } = renderHook(() => useAllGameSettings())
    expect(Array.from(result.current.settings).map(([, v]) => v.url)).toEqual([
      url1,
      url2,
    ])
  })

  it('tracks changes in game settings', async () => {
    const url1 = 'https://example.com'
    const url2 = 'https://example2.com'

    act(() => {
      chrome.storage.local.set({
        [url1]: {
          ...defaultSettigns,
          url: url1,
        },
        [url2]: {
          ...defaultSettigns,
          url: url2,
        },
      })
    })

    const { result } = renderHook(() => useAllGameSettings())
    const { settings } = result.current
    expect(settings.size).toBe(2)

    act(() => {
      chrome.storage.local.set({
        [url1]: {
          ...defaultSettigns,
          url: url1,
          newSetting: 'newValue',
        },
      })
    })

    const { settings: updatedSettings } = result.current
    expect(updatedSettings.get(url1)?.newSetting).toBe('newValue')
  })

  it('deletes a game setting', async () => {
    const url1 = 'https://example.com'
    const url2 = 'https://example2.com'

    act(() => {
      chrome.storage.local.set({
        [url1]: {
          ...defaultSettigns,
          url: url1,
        },
        [url2]: {
          ...defaultSettigns,
          url: url2,
        },
      })
    })

    const { result } = renderHook(() => useAllGameSettings())
    const { settings, deleteGame } = result.current
    expect(settings.size).toBe(2)

    act(() => {
      deleteGame(url1)
    })

    const { settings: updatedSettings } = result.current
    expect(updatedSettings.size).toBe(1)
  })
})
