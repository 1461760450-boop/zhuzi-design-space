import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => ({
  // The production Site is hosted at the domain root.
  // Portfolio assets refreshed on 2026-11-03.
  base: '/',
  plugins: [react()],
}))
