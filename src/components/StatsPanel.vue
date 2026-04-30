<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-slate-800 mb-2">🏆 Game Complete!</h1>
        <p class="text-slate-500">Great session, {{ playerName }}!</p>
      </div>

      <div class="space-y-4 mb-8">
        <div class="bg-slate-50 rounded-lg p-4">
          <div class="text-sm text-slate-500">Bingos Achieved</div>
          <div class="text-3xl font-bold text-blue-500">{{ bingos }}</div>
        </div>
        
        <div class="bg-slate-50 rounded-lg p-4">
          <div class="text-sm text-slate-500">Squares Marked</div>
          <div class="text-3xl font-bold text-green-500">{{ marksCount }}</div>
        </div>

        <div class="bg-slate-50 rounded-lg p-4">
          <div class="text-sm text-slate-500">Time to First Bingo</div>
          <div class="text-3xl font-bold text-purple-500">{{ formatBingoTime }}</div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-8">
        <div class="text-sm font-medium text-slate-700 mb-2">📊 Your Stats</div>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-slate-800">{{ stats.totalBingos }}</div>
            <div class="text-xs text-slate-500">Total Bingos</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800">{{ stats.currentStreak }}</div>
            <div class="text-xs text-slate-500">Day Streak</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800">{{ stats.totalGames }}</div>
            <div class="text-xs text-slate-500">Games Played</div>
          </div>
        </div>
      </div>

      <button
        @click="$emit('playAgain')"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-lg transition transform hover:scale-105 btn-game"
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
