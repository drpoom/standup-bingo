<template>
  <div class="app">
    <!-- Version Badge -->
    <div class="version-badge">v{{ VERSION }}</div>
    <!-- Confetti Canvas -->
    <canvas
      v-show="showConfetti"
      ref="canvasRef"
      class="fixed inset-0 pointer-events-none z-50"
    />

    <!-- Lobby Screen -->
    <LobbyScreen
      v-if="gameState.phase === 'LOBBY'"
      :networking="networking"
      :players="networkPlayers"
      :isHost="networking.isHost.value"
      :gamePhase="lobbyGamePhase"
      @join="handleJoin"
      @start-game="handleStartGame"
      @end-game="handleEndGame"
      @transfer-host="handleTransferHost"
      @toggle-ready="handleToggleReady"
      @custom-phrases-updated="handleCustomPhrasesUpdated"
    />

    <!-- Game Screen -->
    <GameScreen
      v-else-if="gameState.phase === 'PLAYING' || gameState.phase === 'WON'"
      :gameState="gameState"
      :toggleMark="handleToggleMark"
      :formatTime="formatTime"
      :allPlayers="networkPlayers"
      :connected="networking.connected.value"
      :playerCount="networkPlayers.length"
      :isHost="networking.isHost.value"
      @continue="handleContinue"
      @toggle="handleToggleEmit"
      @peer-bingo="handlePeerBingo"
      @end-game="handleEndGame"
    />

    <!-- Stats Panel -->
    <StatsPanel
      v-else-if="gameState.phase === 'FINISHED'"
      :playerName="gameState.playerName"
      :bingos="gameState.bingos.length"
      :marksCount="gameState.marksCount"
      :bingoTime="gameState.bingoTime"
      :stats="stats"
      @playAgain="handlePlayAgain"
    />

    <!-- Toast Notifications -->
    <div
      v-if="toastMessage"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref, onMounted, onUnmounted } from 'vue'

const VERSION = '2.1.1'
import { useBingoCard } from './composables/useBingoCard'
import { useGameState } from './composables/useGameState'
import { usePersistence } from './composables/usePersistence'
import { useConfetti } from './composables/useConfetti'
import { useNetworking } from './composables/useNetworking'
import { useSoundEffects } from './composables/useSoundEffects'
import LobbyScreen from './components/LobbyScreen.vue'
import GameScreen from './components/GameScreen.vue'
import StatsPanel from './components/StatsPanel.vue'

const { generateCard, mergePhrases } = useBingoCard()
const { gameState, enterLobby, startGame, toggleMark, finishGame, endGame, resetGame, formatTime, setHostPeerId, setCustomPhrases } = useGameState()
const { stats, recordGame } = usePersistence()
const { canvasRef, burst: burstConfetti, stop: stopConfetti } = useConfetti()
const networking = useNetworking()
const { playMarkSound, playBingoSound } = useSoundEffects()

const showConfetti = computed(() => gameState.phase === 'WON')
const toastMessage = ref('')
const networkPlayers = ref([])
const lobbyGamePhase = ref('LOBBY') // 'LOBBY' | 'PLAYING' for host controls visibility

// Listen for peer data events
function handlePeerData(event) {
  const data = event.detail
  
  switch (data.type) {
    case 'PLAYER_LIST':
      networkPlayers.value = data.players
      // Update host peer ID if provided
      const host = data.players.find(p => p.isHost)
      if (host) {
        setHostPeerId(host.peerId)
      }
      break
      
    case 'GAME_START':
      handleRemoteGameStart(data)
      break
      
    case 'GAME_END':
      handleRemoteGameEnd()
      break
      
    case 'HOST_TRANSFER':
      handleRemoteHostTransfer(data)
      break
      
    case 'CUSTOM_PHRASES':
      handleRemoteCustomPhrases(data)
      break
      
    case 'BINGO':
      handlePeerBingo(data)
      break
      
    case 'MARK_UPDATE':
      handleRemoteMarkUpdate(data)
      break
  }
}

function handleRemoteGameStart(data) {
  const { theme, seed } = data
  const teamCode = gameState.teamCode
  const playerName = gameState.playerName
  const dateISO = new Date().toISOString().split('T')[0]
  
  // Generate card with same seed
  const grid = generateCard(teamCode, playerName, dateISO, theme, gameState.customPhrases, seed)
  startGame(teamCode, playerName, grid, theme, seed, gameState.customPhrases)
  lobbyGamePhase.value = 'PLAYING'
}

function handleRemoteGameEnd() {
  endGame()
  lobbyGamePhase.value = 'LOBBY'
  networkPlayers.value = []
}

function handleRemoteHostTransfer(data) {
  setHostPeerId(data.newHostPeerId)
}

function handleRemoteCustomPhrases(data) {
  setCustomPhrases(data.phrases)
}

function handleRemoteMarkUpdate(data) {
  const { row, col, marked } = data
  if (gameState.grid[row] && gameState.grid[row][col]) {
    gameState.grid[row][col].marked = marked
  }
}

function handleJoin(teamCode, playerName, theme, dateISO) {
  enterLobby(teamCode, playerName)
  gameState.theme = theme
  
  const roomId = `${teamCode.toUpperCase()}-${dateISO}`
  
  // Try to connect as client first, if fails become host
  networking.initializeAsClient(teamCode, dateISO, playerName)
  
  // Add one-time handler for connection failure to become host
  const checkConnection = setTimeout(() => {
    if (!networking.connected.value && networking.players.value.length === 0) {
      // Become host
      networking.initializeAsHost(teamCode, dateISO, playerName)
    }
  }, 1000)
  
  // Store cleanup
  watch(() => networking.connected.value, (connected) => {
    if (connected) {
      clearTimeout(checkConnection)
    }
  }, { once: true })
}

function handleStartGame(theme) {
  const dateISO = new Date().toISOString().split('T')[0]
  const seed = Date.now()
  
  // Generate card locally first
  const grid = generateCard(gameState.teamCode, gameState.playerName, dateISO, theme, gameState.customPhrases, seed)
  startGame(gameState.teamCode, gameState.playerName, grid, theme, seed, gameState.customPhrases)
  lobbyGamePhase.value = 'PLAYING'
  
  // Broadcast to peers
  networking.startGame(theme, seed)
}

function handleEndGame() {
  endGame()
  lobbyGamePhase.value = 'LOBBY'
  networking.endGame()
}

function handleTransferHost(newHostPeerId) {
  networking.transferHost(newHostPeerId)
}

function handleToggleReady(ready) {
  networking.toggleReady(ready)
}

function handleCustomPhrasesUpdated(phrases) {
  setCustomPhrases(phrases)
  networking.sendCustomPhrases(phrases)
}

function handleToggleMark(row, col) {
  // Play mark sound
  playMarkSound()
  
  const wins = toggleMark(row, col)
  
  // Broadcast mark update
  const cell = gameState.grid[row][col]
  networking.broadcastMarkUpdate(row, col, cell.marked)
  
  // If bingo, broadcast
  if (wins && wins.length > 0 && gameState.bingos.length === 1) {
    networking.broadcastBingo(gameState.playerName, wins[0].type)
    playBingoSound()
  }
  
  return { row, col, wins }
}

function handleToggleEmit({ row, col, wins }) {
  // Already handled in handleToggleMark
}

function handlePeerBingo(data) {
  // Play bingo sound for peer bingo too
  playBingoSound()
  
  // Show toast notification
  toastMessage.value = `${data.playerName} got BINGO! 🎉`
  burstConfetti()
  
  // Clear toast after 3 seconds
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

function handleContinue() {
  stopConfetti()
}

function handlePlayAgain() {
  resetGame()
  lobbyGamePhase.value = 'LOBBY'
  networking.disconnect()
  networkPlayers.value = []
}

// Watch for bingo and trigger confetti
watch(
  () => gameState.phase,
  (newPhase) => {
    if (newPhase === 'WON') {
      burstConfetti()
      recordGame(gameState.bingoTime, true)
    } else if (newPhase === 'FINISHED') {
      stopConfetti()
      if (!gameState.bingoTime) {
        recordGame(null, false)
      }
    }
  }
)

// Set up peer data listener
onMounted(() => {
  window.addEventListener('peer-data', handlePeerData)
})

onUnmounted(() => {
  window.removeEventListener('peer-data', handlePeerData)
})
</script>

<style>
@import 'tailwindcss';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  min-height: 100vh;
}

.version-badge {
  position: fixed;
  bottom: 8px;
  right: 8px;
  font-size: 12px;
  opacity: 0.6;
  pointer-events: none;
}
</style>
