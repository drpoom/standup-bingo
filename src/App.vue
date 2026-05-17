<template>
  <div class="app" :class="{ 'screen-shake': screenShake }">
    <!-- Version Badge -->
    <div class="version-badge">v{{ VERSION }}</div>
    <!-- Confetti Canvas -->
    <canvas
      v-show="showConfetti"
      ref="canvasRef"
      class="fixed inset-0 pointer-events-none z-50"
    />

    <!-- Onboarding Overlay -->
    <OnboardingOverlay
      v-if="showOnboarding"
      @dismiss="dismissOnboarding"
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
import { THEMES } from './data/themes.js'

const VERSION = '2.2.2'
import { useBingoCard } from './composables/useBingoCard'
import { useGameState } from './composables/useGameState'
import { usePersistence } from './composables/usePersistence'
import { useConfetti } from './composables/useConfetti'
import { useNetworking } from './composables/useNetworking'
import { useSoundEffects } from './composables/useSoundEffects'
import { usePeerEvents } from './composables/usePeerEvents'
import LobbyScreen from './components/LobbyScreen.vue'
import GameScreen from './components/GameScreen.vue'
import StatsPanel from './components/StatsPanel.vue'
import OnboardingOverlay from './components/OnboardingOverlay.vue'

const { generateCard, mergePhrases } = useBingoCard()
const { gameState, enterLobby, startGame, toggleMark, finishGame, endGame, resetGame, formatTime, setHostPeerId, setCustomPhrases } = useGameState()
const { stats, recordGame } = usePersistence()
const { canvasRef, burst: burstConfetti, stop: stopConfetti } = useConfetti()
const networking = useNetworking()
const { playMarkSound, playBingoSound } = useSoundEffects()

const showOnboarding = ref(false)

// Initialize peer events composable with dependencies
const {
  networkPlayers,
  toastMessage,
  lobbyGamePhase,
  handlePeerBingo,
  setupPeerListener,
  cleanupPeerListener
} = usePeerEvents({
  networking,
  gameState,
  generateCard,
  startGame,
  endGame,
  setHostPeerId,
  setCustomPhrases,
  playBingoSound,
  burstConfetti
})

const showConfetti = computed(() => gameState.phase === 'WON')
const screenShake = ref(false)

// Apply theme CSS custom properties to document root
function applyTheme(themeId) {
  const theme = THEMES[themeId] || THEMES.default
  const cssVars = theme.cssVars
  
  if (cssVars) {
    Object.entries(cssVars).forEach(([prop, value]) => {
      document.documentElement.style.setProperty(prop, value)
    })
  }
  
  // Also apply font
  document.documentElement.style.setProperty('--theme-font', theme.font)
}

// Watch for theme changes and apply CSS variables
watch(
  () => gameState.theme,
  (newTheme) => {
    if (newTheme) {
      applyTheme(newTheme)
    }
  },
  { immediate: true }
)

function dismissOnboarding() {
  showOnboarding.value = false
  localStorage.setItem('standup-bingo-seen', 'true')
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
      
      // Trigger screen shake
      screenShake.value = true
      setTimeout(() => {
        screenShake.value = false
      }, 250)
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
  setupPeerListener()
  
  // Check if onboarding should be shown
  if (localStorage.getItem('standup-bingo-seen') === null) {
    showOnboarding.value = true
  }
})

onUnmounted(() => {
  cleanupPeerListener()
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
  font-family: var(--theme-font, 'Inter, system-ui, -apple-system, sans-serif');
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--theme-bg, #f8fafc);
  color: var(--theme-text, #1e293b);
  transition: background 0.3s ease, color 0.3s ease;
}

.app {
  min-height: 100vh;
  background: var(--theme-bg, #f8fafc);
  transition: background 0.3s ease;
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
