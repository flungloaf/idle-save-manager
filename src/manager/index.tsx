import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Manager } from '@/manager/Manager'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
      <Manager />
      <Toaster />
    </TooltipProvider>
  </StrictMode>,
)
