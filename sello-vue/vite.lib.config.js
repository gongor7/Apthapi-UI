import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// build de librería para publicar en npm como apthapi-ui-vue
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.js'),
      name: 'ApthapiUI',
      fileName: () => 'apthapi-ui-vue.esm.js',
      formats: ['es'],
    },
    outDir: '../packages/apthapi-ui-vue',
    emptyOutDir: false,
    rollupOptions: {
      external: ['vue'],
      output: {
        assetFileNames: (info) => (info.names?.[0]?.endsWith('.css') ? 'apthapi-ui-vue.css' : info.names[0]),
      },
    },
  },
})
