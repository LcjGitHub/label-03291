<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Odometer, UserFilled } from '@element-plus/icons-vue'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()

const menuItems = [
  { path: '/dashboard', title: '仪表盘', icon: Odometer },
  { path: '/customer', title: '客户管理', icon: UserFilled }
]

const activeMenu = computed(() => route.path)

function navigate(path) {
  router.push(path)
}
</script>

<template>
  <div class="sidebar" :class="{ 'sidebar--collapsed': collapsed }">
    <div class="sidebar__logo">
      <div class="logo-icon">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="10" fill="#409EFF"/>
          <path d="M20 8C13.373 8 8 13.373 8 20s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8zm0 4a4 4 0 110 8 4 4 0 010-8zm0 17.2a8.64 8.64 0 01-7.2-3.84c.036-2.388 4.8-3.696 7.2-3.696 2.388 0 7.164 1.308 7.2 3.696A8.64 8.64 0 0120 29.2z" fill="white"/>
        </svg>
      </div>
      <transition name="fade">
        <span v-if="!collapsed" class="logo-title">客户管理系统</span>
      </transition>
    </div>

    <nav class="sidebar__nav">
      <div
        v-for="item in menuItems"
        :key="item.path"
        class="nav-item"
        :class="{ 'nav-item--active': activeMenu === item.path }"
        @click="navigate(item.path)"
      >
        <el-icon class="nav-item__icon"><component :is="item.icon" /></el-icon>
        <transition name="fade">
          <span v-if="!collapsed" class="nav-item__text">{{ item.title }}</span>
        </transition>
        <div v-if="activeMenu === item.path" class="nav-item__indicator" />
      </div>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  width: $sidebar-width;
  height: 100%;
  background: $bg-sidebar;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
  flex-shrink: 0;

  &--collapsed {
    width: $sidebar-collapsed-width;

    .sidebar__logo {
      justify-content: center;
      padding: 0;
    }

    .nav-item {
      justify-content: center;
      padding-left: 0;
      padding-right: 0;
    }

    .nav-item__icon {
      margin: 0;
    }
  }

  &__logo {
    height: $header-height;
    display: flex;
    align-items: center;
    padding: 0 $spacing-md;
    gap: $spacing-sm;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    flex-shrink: 0;

    .logo-icon {
      width: 36px;
      height: 36px;
      flex-shrink: 0;

      svg { width: 100%; height: 100%; }
    }

    .logo-title {
      font-size: $font-size-md;
      font-weight: 700;
      color: #fff;
      white-space: nowrap;
      letter-spacing: 0.5px;
    }
  }

  &__nav {
    flex: 1;
    padding: $spacing-md $spacing-sm;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: 12px $spacing-sm;
  border-radius: $border-radius-sm;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.65);
  transition: all 0.2s ease;
  white-space: nowrap;
  user-select: none;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }

    &--active {
    background: $primary-color;
    color: #fff;

    &:hover { background: #2d8cf0; }
  }

  &__icon {
    font-size: 18px;
    flex-shrink: 0;
    width: 20px;
    display: flex;
    justify-content: center;
  }

  &__text {
    font-size: $font-size-base;
    font-weight: 500;
  }

  &__indicator {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 20px;
    background: #fff;
    border-radius: 2px 0 0 2px;
  }
}
</style>
