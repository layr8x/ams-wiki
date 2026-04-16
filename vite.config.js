import { defineConfig } from 'vite'
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
    alias: { '@': '/src' },
  },
  server: {
    proxy: {
      // Confluence 이미지 인증 프록시
      '/confluence-img': {
        target: 'https://hiconsy.atlassian.net',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/confluence-img/, ''),
        headers: getAuthHeaders(),
      },
    },
  },
})
