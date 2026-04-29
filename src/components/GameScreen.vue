<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-slate-800">🎯 Standup Bingo</h1>
          <p class="text-sm text-slate-500">{{ playerName }}</p>
        </div>
        <div class="text-right">
          <div :class="[
            'text-2xl font-mono font-bold',
            gameState.timerSeconds < 60 ? 'text-red-500' : 'text-slate-700'
          ]">
            {{ formatTime(gameState.timerSeconds) }}
          </div>
          <div class="text-xs text-slate-400">Time remaining</div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 py-6">
      <BingoCard :grid="gameState.grid" @toggle="handleToggle" />

      <!-- Stats -->
      <div class="mt-6 flex justify-center gap-4 text-sm text-slate-600">
        <div class="bg-white px-4 py-2 rounded-lg shadow">
          <span class="font-bold text-blue-500">{{ marksCount }}</span> marked
        </div>
        <div class="bg-white px-4 py-2 rounded-lg shadow">
          <span class="font-bold text-green-500">{{ bingos.length }}</span> bingo{{ bingos.length !== 1 ? 's' : '' }}
        </div>
      </div>
    </main>

    <!-- Win Overlay -->
    <WinOverlay
      v-if="gameState.phase === 'won'"
      :bingos="bingos"
      @continue="handleContinue"
    />
  </div>
</template>

<script setup>
import BingoCard from './BingoCard.vue'
import WinOverlay from './WinOverlay.vue'

const props = defineProps({
  gameState: {
    type: Object,
    required: true
  },
  toggleMark: {
    type: Function,
    required: true
  },
  formatTime: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['continue'])

const { gameState, toggleMark, formatTime } = props

function handleToggle({ row, col }) {
  const wins = toggleMark(row, col)
  if (wins && wins.length > 0) {
    // Bingo detected
  }
}

function handleContinue() {
  emit('continue')
}

// Computed helpers
const marksCount = gameState.marksCount
const bingos = gameState.bingos
const playerName = gameState.playerName
</script>
