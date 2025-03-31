import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Game from '@/manager/Game'
import { Toaster } from '@/components/ui/sonner'
import { useAllGameSettings } from '@/storage'
import { Card, CardContent } from '@/components/ui/card'
import { TooltipProvider } from '@/components/ui/tooltip'

export const Manager = () => {
  const { settings, deleteGame } = useAllGameSettings()
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Manage saves</h1>
      </div>

      <div className="space-y-4">
        {Array.from(settings.entries()).length === 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="text-center text-sm text-muted-foreground">
                No games found. Add a game to manage saves.
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Go to a page with a game, click the extension icon and turn it
                on to add a game
              </div>
            </CardContent>
          </Card>
        )}
        {Array.from(settings.entries()).map(([url]) => (
          <Game key={url} url={url} onDelete={deleteGame} />
        ))}
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
      <Manager />
      <Toaster />
    </TooltipProvider>
  </StrictMode>,
)
