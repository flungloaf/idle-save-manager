import { useEffect, useState } from 'react'
import './index.css'
import { useGameSettings } from './storage'
import button from './components/button'

function App() {
  const [url, setUrl] = useState<string>()
  useEffect(() => {
    const loadUrl = async () => {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })
      setUrl(tabs[0].url)
    }
    loadUrl()
  }, [])
  const [settings, setSettings] = useGameSettings(url)

  const toggleSave = async () => {
    if (settings) {
      setSettings({ ...settings, enabled: !settings.enabled })
      return
    }

    setSettings({
      enabled: false,
      dataType: 'json',
      saves: [],
    })
  }

  console.log({ settings })
  return (
    <div className="p-4">
      <button
        className={button({
          variant: settings?.enabled ? 'toggled' : 'primary',
        })}
        onClick={toggleSave}
      >
        {settings?.enabled ? 'On' : 'Off'}
      </button>
    </div>
  )
}

export default App
