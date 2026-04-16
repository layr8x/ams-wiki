/**
 * AMS Wiki API Client
 * Base: /api/v1/wiki
 * Auth: Bearer token (JWT) in Authorization header
 */
import axios from 'axios'

const client = axios.create({
  baseURL: '/api/v1/wiki',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// 요청 인터셉터: JWT 자동 첨부
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('ams_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 응답 인터셉터: 401 → 로그인 리다이렉트
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default client
