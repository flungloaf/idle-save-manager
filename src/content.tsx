import React from 'react'
import ReactDOM from 'react-dom/client'
import DetectCopies from './DetectCopies'

const root = document.createElement('div')
root.id = 'crx-root'
document.body.appendChild(root)

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <DetectCopies />
  </React.StrictMode>,
)
