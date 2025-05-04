/// <reference types="vitest/config" />
import path from 'path'

import { crx } from '@crxjs/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import manifest from './manifest.json'

export default defineConfig({
  plugins: [react(), crx({ manifest, browser: 'firefox' }), tailwindcss()],
  legacy: {
    skipWebSocketTokenCheck: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        manager: 'src/manager/manager.html',
        popup: 'src/popup/popup.html',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    coverage: {
      exclude: [
        '**/__mocks__/**',
        'dist',
        'eslint.config.js',
        'vite.config.ts',
      ],
    },
  },
})
