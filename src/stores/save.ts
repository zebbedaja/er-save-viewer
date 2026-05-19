import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { parse, type Save } from '@zebbedaja/er-save-parser'

export const useSaveStore = defineStore('save', () => {
  const save = ref<Save | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const activeSlotId = ref<number | null>(null)

  const profileSummaries = computed(() => save.value?.profileSummaries)
  const activeSlot = computed(() =>
    activeSlotId.value !== null ? (save.value?.slots?.[activeSlotId.value] ?? null) : null,
  )

  async function readFile(file: File) {
    isLoading.value = true
    error.value = null

    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        save.value = parse(reader.result as ArrayBuffer)
        isLoading.value = false
        resolve()
      }

      reader.onerror = () => {
        error.value = 'Error while reading file'
        isLoading.value = false
        reject(reader.error)
      }

      reader.readAsArrayBuffer(file)
    })
  }

  function setActiveSlotId(slot: number | null) {
    if (slot !== null && (!save.value || slot < 0 || slot >= (save.value.slots?.length ?? 0))) {
      throw new Error(`Invalid slot index: ${slot}`)
    }
    activeSlotId.value = slot
  }

  function resetActiveSlot() {
    activeSlotId.value = null
  }

  function resetSaveFile() {
    save.value = null
    activeSlotId.value = null
    error.value = null
  }

  return {
    save,
    activeSlotId,
    activeSlot,
    profileSummaries,
    isLoading,
    error,
    readFile,
    resetSaveFile,
    resetActiveSlot,
    setActiveSlotId,
  }
})
