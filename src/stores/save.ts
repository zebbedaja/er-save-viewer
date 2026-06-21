import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { parse, type Save } from '@zebbedaja/er-save-parser'
import i18n from '@/i18n'

const pollIntervalMs = 1000

export const useSaveStore = defineStore('save', () => {
  const save = ref<Save | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const activeSlotId = ref<number | null>(null)
  const fileHandle = ref<FileSystemFileHandle | null>(null)
  const lastModified = ref<number>(0)
  const pollInterval = ref<ReturnType<typeof setInterval> | null>(null)

  const isLiveSyncActive = computed(() => pollInterval.value !== null)

  const profileSummaries = computed(() => save.value?.profileSummaries)
  const activeSlot = computed(() =>
    activeSlotId.value !== null ? (save.value?.slots?.[activeSlotId.value] ?? null) : null,
  )
  const defeatedFlags = computed(() => {
    const slot = activeSlot.value
    if (!slot?.eventFlags) return new Set<number>()
    return new Set(slot.eventFlags.filter((f) => f.state).map((f) => f.id))
  })

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
        error.value = i18n.global.t('errorReadingFile')
        isLoading.value = false
        reject(reader.error)
      }

      reader.readAsArrayBuffer(file)
    })
  }

  async function parseFileBuffer(buffer: ArrayBuffer) {
    return parse(buffer, { logLevel: 'debug', includeEventFlagUInt8Array: true })
  }

  async function connectFile(handle: FileSystemFileHandle) {
    fileHandle.value = handle
    error.value = null
    isLoading.value = true

    try {
      const file = await handle.getFile()
      lastModified.value = file.lastModified

      const buffer = await file.arrayBuffer()
      save.value = await parseFileBuffer(buffer)
      setActiveSlotId(0)

      pollInterval.value = setInterval(async () => {
        try {
          const currentHandle = fileHandle.value
          if (!currentHandle) return

          const updatedFile = await currentHandle.getFile()

          if (updatedFile.lastModified !== lastModified.value) {
            lastModified.value = updatedFile.lastModified

            const buffer = await updatedFile.arrayBuffer()
            save.value = await parseFileBuffer(buffer)
          }
        } catch {
          // File may be in use by the game, skip this tick
        }
      }, pollIntervalMs)
    } catch (e) {
      error.value = i18n.global.t('errorReadingFile')
      disconnectFile()
    } finally {
      isLoading.value = false
    }
  }

  function disconnectFile() {
    if (pollInterval.value) {
      clearInterval(pollInterval.value)
      pollInterval.value = null
    }
    fileHandle.value = null
    lastModified.value = 0
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
    disconnectFile()
    save.value = null
    activeSlotId.value = null
    error.value = null
  }

  return {
    save,
    activeSlotId,
    activeSlot,
    defeatedFlags,
    profileSummaries,
    isLoading,
    error,
    isLiveSyncActive,
    lastModified,
    readFile,
    connectFile,
    disconnectFile,
    resetSaveFile,
    resetActiveSlot,
    setActiveSlotId,
  }
})
