<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { User, Lock, View, Hide, Check } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const formRef = ref(null)
const loading = ref(false)
const showPassword = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 2, max: 20, message: '账号长度 2-20 位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度 6-20 位', trigger: 'blur' }
  ]
}

async function handleLogin() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const success = await authStore.login(form.username, form.password)
      if (success) {
        const redirect = route.query.redirect || '/'
        router.push(redirect)
      }
    } finally {
      loading.value = false
    }
  })
}

</script>

<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="bg-circle bg-circle--1" />
      <div class="bg-circle bg-circle--2" />
      <div class="bg-circle bg-circle--3" />
    </div>

    <div class="login-container">
      <!-- 左侧展示区 -->
      <div class="login-banner">
        <div class="banner-content">
          <div class="banner-logo">
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="60" height="60" rx="16" fill="rgba(255,255,255,0.2)"/>
              <path d="M30 12C19.507 12 11 20.507 11 31s8.507 19 19 19 19-8.507 19-19S40.493 12 30 12zm0 6a6 6 0 110 12 6 6 0 010-12zm0 25.8a12.96 12.96 0 01-10.8-5.76c.054-3.582 7.2-5.544 10.8-5.544 3.582 0 10.746 1.962 10.8 5.544A12.96 12.96 0 0130 43.8z" fill="white"/>
            </svg>
          </div>
          <h1 class="banner-title">客户管理系统</h1>
          <p class="banner-subtitle">Customer Management System</p>
          <div class="banner-features">
            <div class="feature-item">
              <el-icon><Check /></el-icon>
              <span>完整的客户信息管理</span>
            </div>
            <div class="feature-item">
              <el-icon><Check /></el-icon>
              <span>高效的增删改查操作</span>
            </div>
            <div class="feature-item">
              <el-icon><Check /></el-icon>
              <span>数据可视化仪表盘</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-form-wrap">
        <div class="login-card">
          <div class="login-card__header">
            <h2 class="login-title">欢迎登录</h2>
            <p class="login-desc">请输入您的账号和密码</p>
          </div>

          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            size="large"
            class="login-form"
            @keyup.enter="handleLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model="form.username"
                placeholder="请输入账号"
                :prefix-icon="User"
                clearable
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                :prefix-icon="Lock"
              >
                <template #suffix>
                  <el-icon
                    class="password-toggle"
                    @click="showPassword = !showPassword"
                  >
                    <View v-if="showPassword" />
                    <Hide v-else />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                class="login-btn"
                :loading="loading"
                @click="handleLogin"
              >
                {{ loading ? '登录中...' : '立即登录' }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a237e 0%, #283593 30%, #1565c0 60%, #0288d1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  background: white;

  &--1 {
    width: 600px;
    height: 600px;
    top: -200px;
    right: -100px;
  }
  &--2 {
    width: 400px;
    height: 400px;
    bottom: -150px;
    left: -100px;
  }
  &--3 {
    width: 200px;
    height: 200px;
    top: 40%;
    left: 30%;
  }
}

.login-container {
  display: flex;
  width: 960px;
  max-width: calc(100vw - 40px);
  min-height: 560px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
  position: relative;
  z-index: 1;
}

// 左侧 Banner
.login-banner {
  flex: 1;
  background: linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;

  @media (max-width: 680px) { display: none; }
}

.banner-content {
  text-align: center;
  color: white;
}

.banner-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto $spacing-lg;

  svg { width: 100%; height: 100%; }
}

.banner-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: $spacing-sm;
  letter-spacing: 1px;
}

.banner-subtitle {
  font-size: $font-size-base;
  opacity: 0.7;
  margin-bottom: $spacing-xl;
}

.banner-features {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  text-align: left;
  display: inline-flex;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-base;
  opacity: 0.9;

  .el-icon {
    color: #4fc3f7;
    font-size: 16px;
  }
}

// 右侧表单
.login-form-wrap {
  width: 420px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;

  @media (max-width: 680px) { width: 100%; }
}

.login-card {
  width: 100%;

  &__header {
    text-align: center;
    margin-bottom: $spacing-xl;
  }
}

.login-title {
  font-size: $font-size-xxl;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.login-desc {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.login-form {
  :deep(.el-input__wrapper) {
    border-radius: $border-radius;
    box-shadow: 0 0 0 1px $border-color;
    transition: box-shadow 0.2s;

    &:hover { box-shadow: 0 0 0 1px $primary-color; }
  }

  :deep(.el-form-item) { margin-bottom: $spacing-md; }
}

.login-btn {
  width: 100%;
  height: 46px;
  font-size: $font-size-md;
  border-radius: $border-radius;
  letter-spacing: 2px;
  background: linear-gradient(90deg, #409EFF, #0d84f5);
  border: none;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
  }
}

.password-toggle {
  cursor: pointer;
  color: $text-secondary;
  &:hover { color: $primary-color; }
}
</style>
