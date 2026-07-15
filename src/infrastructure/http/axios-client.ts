// src/infrastructure/http/axios-client.ts
import axios from 'axios'
import { API_CONFIG } from '../config/api.config'
import { localTokenStorage } from '../storage/local-token-storage'

export const axiosClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
})

// Interceptor de request: agrega el JWT a cada llamada
axiosClient.interceptors.request.use((config) => {
  const token = localTokenStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de response: si el access token expiró (401), intenta refrescarlo una vez
let isRefreshing = false

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localTokenStorage.getRefreshToken()
      if (!refreshToken) {
        localTokenStorage.clear()
        isRefreshing = false
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        })
        localTokenStorage.setTokens(data.access, refreshToken)
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        isRefreshing = false
        return axiosClient(originalRequest)
      } catch (refreshError) {
        localTokenStorage.clear()
        isRefreshing = false
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
