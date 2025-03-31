import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Game from '@/manager/Game'
import { Toaster } from '@/components/ui/sonner'
import { useAllGameSettings } from '@/storage'

export const Manager = () => {
  const { settings, deleteGame } = useAllGameSettings()
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Manage saves</h1>
      </div>

      <div className="space-y-4">
        {Array.from(settings.entries()).map(([url]) => (
          <Game key={url} url={url} onDelete={deleteGame} />
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
