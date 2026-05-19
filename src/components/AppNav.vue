<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useThemeStore, type Theme } from '@/stores/theme'

const themeStore = useThemeStore()

const themeLabels: Record<Theme, string> = {
  dark: 'Dark',
  pink: 'Pink',
  blue: 'Blue',
}
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <span style="margin: 0 0.5rem">Theme:</span>
    <button
      v-for="t in themeStore.themes"
      :key="t"
      class="button"
      :class="{ active: themeStore.theme === t }"
      @click="themeStore.set(t)"
    >
      {{ themeLabels[t] }}
    </button>
  </nav>
</template>

<style scoped>
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

button.active {
  border-color: var(--highlight-color);
  color: var(--highlight-color);
}
</style>
