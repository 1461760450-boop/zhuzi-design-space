import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => ({
  // The production Site is hosted at the domain root.
  base: '/',
  plugins: [react()],
}))
