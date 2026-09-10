import { onMounted, onUnmounted, watch } from 'vue'

import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useSpoilerStore = defineStore('spoiler', () => {
  const spoilerMode = useStorage('pinia/spoilerMode', false)

  function applySpoilerData(attrVal: boolean) {
    document.documentElement.dataset.spoiler = attrVal ? 'true' : 'false'
  }

  onMounted(() => applySpoilerData(spoilerMode.value))
  watch(spoilerMode, applySpoilerData)
  onUnmounted(() => delete document.documentElement.dataset.spoiler)

  function toggle() {
    spoilerMode.value = !spoilerMode.value
  }

  return { spoilerMode, toggle }
})
