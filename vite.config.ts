import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/my-kanban/', // 👈 Isso aqui é ESSENCIAL para funcionar no GitHub Pages

  plugins: [
    tailwindcss(),
  ],
})
