import { Card, CardContent } from '@/components/ui/card'
import { useAllGameSettings } from '@/lib/storage'
import Game from '@/manager/Game'

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
