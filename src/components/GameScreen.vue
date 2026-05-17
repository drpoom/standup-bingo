<template>
  <div class="min-h-screen relative" :style="{ background: 'var(--theme-bg)' }" style="overflow-x: hidden">
    <div class="circuit-bg">
      <div class="circuit-layer-1"></div>
      <div class="circuit-layer-2"></div>
      <div class="circuit-node-pulse" style="top: 15%; left: 10%;"></div>
      <div class="circuit-node-pulse" style="top: 30%; left: 85%;"></div>
      <div class="circuit-node-pulse" style="top: 60%; left: 20%;"></div>
      <div class="circuit-node-pulse" style="top: 80%; left: 70%;"></div>
      <div class="circuit-node-pulse" style="top: 40%; left: 40%;"></div>
    </div>
    <!-- Header -->
    <header class="shadow-sm sticky top-0 z-10" :style="{ background: 'var(--theme-primary)' }">
      <div class="max-w-6xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2 min-w-0">
          <img src="../assets/icons/ui/start.svg" alt="" class="w-6 h-6 flex-shrink-0" />
          <div class="min-w-0">
            <h1 class="text-lg sm:text-xl font-bold truncate" :style="{ color: 'var(--theme-text)' }">Standup Bingo</h1>
            <p class="text-xs sm:text-sm truncate" :style="{ color: 'var(--theme-text-muted)' }">{{ gameState.playerName }}</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <!-- Connection Status -->
          <div class="flex items-center gap-2 text-sm">
            <span :class="connected ? 'text-green-500 flex items-center gap-1' : ''" :style="{ color: connected ? 'var(--theme-text)' : 'var(--theme-text-muted)' }">
              <span class="w-2 h-2 rounded-full" :class="connected ? 'bg-green-500' : 'bg-slate-400'"></span>
              Connected
            </span>
            <span :style="{ color: 'var(--theme-text-muted)' }">|</span>
            <span :style="{ color: 'var(--theme-text)' }">{{ playerCount }} player{{ playerCount !== 1 ? 's' : '' }}</span>
          </div>
          <!-- Elapsed Time -->
          <div class="text-right">
            <div class="text-2xl font-bold" :style="{ color: 'var(--theme-text)' }">
              {{ formatTime(gameState.startTime) }}
            </div>
            <div class="text-xs" :style="{ color: 'var(--theme-text-muted)' }">Elapsed time</div>
          </div>
          <!-- Host End Game Button -->
          <button
            v-if="isHost"
            @click="handleEndGame"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 btn-game"
          >
            <img src="../assets/icons/ui/end.svg" alt="" class="w-4 h-4" />
            End Game
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-3 sm:px-4 py-6 flex flex-col sm:flex-row gap-6">
      <!-- Bingo Card Area -->
      <div class="flex-1 w-full">
        <BingoCard :grid="gameState.grid" @toggle="handleToggle" />

        <!-- Stats -->
        <div class="mt-6 flex justify-center gap-4 text-sm" :style="{ color: 'var(--theme-text)' }">
          <div class="px-4 py-2 rounded-lg shadow" :style="{ background: 'var(--theme-primary)' }">
            <span class="font-bold" :style="{ color: 'var(--theme-accent-blue, #3b82f6)' }">{{ gameState.marksCount }}</span> marked
          </div>
          <div class="px-4 py-2 rounded-lg shadow" :style="{ background: 'var(--theme-primary)' }">
            <span class="font-bold" :style="{ color: 'var(--theme-accent-green, #22c55e)' }">{{ gameState.bingos.length }}</span> bingo{{ gameState.bingos.length !== 1 ? 's' : '' }}
          </div>
        </div>
      </div>

      <!-- Player Sidebar -->
      <aside class="w-full sm:w-64 space-y-3">
        <h3 class="font-semibold mb-2" :style="{ color: 'var(--theme-text)' }">Players</h3>
        <PlayerBoardThumbnail
          v-for="player in allPlayers"
          :key="player.name"
          :playerName="player.name"
          :grid="player.grid"
          :bingoCount="player.bingoCount"
          :theme="player.theme"
          @click="openPlayerModal(player)"
        />
      </aside>
    </main>

    <!-- Player Board Modal -->
    <PlayerBoardModal
      v-if="modalPlayer"
      :visible="!!modalPlayer"
      :playerName="modalPlayer.name"
      :grid="modalPlayer.grid"
      :bingoCount="modalPlayer.bingoCount"
      @close="closeModal"
    />

    <!-- Win Overlay -->
    <WinOverlay
      v-if="gameState.phase === 'WON'"
      :bingos="gameState.bingos"
      @continue="handleContinue"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import BingoCard from './BingoCard.vue'
import WinOverlay from './WinOverlay.vue'
import PlayerBoardThumbnail from './PlayerBoardThumbnail.vue'
import PlayerBoardModal from './PlayerBoardModal.vue'

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
  },
  allPlayers: {
    type: Array,
    default: () => []
  },
  connected: {
    type: Boolean,
    default: false
  },
  playerCount: {
    type: Number,
    default: 1
  },
  isHost: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['continue', 'toggle', 'open-modal', 'close-modal', 'end-game'])

const { gameState, toggleMark, formatTime, allPlayers, connected, playerCount } = props

const modalPlayer = ref(null)

function handleToggle(row, col) {
  const wins = toggleMark(row, col)
  emit('toggle', { row, col, wins })
}

function handleContinue() {
  emit('continue')
}

function openPlayerModal(player) {
  modalPlayer.value = player
  emit('open-modal', player)
}

function closeModal() {
  modalPlayer.value = null
  emit('close-modal')
}

function handleEndGame() {
  emit('end-game')
}

// Listen for peer bingo events
if (typeof window !== 'undefined') {
  window.addEventListener('peer-data', (event) => {
    const data = event.detail
    if (data.type === 'BINGO') {
      emit('peer-bingo', data)
    }
  })
}
</script>
