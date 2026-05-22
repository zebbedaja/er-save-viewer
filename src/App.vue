<script setup lang="ts">
import { RouterView } from 'vue-router'
import ThemeAnimations from '@/components/ThemeAnimations.vue'
import AppNav from '@/components/AppNav.vue'
</script>

<template>
  <ThemeAnimations />

  <AppNav />

  <div class="app-content">
    <RouterView />
  </div>
</template>

<style scoped>
.app-content {
  position: relative;
  z-index: 1;
  padding-top: 3.5rem;
}
</style>
