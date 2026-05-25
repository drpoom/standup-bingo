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
      :players="allLobbyPlayers"
      :isHost="networking.isHost.value"
      :gamePhase="lobbyGamePhase"
      :gameState="gameState"
      @join="handleJoin"
      @start-game="handleStartGame"
      @end-game="handleEndGame"
      @transfer-host="handleTransferHost"
      @toggle-ready="handleToggleReady"
      @custom-phrases-updated="handleCustomPhrasesUpdated"
      @reseed="handleReseed"
    />

    <!-- Game Screen -->
    <GameScreen
      v-else-if="gameState.phase === 'PLAYING' || gameState.phase === 'WON'"
      :gameState="gameState"
      :timer="timer"
      :marksCount="marksCount"
      :toggleMark="handleToggleMark"
      :formatTime="formatTime"
      :allPlayers="allPlayersList"
      :connected="networking.connected.value"
      :playerCount="allPlayersList.length"
      :isHost="networking.isHost.value"
      @continue="handleContinue"
      @toggle="handleToggleEmit"
      @end-game="handleEndGame"
    />

    <!-- Stats Panel -->
    <StatsPanel
      v-else-if="gameState.phase === 'FINISHED'"
      :playerName="gameState.playerName"
      :bingos="gameState.bingos.length"
      :marksCount="marksCount"
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
import { hashString } from './utils/prng.js'

const VERSION = '2.5.0'
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
const { gameState, timer, marksCount, enterLobby, startGame, toggleMark, finishGame, endGame, resetGame, formatTime, setHostPeerId, setCustomPhrases } = useGameState()
const { stats, recordGame } = usePersistence()
const { canvasRef, burst: burstConfetti, stop: stopConfetti } = useConfetti()
const networking = useNetworking()
const { playMarkSound, playBingoSound, playBingoVoice } = useSoundEffects()

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
  playBingoVoice,
  burstConfetti
})

const showConfetti = computed(() => gameState.phase === 'WON')
const screenShake = ref(false)

// Computed: merge local player with network players for sidebar display
const allPlayersList = computed(() => {
  const selfPlayer = {
    name: gameState.playerName,
    grid: gameState.grid,
    bingoCount: gameState.bingos.length,
    theme: gameState.theme,
    peerId: networking.myPeerId.value || 'self',
    isSelf: true
  }
  // Include self + remote players (avoid duplicates by peerId)
  const remotePlayers = networkPlayers.value.filter(
    p => p.peerId !== (networking.myPeerId.value || 'self')
  )
  return [selfPlayer, ...remotePlayers]
})

// Computed: merge networking players with peer event players for lobby display
const allLobbyPlayers = computed(() => {
  // Start with networking players (includes self for host)
  const netPlayers = networking.players.value || []
  // Merge with peer event players, avoiding duplicates by peerId
  const peerPlayers = networkPlayers.value.filter(
    p => !netPlayers.find(np => np.peerId === p.peerId)
  )
  return [...netPlayers, ...peerPlayers]
})

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
  // boardSharing and seed are set by host when starting the game
  
  const roomId = `${teamCode.toUpperCase()}-${dateISO}`
  
  // Try to connect as client first, if fails become host
  networking.initializeAsClient(teamCode, dateISO, playerName)
  
  // Add one-time handler for connection failure to become host
  // Give PeerJS more time to establish WebRTC connection (5s instead of 1s)
  const checkConnection = setTimeout(() => {
    if (!networking.connected.value && networking.players.value.length === 0) {
      // Disconnect client peer first, then become host
      networking.disconnect()
      networking.initializeAsHost(teamCode, dateISO, playerName, gameState.seed, gameState.boardSharing, gameState.theme)
    }
  }, 5000)
  
  // Store cleanup
  watch(() => networking.connected.value, (connected) => {
    if (connected) {
      clearTimeout(checkConnection)
    }
  }, { once: true })
}

function handleStartGame(theme, seed = null, boardSharing = 'separate') {
  const dateISO = new Date().toISOString().split('T')[0]
  // Use provided seed if available, otherwise generate random
  const actualSeed = seed || Date.now()
  gameState.boardSharing = boardSharing
  gameState.userSeed = seed  // null if random, number if user-provided
  
  // Generate card locally first
  const grid = generateCard(gameState.teamCode, gameState.playerName, dateISO, theme, gameState.customPhrases, actualSeed, boardSharing)
  startGame(gameState.teamCode, gameState.playerName, grid, theme, actualSeed, gameState.customPhrases, dateISO)
  lobbyGamePhase.value = 'PLAYING'
  
  // Broadcast to peers
  networking.startGame(theme, actualSeed, dateISO, boardSharing)

  // Broadcast BOARD_SYNC to peers
  setTimeout(() => {
    networking.sendToPeers({
      type: 'BOARD_SYNC',
      peerId: networking.myPeerId.value,
      playerName: gameState.playerName,
      seed: gameState.playerSeed,
      grid: grid,
      timestamp: Date.now()
    })
  }, 200)
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
  networking.broadcastMarkUpdate(row, col, cell.marked, networking.myPeerId.value)
  
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
  console.log('[DEBUG] handleContinue called, phase before:', gameState.phase)
  // Start a new round: regenerate grid and reset state
  const dateISO = new Date().toISOString().split('T')[0]
  const seed = Date.now()
  const grid = generateCard(gameState.teamCode, gameState.playerName, dateISO, gameState.theme, gameState.customPhrases, seed, gameState.boardSharing)
  
  gameState.phase = 'PLAYING'
  gameState.grid = grid
  gameState.bingos = []
  gameState.startTime = Date.now()
  gameState.bingoTime = null
  gameState.seed = seed
  gameState.userSeed = null  // New round is always random
  gameState.dateISO = dateISO

  // Calculate playerSeed
  const seedString = gameState.boardSharing === 'shared' && seed !== null
    ? String(seed)
    : `${gameState.teamCode.toUpperCase()}${dateISO || ''}${gameState.playerName}${gameState.theme}${seed !== null && seed !== undefined ? seed : ''}`
  gameState.playerSeed = Math.abs(hashString(seedString)) % 1000000
  
  // Broadcast new round to peers
  if (networking.isHost.value) {
    networking.startGame(gameState.theme, seed, dateISO, gameState.boardSharing)
  }

  // Broadcast BOARD_SYNC to peers
  setTimeout(() => {
    networking.sendToPeers({
      type: 'BOARD_SYNC',
      peerId: networking.myPeerId.value,
      playerName: gameState.playerName,
      seed: gameState.playerSeed,
      grid: grid,
      timestamp: Date.now()
    })
  }, 200)
  
  console.log('[DEBUG] handleContinue: phase after:', gameState.phase)
  stopConfetti()
}

function handlePlayAgain() {
  console.log('[DEBUG] handlePlayAgain called')
  resetGame()
  lobbyGamePhase.value = 'LOBBY'
  networking.disconnect()
  networkPlayers.value = []
}

function handleEndGame() {
  console.log('[DEBUG] handleEndGame called')
  endGame()
  lobbyGamePhase.value = 'LOBBY'
  networking.endGame()
}

function handleReseed() {
  const newSeed = Date.now()
  gameState.seed = newSeed
  gameState.userSeed = null  // Reseed is always random
  // Regenerate card with new seed
  const grid = generateCard(
    gameState.teamCode,
    gameState.playerName,
    gameState.dateISO,
    gameState.theme,
    gameState.customPhrases,
    newSeed,
    gameState.boardSharing
  )
  gameState.grid = grid
  
  // Broadcast reseed to all players (if shared board)
  if (gameState.boardSharing === 'shared' && networking.isHost.value) {
    networking.reseed(newSeed)
  }
}

// Watch for phase changes (debug)
watch(
  () => gameState.phase,
  (newPhase, oldPhase) => {
    console.log('[DEBUG] Phase changed:', oldPhase, '->', newPhase)
    console.trace('[DEBUG] Phase change trace')
  }
)

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
@import './src/styles/circuit-bg.css';
@import './styles/main.css';

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
  overflow-x: hidden;
}

.app {
  min-height: 100vh;
  background: var(--theme-bg, #f8fafc);
  transition: background 0.3s ease;
  overflow-x: hidden;
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
