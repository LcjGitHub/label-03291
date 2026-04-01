<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TheSidebar from './TheSidebar.vue'
import TheHeader from './TheHeader.vue'

const SIDEBAR_BREAKPOINT = 992
const sidebarCollapsed = ref(false)

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

function checkViewport() {
  sidebarCollapsed.value = window.innerWidth < SIDEBAR_BREAKPOINT
}

onMounted(() => {
  checkViewport()
  window.addEventListener('resize', checkViewport)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkViewport)
})
</script>

<template>
  <div class="layout">
    <TheSidebar :collapsed="sidebarCollapsed" />

    <div class="layout__main">
      <TheHeader :collapsed="sidebarCollapsed" @toggle-sidebar="toggleSidebar" />

      <main class="layout__content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  overflow-x: hidden;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
    overflow-x: hidden;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: $spacing-lg;
    background: $bg-page;
  }
}
</style>
