import { useCallback, useEffect, useRef } from 'react'

import { extractSaveDataFromClipboard } from '@/lib/saveManagement'
import { useGameSettings } from '@/lib/storage'

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
    const data = await extractSaveDataFromClipboard(settingsRef.current)
    if (!data) return
    setSettings((prev) => ({
      ...prev,
      saves: [
        ...prev.saves,
        {
          name: (prev.saves.length + 1).toString(),
          data,
          timestamp: new Date().getTime(),
        },
      ].sort((a, b) => b.timestamp - a.timestamp),
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
