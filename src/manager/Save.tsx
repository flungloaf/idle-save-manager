import { format } from 'date-fns'
import {
  Clipboard,
  Copy,
  Edit,
  Eye,
  EyeOff,
  Save as SaveIcon,
  Trash,
  X,
} from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Save as SaveType } from '@/lib/types'
import { useTimeAgo } from '@/lib/utils'
import ConfirmDialog from '@/manager/ConfirmDialog'

interface Props {
  save: SaveType
  updateSave: (save: SaveType) => void
  onDelete: (save: SaveType) => void
}

const Save: React.FC<Props> = ({ save, updateSave, onDelete }) => {
  const [name, setName] = useState(save.name)
  const [editing, setEditing] = useState(false)
  const [showData, setShowData] = useState(false)
  const toggleShowData = () => {
    setShowData((prev) => !prev)
  }
  const onSave = () => {
    setEditing(false)
    updateSave({ ...save, name })
  }
  const onStartEditName = () => {
    setEditing(true)
  }
  const onCancelEditing = () => {
    setEditing(false)
    setName(save.name)
  }
  const onCopy = () => {
    navigator.clipboard.writeText(save.data)
    toast('Copied to clipboard', {
      icon: <Clipboard />,
    })
  }
  const timeAgo = useTimeAgo(save.timestamp)
  return (
    <div
      data-testid="save"
      className="py-2 px-3 first:border-t not-last:border-b"
    >
      <div className="flex items-center justify-between">
        {editing ? (
          <div className="flex items-center">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-7 text-sm"
              autoFocus
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={onSave}
              className="ml-2 h-7 w-7 p-0"
              title="Save name"
            >
              <SaveIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancelEditing}
              className="h-7 w-7 p-0"
              title="Cancel"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center">
            <h3 className="font-medium text-sm">{save.name}</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-muted-foreground ml-2">
                  {timeAgo}
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span className="text-xs text-accent">
                  {format(save.timestamp, 'EEE, dd MMM yyyy HH:mm:ss')}
                </span>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onCopy}
            className="h-6 px-2 py-0 text-xs flex items-center gap-1"
            title="Copy to clipboard"
          >
            <Copy className="h-3 w-3" />
            Copy
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onStartEditName}
            className="h-6 w-6 p-0"
            title="Rename save"
          >
            <Edit className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleShowData}
            className="h-6 w-6 p-0"
            title={showData ? 'Hide data' : 'Show data'}
          >
            {showData ? (
              <EyeOff className="h-3 w-3" />
            ) : (
              <Eye className="h-3 w-3" />
            )}
          </Button>

          <ConfirmDialog
            title="Delete save"
            description={`Are you sure you want to delete the save "${save.name}"? This action cannot be undone.`}
            onConfirm={() => onDelete(save)}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                title="Remove save"
              >
                <Trash className="h-3 w-3" />
              </Button>
            }
          />
        </div>
      </div>

      {showData && (
        <div className="mt-1 bg-muted/30 rounded p-1.5">
          <code className="text-xs whitespace-pre-wrap break-all block">
            {save.data}
          </code>
        </div>
      )}
    </div>
  )
}

export default Save
