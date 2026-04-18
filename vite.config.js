import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const getAuthHeaders = () => {
  // eslint-disable-next-line no-undef
  const email = process.env.VITE_CONFLUENCE_EMAIL
  // eslint-disable-next-line no-undef
  const token = process.env.VITE_CONFLUENCE_TOKEN

  if (!email || !token) {
    return {}
  }

  // eslint-disable-next-line no-undef
  const auth = Buffer.from(`${email}:${token}`).toString('base64')
  return { Authorization: `Basic ${auth}` }
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    minify: 'esbuild',
    sourcemap: false,
  },
  server: {
    proxy: {
      // Vercel serverless function과 동일 경로 구조로 통일 (prod에서도 동작)
      '/api/confluence-img': {
        target: 'https://hiconsy.atlassian.net',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/confluence-img/, ''),
        headers: getAuthHeaders(),
      },
      // 구 경로 호환 (2026-04-18 이전 빌드가 혹시 참조하는 경우 대비)
      '/confluence-img': {
        target: 'https://hiconsy.atlassian.net',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/confluence-img/, ''),
        headers: getAuthHeaders(),
      },
    },
  },
  test: {
    globals: true,
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', 'e2e', 'playwright.config.js'],
  },
})
