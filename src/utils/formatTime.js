// Format elapsed time since startTime
export function formatTime(startTime) {
  if (!startTime) return '0:00'
  const elapsed = Math.floor((Date.now() - startTime) / 1000)
  const mins = Math.floor(elapsed / 60)
  const secs = elapsed % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
