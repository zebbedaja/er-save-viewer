import type { Slot } from '@zebbedaja/er-save-parser'

export function isBossDefeated(saveSlot: Slot | null, flagId: number): boolean {
  return saveSlot?.eventFlags?.some((f) => f.id === flagId && f.state) ?? false
}

export function secondsToHMS(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}
