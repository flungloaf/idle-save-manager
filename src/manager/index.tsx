import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { GameSettings } from '@/storage/types'
import Game from '@/manager/Game'
import { Toaster } from '@/components/ui/sonner'

export const Manager = () => {
  // This is where you would fetch the game settings from storage
  const [allSettings, setAllSettings] = useState<GameSettings[]>([
    {
      dataType: 'json',
      enabled: true,
      url: 'https://example.com',
      name: 'example game',
      saves: [
        {
          data: 'example data',
          name: 'example save',
          timestamp: new Date().getTime(),
        },
        {
          data: 'example data',
          name: 'example save',
          timestamp: new Date().getTime(),
        },
        {
          data: 'example data',
          name: 'example save',
          timestamp: new Date().getTime(),
        },
      ],
    },
    {
      dataType: 'base64',
      enabled: false,
      saves: [
        {
          data: 'example data',
          name: 'example save',
          timestamp: new Date().getTime(),
        },
        {
          data: 'example data',
          name: 'example save',
          timestamp: new Date().getTime(),
        },
        {
          data: 'example data',
          name: 'example save',
          timestamp: new Date().getTime(),
        },
      ],
      url: 'https://example.com',
      name: 'example game',
    },
  ])

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Manage saves</h1>
      </div>

      <div className="space-y-4">
        {allSettings.map((settings, index) => (
          <Game
            key={index}
            settings={settings}
            setSettings={(s) =>
              setAllSettings((prev) => {
                const newSettings = [...prev]
                newSettings[index] = s
                return newSettings
              })
            }
          />
        ))}
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Manager />
    <Toaster />
  </StrictMode>,
)
