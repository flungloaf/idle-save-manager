import { useEffect, useState } from 'react'
import './index.css'
import { useGameSettings } from './storage'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { DataType } from '@/storage/types'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Settings, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

function App() {
  const [url, setUrl] = useState<string>()
  const [title, setTitle] = useState<string>()
  const [favicon, setFavicon] = useState<string>()
  useEffect(() => {
    const loadUrl = async () => {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })
      setUrl(tabs[0].url)
      setTitle(tabs[0].title)
      setFavicon(tabs[0].favIconUrl)
    }
    loadUrl()
  }, [])
  const [settings, setSettings] = useGameSettings(url)

  const toggleSave = async () => {
    if (settings) {
      setSettings((prev) => {
        const newSettings = {
          ...prev,
          enabled: !prev.enabled,
        }
        if (!prev.name && title) {
          newSettings.name = title
        }
        if (!prev.url && url) {
          newSettings.url = url
        }
        if (!prev.favicon && favicon) {
          newSettings.favicon = favicon
        }
        return newSettings
      })
      return
    }

    setSettings({
      enabled: false,
      dataType: 'any',
      name: title || '',
      url: url || '',
      favicon: favicon || '',
      saves: [],
    })
  }

  return (
    <div className="w-[300px] p-4 flex flex-col gap-4 bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Idle save manager</h1>
        <div className="flex items-center gap-2">
          <Switch
            id="toggle"
            checked={settings.enabled}
            onCheckedChange={toggleSave}
          />
          <Label htmlFor="toggle" className="text-sm">
            {settings.enabled ? 'On' : 'Off'}
          </Label>
        </div>
      </div>
      <p className="text-xs text-muted-foreground -mt-1">
        {settings.enabled ? 'Active' : 'Inactive'} on current page
      </p>
      <div className="border-t border-border pt-2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="settings">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="py-2">
                <Label className="text-sm font-medium mb-2 block">
                  What kind of clipboard data do you want to save?
                </Label>
                <RadioGroup
                  value={settings.dataType}
                  onValueChange={(value) =>
                    setSettings({ ...settings, dataType: value as DataType })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id="any" />
                    <Label htmlFor="any">Any</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="json" id="json" />
                    <Label htmlFor="json">JSON</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="base64" id="base64" />
                    <Label htmlFor="base64">Base64</Label>
                  </div>
                </RadioGroup>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <Button
        variant="outline"
        className="w-full flex items-center gap-2"
        onClick={() =>
          chrome.tabs.create({
            url: chrome.runtime.getURL('manager.html'),
          })
        }
      >
        <ExternalLink className="h-4 w-4" />
        Open Full Screen View
      </Button>
    </div>
  )
}

export default App
