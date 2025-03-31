import { Button } from '@/components/ui/button'
import { CardHeader } from '@/components/ui/card'
import { CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import ConfirmDialog from '@/manager/ConfirmDialog'
import { GameSettings } from '@/storage/types'
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
            <Button variant="ghost" size="sm" className="p-1 h-7 w-7">
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
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onCancelEditingName}
                className="h-7 w-7 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center">
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

          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>

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
            className="h-7 text-xs w-fit"
            autoFocus
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={onSaveUrl}
            className="ml-2 h-7 w-7 p-0"
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancelEditingUrl}
            className="h-7 w-7 p-0"
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
