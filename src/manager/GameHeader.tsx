import {
  ChevronDown,
  ChevronUp,
  Edit,
  ExternalLink,
  Link,
  Save,
  Settings,
  Trash,
  X,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { CardHeader } from '@/components/ui/card'
import { CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { DataType, GameSettings } from '@/lib/types'
import ConfirmDialog from '@/manager/ConfirmDialog'

interface Props {
  settings: GameSettings
  setSettings: (settings: GameSettings) => void
  open: boolean
  onDelete: () => void
}

const GameHeader: React.FC<Props> = ({
  settings,
  setSettings,
  open,
  onDelete,
}) => {
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(settings.name)
  const onSaveName = () => {
    setEditingName(false)
    setSettings({ ...settings, name })
  }
  const onCancelEditingName = () => {
    setEditingName(false)
    setName(settings.name)
  }
  const [editingUrl, setEditingUrl] = useState(false)
  const [url, setUrl] = useState(settings.url)
  const onSaveUrl = () => {
    setEditingUrl(false)
    setSettings({ ...settings, url })
  }
  const onCancelEditingUrl = () => {
    setEditingUrl(false)
    setUrl(settings.url)
  }
  useEffect(() => {
    setName(settings.name)
    setUrl(settings.url)
  }, [settings.name, settings.url])
  return (
    <CardHeader className="pb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button
              data-testid="toggle-saves"
              variant="ghost"
              size="sm"
              className="p-1 h-7 w-7"
            >
              {open ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          {editingName ? (
            <div className="flex items-center">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-7 text-base font-medium"
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={onSaveName}
                className="ml-2 h-7 w-7 p-0"
                title="Save name"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onCancelEditingName}
                className="h-7 w-7 p-0"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center">
              {settings.showFavicon && settings.favicon && (
                <img src={settings.favicon} className="w-10 h-10 p-2" />
              )}
              <div className="font-medium text-base">{settings.name}</div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1"
                onClick={() => setEditingName(true)}
                title="Edit title"
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Switch
              id="toggle"
              checked={settings.enabled}
              onCheckedChange={(enabled) =>
                setSettings({ ...settings, enabled })
              }
              className="mr-1.5"
            />
            <Label htmlFor="toggle" className="text-xs">
              {settings.enabled ? 'On' : 'Off'}
            </Label>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                What kind of clipboard data do you want to save?
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={settings.dataType}
                onValueChange={(v) =>
                  setSettings({ ...settings, dataType: v as DataType })
                }
              >
                <DropdownMenuRadioItem value="any">Any</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="json">JSON</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="base64">
                  Base64
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <div className="flex items-center px-3 py-2 gap-2">
                <Switch
                  id="show-favicon"
                  checked={settings.showFavicon}
                  onCheckedChange={(show) =>
                    setSettings({ ...settings, showFavicon: show })
                  }
                />
                <Label htmlFor="show-favicon">Show favicon</Label>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <ConfirmDialog
            title="Delete game"
            description={`Are you sure you want to delete "${settings.name}"?`}
            onConfirm={onDelete}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                title="Remove game"
              >
                <Trash className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>

      {editingUrl ? (
        <div className="flex items-center ml-9">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-7 text-xs w-[400px]"
            autoFocus
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={onSaveUrl}
            className="ml-2 h-7 w-7 p-0"
            title="Save URL"
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancelEditingUrl}
            className="h-7 w-7 p-0"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center ml-9 text-xs text-muted-foreground">
          <Link className="h-3 w-3 mr-1.5" />
          <span>{url}</span>
          <div className="flex items-center ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setEditingUrl(true)}
              title="Edit URL"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 cursor-pointer"
              onClick={() => window.open(settings.url)}
              title="Open URL"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </CardHeader>
  )
}

export default GameHeader
