import { watch, onMounted, onUnmounted } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

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
