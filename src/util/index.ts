import type { Npc } from '@/model/types'

export function hasDuoPhase(npcs: Npc[]): boolean {
  const phaseCounts = new Map<number, number>()
  for (const npc of npcs) {
    phaseCounts.set(npc.phase, (phaseCounts.get(npc.phase) ?? 0) + 1)
  }
  return [...phaseCounts.values()].some((count) => count >= 2)
}

export function hasMultiplePhases(npcs: Npc[]): boolean {
  return npcs.length >= 2 && npcs.some((npc) => npc.phase >= 2)
}

export function secondsToHMS(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}

export function formatNumber(n: number | undefined): string {
  if (n === undefined) return '\u2014'
  return n.toLocaleString()
}

export function downloadBinaryFile(
  uint8Array: Uint8Array<ArrayBuffer>,
  filename: string = 'file.bin',
  mimeType: string = 'application/octet-stream',
): void {
  const blob = new Blob([uint8Array], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()

  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 100)
}
