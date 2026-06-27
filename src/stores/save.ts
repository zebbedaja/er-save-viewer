import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { parse, compareUint8Arrays, type Save, getEventIdFromPosition, getBstMap } from '@zebbedaja/er-save-parser'
import i18n from '@/i18n'
import { useTrackChangesStore } from './trackChanges'
import type { HistoryEntry } from '@/model/types'

const pollIntervalMs = 1000
const MAX_HISTORY = 50
const BST_MAP = getBstMap()

export const useSaveStore = defineStore('save', () => {
  const trackChangesStore = useTrackChangesStore()
  const save = ref<Save | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const activeSlotId = ref<number | null>(null)
  const fileHandle = ref<FileSystemFileHandle | null>(null)
  const lastModified = ref<number>(0)
  const pollInterval = ref<ReturnType<typeof setInterval> | null>(null)
  const history = ref<HistoryEntry[]>([])

  function pushToHistory(data: Save, modified: number) {
    if (history.value.length === 0) {
      history.value.push({ data, timestamp: Date.now(), lastModified: modified })
      return
    }
    const latest = history.value[history.value.length - 1]?.lastModified
    if (latest === modified) return
    history.value.push({ data, timestamp: Date.now(), lastModified: modified })
    if (history.value.length > MAX_HISTORY) {
      history.value.shift()
    }
  }

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

  const differences = computed(() => {
    if (history.value.length < 2) {
      return []
    }

    const prev = history.value[history.value.length - 2]?.data.slots?.[activeSlotId.value ?? 0]?.eventFlagUint8Array
    const curr = history.value[history.value.length - 1]?.data.slots?.[activeSlotId.value ?? 0]?.eventFlagUint8Array
    if (!prev || !curr) return []

    return compareUint8Arrays(prev, curr)
      .map((difference) => ({
        eventId: getEventIdFromPosition(BST_MAP, difference.offset, difference.bitIndex),
        ...difference,
      }))
      .toSorted((a, b) => a.eventId - b.eventId)
  })

  async function readFile(file: File) {
    isLoading.value = true
    error.value = null

    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async () => {
        const buffer = reader.result as ArrayBuffer
        const parsed = await parseFileBuffer(buffer)
        save.value = parsed
        pushToHistory(parsed, file.lastModified)
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
    return parse(buffer, { logLevel: 'debug', includeEventFlagUInt8Array: trackChangesStore.trackChangesMode })
  }

  async function connectFile(handle: FileSystemFileHandle) {
    fileHandle.value = handle
    error.value = null
    isLoading.value = true

    try {
      const file = await handle.getFile()
      lastModified.value = file.lastModified

      const buffer = await file.arrayBuffer()
      const parsed = await parseFileBuffer(buffer)
      save.value = parsed
      pushToHistory(parsed, lastModified.value)
      setActiveSlotId(0)

      pollInterval.value = setInterval(async () => {
        try {
          const currentHandle = fileHandle.value
          if (!currentHandle) return

          const updatedFile = await currentHandle.getFile()

          if (updatedFile.lastModified !== lastModified.value) {
            lastModified.value = updatedFile.lastModified

            const buffer = await updatedFile.arrayBuffer()
            const parsed = await parseFileBuffer(buffer)
            save.value = parsed
            pushToHistory(parsed, lastModified.value)
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
    // history.value = []
  }

  return {
    save,
    activeSlotId,
    activeSlot,
    defeatedFlags,
    differences,
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
    history,
  }
})
