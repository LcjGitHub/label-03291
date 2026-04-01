import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器 - 自动附加 Token（过期则不再携带，由响应 401 处理）
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    const expiresAt = Number(localStorage.getItem('tokenExpiresAt')) || 0
    if (token && expiresAt && Date.now() < expiresAt) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器 - 统一错误处理
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiresAt')
      localStorage.removeItem('userInfo')
      window.location.href = '/login'
      ElMessage.error('登录已过期，请重新登录')
    } else {
      ElMessage.error(error.response?.data?.message || '请求失败，请稍后重试')
    }
    return Promise.reject(error)
  }
)

export default request
