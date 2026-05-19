<script setup lang="ts">
import { RouterView } from 'vue-router'
import ThemeAnimations from '@/components/ThemeAnimations.vue'
import AppNav from '@/components/AppNav.vue'
</script>

<template>
  <ThemeAnimations />

  <div class="app-content">
    <header>
      <div>
        <AppNav />
      </div>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.app-content {
  position: relative;
  z-index: 1;
}
</style>
