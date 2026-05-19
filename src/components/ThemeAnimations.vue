<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import StarfieldAnimation from './StarfieldAnimation.vue'
import ButterfliesAnimation from './ButterfliesAnimation.vue'

const themeStore = useThemeStore()
</script>

<template>
  <StarfieldAnimation v-if="themeStore.theme === 'blue'" />
  <ButterfliesAnimation v-if="themeStore.theme === 'pink'" />
</template>
