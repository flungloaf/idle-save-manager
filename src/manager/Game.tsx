import { Card, CardContent } from '@/components/ui/card'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import GameHeader from '@/manager/GameHeader'
import Save from '@/manager/Save'
import { GameSettings } from '@/storage/types'
import { SaveIcon, Trash } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

interface Props {
  settings: GameSettings
  setSettings: (newValue: GameSettings) => void
}

const Game: React.FC<Props> = ({ settings, setSettings }) => {
  const [open, setOpen] = useState(false)
  const updateSave = useCallback(
    (index: number, newSave: GameSettings['saves'][number]) => {
      const updatedSaves = [...settings.saves]
      updatedSaves[index] = newSave
      setSettings({ ...settings, saves: updatedSaves })
      toast('Save updated', { icon: <SaveIcon /> })
    },
    [settings, setSettings],
  )
  const deleteSave = useCallback(
    (index: number) => {
      const updatedSaves = settings.saves.filter((_, i) => i !== index)
      setSettings({ ...settings, saves: updatedSaves })
      toast('Save deleted', { icon: <Trash /> })
    },
    [settings, setSettings],
  )

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="gap-0 pb-0">
        <GameHeader settings={settings} setSettings={setSettings} open={open} />
        <CollapsibleContent>
          <CardContent className="p-0 py-0">
            {settings.saves.map((save, index) => (
              <Save
                key={index}
                save={save}
                updateSave={(s) => updateSave(index, s)}
                onDelete={() => deleteSave(index)}
              />
            ))}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

export default Game
