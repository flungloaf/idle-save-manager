import { useCallback, useEffect, useRef } from 'react'
import { useGameSettings } from './storage'

const DetectCopies = () => {
  const url = window.location.href
  const [settings, setSettings] = useGameSettings(url)
  const settingsRef = useRef(settings)

  useEffect(() => {
    if (settings) {
      settingsRef.current = settings
    }
  }, [settings])

  const handleCopy = useCallback(async () => {
    if (!settingsRef.current?.enabled) return
    const data = await navigator.clipboard.readText()
    if (!data) return
    setSettings((prev) => ({
      ...prev,
      saves: [
        ...prev.saves,
        { name: 'test', data, timestamp: new Date().getTime() },
      ],
    }))
  }, [setSettings])

  useEffect(() => {
    document.addEventListener('copy', handleCopy)
    return () => {
      document.removeEventListener('copy', handleCopy)
    }
  }, [handleCopy])

  return <></>
}

export default DetectCopies
