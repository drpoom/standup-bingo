import { ref } from 'vue'

const audioCtx = ref(null)

// Mute state - persisted in localStorage
const isMuted = ref(false)

function initMuteState() {
  if (typeof localStorage !== 'undefined') {
    isMuted.value = localStorage.getItem('standup-bingo:muted') === 'true'
  }
}

function getAudioContext() {
  if (!audioCtx.value) {
    audioCtx.value = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx.value
}

// Mark sound: short sine blip (150ms, 880Hz, quick decay)
function playMarkSound() {
  if (isMuted.value) return
  
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.value = 880
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.15)
  } catch (e) {
    console.warn('Audio playback failed:', e)
  }
}

// Bingo fanfare: ascending arpeggio (C5-E5-G5-C6, 600ms total)
function playBingoSound() {
  if (isMuted.value) return
  
  try {
    const ctx = getAudioContext()
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'triangle'
      osc.frequency.value = freq
      
      const start = ctx.currentTime + i * 0.15
      gain.gain.setValueAtTime(0.2, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3)
      
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.3)
    })
  } catch (e) {
    console.warn('Audio playback failed:', e)
  }
}

function toggleMute() {
  isMuted.value = !isMuted.value
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('standup-bingo:muted', isMuted.value)
  }
}

function getIsMuted() {
  return isMuted.value
}

// Initialize mute state on module load
if (typeof window !== 'undefined') {
  initMuteState()
}

export function useSoundEffects() {
  return {
    playMarkSound,
    playBingoSound,
    toggleMute,
    isMuted
  }
}
