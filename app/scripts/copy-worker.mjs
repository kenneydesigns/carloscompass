import { copyFile, mkdir } from 'node:fs/promises'

await mkdir('public/maplibre', { recursive: true })
await copyFile('node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs', 'public/maplibre/maplibre-gl-worker.mjs')
