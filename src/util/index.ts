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
  a.click()

  URL.revokeObjectURL(url)
}
