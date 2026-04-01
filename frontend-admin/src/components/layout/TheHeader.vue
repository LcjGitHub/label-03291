<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Fold, Expand, ArrowDown, SwitchButton, User } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-sidebar'])

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

async function handleLogout() {
  await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定退出',
    cancelButtonText: '取消',
    type: 'warning'
  })
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="header">
    <div class="header__left">
      <el-button
        class="collapse-btn"
        text
        @click="emit('toggle-sidebar')"
      >
        <el-icon size="20">
          <Fold v-if="!collapsed" />
          <Expand v-else />
        </el-icon>
      </el-button>

      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="header__right">
      <el-dropdown trigger="click">
        <div class="user-info">
          <el-avatar
            :size="34"
            :src="authStore.userAvatar"
            class="user-avatar"
          />
          <span class="user-name">{{ authStore.userName }}</span>
          <el-icon size="12" color="#909399"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            
            <el-dropdown-item divided :icon="SwitchButton" @click="handleLogout">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  height: $header-height;
  background: $bg-card;
  border-bottom: 1px solid $border-color;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-lg;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  flex-shrink: 0;
  z-index: 10;

  &__left {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }
}

.collapse-btn {
  padding: 6px;
  color: $text-regular;
  border-radius: $border-radius-sm;
  transition: all 0.2s;

  &:hover {
    background: #f0f2f5;
    color: $primary-color;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: $border-radius;
  transition: background 0.2s;

  &:hover { background: #f5f7fa; }
}

.user-avatar {
  border: 2px solid #e6e8eb;
}

.user-name {
  font-size: $font-size-base;
  color: $text-primary;
  font-weight: 500;
}
</style>
