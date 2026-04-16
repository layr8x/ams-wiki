import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': '/src' },
  },
  server: {
    proxy: {
      // Confluence 이미지 인증 프록시
      '/confluence-img': {
        target: 'https://hiconsy.atlassian.net',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/confluence-img/, ''),
        headers: {
          Authorization: 'Basic ' + Buffer.from(
            `${process.env.VITE_CONFLUENCE_EMAIL}:${process.env.VITE_CONFLUENCE_TOKEN}`
          ).toString('base64'),
        },
      },
    },
  },
})
