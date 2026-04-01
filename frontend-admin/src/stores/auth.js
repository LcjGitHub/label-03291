import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockLogin, isTokenExpired } from '@/api/mock'
import { hashPassword } from '@/utils/crypto'
import { ElMessage } from 'element-plus'

const TOKEN_KEY = 'token'
const USER_INFO_KEY = 'userInfo'
const EXPIRES_AT_KEY = 'tokenExpiresAt'

function loadStoredAuth() {
  const t = localStorage.getItem(TOKEN_KEY) || ''
  const exp = Number(localStorage.getItem(EXPIRES_AT_KEY)) || 0
  if (t && isTokenExpired(exp)) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_INFO_KEY)
    localStorage.removeItem(EXPIRES_AT_KEY)
    return { token: '', userInfo: null, expiresAt: 0 }
  }
  return {
    token: t,
    userInfo: JSON.parse(localStorage.getItem(USER_INFO_KEY) || 'null'),
    expiresAt: exp
  }
}

const initial = loadStoredAuth()
export const useAuthStore = defineStore('auth', () => {
  const token = ref(initial.token)
  const userInfo = ref(initial.userInfo)
  const expiresAt = ref(initial.expiresAt)

  const isLoggedIn = computed(() => {
    if (!token.value) return false
    if (isTokenExpired(expiresAt.value)) return false
    return true
  })
  const userName = computed(() => userInfo.value?.name || '')
  const userAvatar = computed(() => userInfo.value?.avatar || '')
  const userRole = computed(() => userInfo.value?.role || '')

  async function login(username, password) {
    const passwordHash = await hashPassword(password)
    const res = await mockLogin(username, passwordHash)
    if (res.code === 200) {
      token.value = res.data.token
      userInfo.value = res.data.userInfo
      expiresAt.value = res.data.expiresAt || Date.now() + 24 * 60 * 60 * 1000
      localStorage.setItem(TOKEN_KEY, token.value)
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo.value))
      localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt.value))
      ElMessage.success('登录成功，欢迎回来！')
      return true
    } else {
      ElMessage.error(res.message)
      return false
    }
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    expiresAt.value = 0
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_INFO_KEY)
    localStorage.removeItem(EXPIRES_AT_KEY)
  }

  return { token, userInfo, isLoggedIn, userName, userAvatar, userRole, login, logout }
})
