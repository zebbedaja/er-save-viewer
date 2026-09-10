<script setup lang="ts">
import { RouterView } from 'vue-router'

import { storeToRefs } from 'pinia'

import AppNav from '@/components/AppNav.vue'
import SideBar from '@/components/SideBar.vue'
import ThemeAnimations from '@/components/ThemeAnimations.vue'

import { useSidebarStore } from '@/stores/sidebar'

const { isSidebarOpen } = storeToRefs(useSidebarStore())
</script>

<template>
  <ThemeAnimations />
  <AppNav />

  <div class="app-content" :class="{ 'sidebar-open': isSidebarOpen }">
    <SideBar />
    <RouterView />
  </div>
</template>

<style scoped>
.app-content {
  position: relative;
  z-index: 1;
  padding-top: 3.5rem;
  position: relative;
}
</style>
