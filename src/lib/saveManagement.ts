import { GameSettings } from '@/lib/types'

const isJSON = (data: string) => {
  try {
    JSON.parse(data)
    return true
  } catch {
    return false
  }
}

const isBase64 = (data: string) => {
  try {
    return btoa(atob(data)) === data
  } catch {
    return false
  }
}

export const extractSaveDataFromClipboard = async (settings: GameSettings) => {
  const clipboardData = await navigator.clipboard.readText()
  if (!clipboardData) return

  if (settings.dataType === 'any') {
    return clipboardData
  }

  if (settings.dataType === 'json' && isJSON(clipboardData)) {
    return clipboardData
  }

  if (settings.dataType === 'base64' && isBase64(clipboardData)) {
    return clipboardData
  }
}
