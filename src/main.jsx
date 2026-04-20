import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { migrateLegacyKeys } from '@/lib/storageKeys'

// 구버전 localStorage 키 1회 이관 — 사용자 설정(테마/언어/세션)을 잃지 않음
migrateLegacyKeys()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
