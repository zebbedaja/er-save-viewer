import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useTrackChangesStore = defineStore('trackChanges', () => {
  const trackChangesMode = useStorage('pinia/trackChangesMode', false)

  function toggle() {
    trackChangesMode.value = !trackChangesMode.value
  }

  return { trackChangesMode, toggle }
})
