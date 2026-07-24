import { build } from 'vite'
import { copyFile, mkdir, unlink } from 'node:fs/promises'

await build()
await unlink('dist/assets/videos/zhuzi-imagination.mov').catch(() => {})
await mkdir('dist/server', { recursive: true })
await copyFile('worker/index.js', 'dist/server/index.js')
