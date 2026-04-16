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
            'mjk@hiconsy.com:ATATT3xFfGF0EhklEdJKr1BGdXuyUHpxEMWOSzAmOdlFtZonH6iHfQohdMv6noOq6WD4u5NDyK6i3_BrQvrPMhEyJrPz_7sQ7Wnn0uT-6nqai-neItRqic0wVROyL70GNM722zXy_i6d1CPJRSY7py-mIoW-qhL2sDUasjwu7DLbxYPZsGqlH_8=391EA860'
          ).toString('base64'),
        },
      },
    },
  },
})
