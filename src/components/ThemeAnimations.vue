<script setup lang="ts">
import ButterfliesAnimation from '@/components/ButterfliesAnimation.vue'
import StarfieldAnimation from '@/components/StarfieldAnimation.vue'

import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <StarfieldAnimation v-if="themeStore.theme === 'blue'" />
  <ButterfliesAnimation v-if="themeStore.theme === 'pink'" />
</template>
