// Node cannot import images or CSS; the blocks do. Each resolves to its path so a block renders outside Vite.
import { register } from 'node:module'
register('./asset-hooks.mjs', import.meta.url)
