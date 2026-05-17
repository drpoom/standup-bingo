<template>
  <div class="min-h-screen flex items-center justify-center px-4" :style="{ backgroundColor: 'var(--theme-bg)' }">
    <div class="max-w-md w-full rounded-2xl shadow-xl p-8" :style="{ backgroundColor: 'var(--theme-surface)' }">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2" :style="{ color: 'var(--theme-text)' }">🏆 Game Complete!</h1>
        <p class="text-slate-500" :style="{ color: 'var(--theme-text-muted)' }">Great session, {{ playerName }}!</p>
      </div>

      <div class="space-y-4 mb-8">
        <div class="rounded-lg p-4" :style="{ backgroundColor: 'var(--theme-bg-secondary)' }">
          <div class="text-sm" :style="{ color: 'var(--theme-text-muted)' }">Bingos Achieved</div>
          <div class="text-3xl font-bold" :style="{ color: 'var(--theme-accent)' }">{{ bingos }}</div>
        </div>
        
        <div class="rounded-lg p-4" :style="{ backgroundColor: 'var(--theme-bg-secondary)' }">
          <div class="text-sm" :style="{ color: 'var(--theme-text-muted)' }">Squares Marked</div>
          <div class="text-3xl font-bold" :style="{ color: 'var(--theme-accent)' }">{{ marksCount }}</div>
        </div>

        <div class="rounded-lg p-4" :style="{ backgroundColor: 'var(--theme-bg-secondary)' }">
          <div class="text-sm" :style="{ color: 'var(--theme-text-muted)' }">Time to First Bingo</div>
          <div class="text-3xl font-bold" :style="{ color: 'var(--theme-accent)' }">{{ formatBingoTime }}</div>
        </div>
      </div>

      <div class="rounded-lg p-4 mb-8" :style="{ background: 'var(--theme-gradient)' }">
        <div class="text-sm font-medium mb-2" :style="{ color: 'var(--theme-text)' }">📊 Your Stats</div>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold" :style="{ color: 'var(--theme-text)' }">{{ stats.totalBingos }}</div>
            <div class="text-xs" :style="{ color: 'var(--theme-text-muted)' }">Total Bingos</div>
          </div>
          <div>
            <div class="text-2xl font-bold" :style="{ color: 'var(--theme-text)' }">{{ stats.currentStreak }}</div>
            <div class="text-xs" :style="{ color: 'var(--theme-text-muted)' }">Day Streak</div>
          </div>
          <div>
            <div class="text-2xl font-bold" :style="{ color: 'var(--theme-text)' }">{{ stats.totalGames }}</div>
            <div class="text-xs" :style="{ color: 'var(--theme-text-muted)' }">Games Played</div>
          </div>
        </div>
      </div>

      <button
        @click="$emit('playAgain')"
        class="w-full font-semibold py-4 min-h-[44px] rounded-lg transition transform hover:scale-105 btn-game"
        :style="{ backgroundColor: 'var(--theme-accent)', color: 'var(--theme-text-inverse)' }"
      >
        🎮 Play Again
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  playerName: {
    type: String,
    required: true
  },
  bingos: {
    type: Number,
    required: true
  },
  marksCount: {
    type: Number,
    required: true
  },
  bingoTime: {
    type: Number,
    default: null
  },
  stats: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['playAgain'])

function formatBingoTime() {
  if (!props.bingoTime) return '--:--'
  const seconds = Math.floor(props.bingoTime / 1000)
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>
