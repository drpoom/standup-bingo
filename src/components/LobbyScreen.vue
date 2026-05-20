<template>
  <div class="min-h-screen lobby-bg relative">
    <div class="circuit-bg">
      <div class="circuit-layer-1"></div>
      <div class="circuit-layer-2"></div>
      <!-- Randomly placed glowing nodes -->
      <div class="circuit-node-pulse" style="top: 20%; left: 15%;"></div>
      <div class="circuit-node-pulse" style="top: 45%; left: 80%;"></div>
      <div class="circuit-node-pulse" style="top: 70%; left: 30%;"></div>
      <div class="circuit-node-pulse" style="top: 10%; left: 60%;"></div>
      <div class="circuit-node-pulse" style="top: 85%; left: 70%;"></div>
    </div>

    <!-- ==================== PHASE 1: SERVER SETUP (Join Form) ==================== -->
    <div v-if="!inRoom" class="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-8 relative z-10">
      <!-- Setup Header -->
      <div class="text-center mb-6 sm:mb-8">
        <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
          <img src="../assets/icons/ui/start.svg" alt="" class="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
          Standup Bingo
        </h1>
        <p class="text-white/60 text-sm sm:text-base">Connect to a room to play with your team</p>
      </div>

      <!-- Setup Form Card -->
      <div class="setup-card w-full max-w-md p-6 sm:p-8">
        <div class="flex items-center gap-2 mb-5">
          <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <img src="../assets/icons/steps/join.svg" alt="" class="w-4 h-4" />
          </div>
          <h2 class="text-lg font-semibold text-white">Join a Room</h2>
        </div>

        <form @submit.prevent="handleJoin" class="space-y-5">
          <div>
            <label for="teamCode" class="block text-sm font-medium text-white/90 mb-2 flex items-center gap-1">
              Team Code
              <span class="cursor-help text-white/50 hover:text-white transition-colors" title="The unique identifier for your room. Share this with your teammates to join the same game.">
                ℹ️
              </span>
            </label>
            <input
              id="teamCode"
              v-model="teamCode"
              type="text"
              placeholder="e.g., ACME"
              class="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-lg uppercase bg-white/5 text-white placeholder-white/40"
              required
              maxlength="10"
            />
          </div>

          <div>
            <label for="playerName" class="block text-sm font-medium text-white/90 mb-2">
              Your Name
            </label>
            <input
              id="playerName"
              v-model="playerName"
              type="text"
              placeholder="e.g., Alice"
              class="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-lg bg-white/5 text-white placeholder-white/40"
              required
              maxlength="20"
            />
          </div>

          <!-- Remember Me -->
          <div class="flex items-center gap-2">
            <input
              id="rememberMe"
              v-model="rememberMe"
              type="checkbox"
              class="w-4 h-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-400 focus:ring-offset-0 cursor-pointer"
            />
            <label for="rememberMe" class="text-sm text-white/80 cursor-pointer select-none">
              Remember me
            </label>
            <span v-if="hasSavedData" class="text-xs text-green-400/80 flex items-center gap-1">
              ✨ Restored
            </span>
          </div>

          <button
            type="submit"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-lg transition transform hover:scale-105 text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 btn-game min-h-[44px]"
          >
            <img src="../assets/icons/ui/start.svg" alt="" class="w-5 h-5" />
            Join Room
          </button>
        </form>
      </div>

      <!-- How to Play (below form on setup screen) -->
      <div class="w-full max-w-md mt-6 sm:mt-8">
        <div class="glass-card p-4 sm:p-5">
          <h2 class="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
            <img src="../assets/icons/steps/join.svg" alt="" class="w-4 h-4" />
            How to Play
          </h2>
          <div class="flex flex-wrap gap-3 justify-center text-white/60">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <img src="../assets/icons/steps/join.svg" alt="" class="w-4 h-4" />
              </div>
              <span class="text-xs">Join</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <img src="../assets/icons/steps/wait.svg" alt="" class="w-4 h-4" />
              </div>
              <span class="text-xs">Wait</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <img src="../assets/icons/steps/mark.svg" alt="" class="w-4 h-4" />
              </div>
              <span class="text-xs">Mark</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <img src="../assets/icons/steps/win.svg" alt="" class="w-4 h-4" />
              </div>
              <span class="text-xs">Win</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Late Join Confirmation Dialog -->
    <div v-if="showLateJoinDialog" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="glass-card max-w-md w-full p-6 sm:p-8">
        <div class="text-center mb-6">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <span class="text-3xl">⚠️</span>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Game in Progress</h3>
          <p class="text-white/80">A game is already underway. Do you want to join anyway?</p>
        </div>
        
        <div class="flex gap-3">
          <button
            @click="cancelLateJoin"
            class="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 rounded-lg transition border border-white/30 min-h-[44px]"
          >
            Cancel
          </button>
          <button
            @click="confirmLateJoin"
            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 shadow-lg shadow-blue-500/30 min-h-[44px]"
          >
            Join Anyway
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== PHASE 2: LOBBY WAITING ROOM ==================== -->
    <div v-if="inRoom" class="min-h-screen relative z-10">
      <!-- Lobby Header - distinct from setup -->
      <div class="lobby-header px-3 sm:px-4 py-4 sm:py-5">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center">
              <span class="text-lg">🟢</span>
            </div>
            <div>
              <h1 class="text-lg sm:text-xl font-bold text-white">Room: {{ gameState.teamCode }}</h1>
              <p class="text-xs sm:text-sm text-white/60">{{ lobbyDate }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-400/30">
              <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Connected
            </span>
            <span class="text-sm text-white/70">
              {{ players.length }} player{{ players.length !== 1 ? 's' : '' }}
            </span>
          </div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-6">
        <!-- Player List -->
        <div class="glass-card p-5 sm:p-6 mb-4">
          <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
            <img src="../assets/icons/ui/transfer.svg" alt="" class="w-5 h-5" />
            Players in Room
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="player in players"
              :key="player.peerId"
              class="player-card flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
              :class="player.isHost ? 'player-card-host' : 'player-card-default'"
            >
              <div class="flex items-center gap-3">
                <PlayerAvatar :name="player.name" :size="56" :theme="selectedTheme" />
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-white">{{ player.name }}</span>
                    <span v-if="player.isHost" class="host-badge text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <img src="../assets/icons/ui/transfer.svg" alt="" class="w-3 h-3" />
                      Host
                    </span>
                  </div>
                  <div class="text-xs text-white/70">
                    Joined {{ formatJoinTime(player.joinTime) }}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="player.ready" class="ready-badge text-sm flex items-center gap-1">
                  <img src="../assets/icons/steps/mark.svg" alt="" class="w-4 h-4" />
                  Ready
                </span>
                <span v-else class="not-ready-badge text-sm flex items-center gap-1 text-white/50">
                  <span class="w-4 h-4 border-2 border-white/50 rounded-sm"></span>
                  Not Ready
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Ready Toggle -->
        <div class="glass-card p-5 sm:p-6 mb-4">
          <button
            @click="toggleReady"
            :class="[
              'w-full py-3 min-h-[44px] rounded-lg font-semibold transition transform hover:scale-105 flex items-center justify-center gap-2 btn-game',
              isReady
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
                : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
            ]""
          >
            <img v-if="isReady" src="../assets/icons/steps/mark.svg" alt="" class="w-5 h-5" />
            <span v-else class="w-5 h-5 border-2 border-white rounded-sm"></span>
            {{ isReady ? 'You are Ready' : 'Toggle Ready' }}
          </button>
        </div>

        <!-- Mute Toggle -->
        <div class="glass-card p-5 sm:p-6 mb-4">
          <button
            @click="toggleMute"
            :class="[
              'w-full py-3 min-h-[44px] rounded-lg font-semibold transition transform hover:scale-105 flex items-center justify-center gap-2 btn-game',
              isMuted
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg shadow-yellow-500/30'
                : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
            ]""
          >
            <img :src="isMuted ? muteIconUrl : unmuteIconUrl" alt="" class="w-5 h-5" />
            {{ isMuted ? 'Unmute' : 'Mute' }}
          </button>
        </div>

        <!-- Host Controls (only visible to host) -->
        <div v-if="isHost" class="glass-card p-5 sm:p-6 mb-4 border-l-4 border-l-amber-500/60">
          <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
            <img src="../assets/icons/ui/settings.svg" alt="" class="w-5 h-5" />
            Host Controls
          </h3>

          <!-- Game Settings: Seed & Board Sharing -->
          <div class="space-y-4 mb-5 p-4 rounded-lg bg-white/5 border border-white/10">
            <h4 class="text-sm font-medium text-white/80 flex items-center gap-2">
              <span class="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center text-xs">⚙️</span>
              Game Settings
            </h4>

            <!-- Seed Input -->
            <div>
              <label for="seedInput" class="block text-sm font-medium text-white/90 mb-2">
                Board Seed (optional)
              </label>
              <input
                id="seedInput"
                v-model="seedInput"
                type="text"
                placeholder="Leave empty for random"
                class="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white/10 text-white"
              />
              <p class="text-xs text-white/50 mt-1">Same seed = same board for all players</p>
            </div>

            <!-- Board Sharing -->
            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">
                Board Sharing
              </label>
              <div class="flex gap-2">
                <button
                  @click.prevent="boardSharing = 'separate'"
                  :class="boardSharing === 'separate' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/70'"
                  class="px-4 py-2 rounded-lg transition text-sm"
                >
                  Separate
                </button>
                <button
                  @click.prevent="boardSharing = 'shared'"
                  :class="boardSharing === 'shared' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/70'"
                  class="px-4 py-2 rounded-lg transition text-sm"
                >
                  Shared
                </button>
              </div>
              <p class="text-xs text-white/50 mt-1">
                {{ boardSharing === 'separate' ? 'Each player gets random board' : 'All players same board' }}
              </p>
            </div>
          </div>

          <!-- Start Game Button -->
          <div class="flex gap-4">
            <button
              v-if="gamePhase === 'LOBBY'"
              @click="handleStartGame"
              :class="[
                'flex-1 py-3 min-h-[44px] rounded-lg font-semibold transition flex items-center justify-center gap-2 btn-game',
                'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
              ]""
            >
              <img src="../assets/icons/ui/start.svg" alt="" class="w-5 h-5" />
              Start Game
            </button>
            <button
              v-if="gamePhase === 'PLAYING'"
              @click="handleEndGame"
              class="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 min-h-[44px] rounded-lg font-semibold transition flex items-center justify-center gap-2 btn-game"
            >
              <img src="../assets/icons/ui/end.svg" alt="" class="w-5 h-5" />
              End Game
            </button>
          </div>

          <!-- Transfer Host -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-white/80 mb-2">
              Transfer Host
            </label>
            <div class="flex gap-2">
              <select
                v-model="selectedTransferTarget"
                class="flex-1 px-4 py-2 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white/10 text-white"
              >
                <option
                  v-for="player in otherPlayers"
                  :key="player.peerId"
                  :value="player.peerId"
                >
                  {{ player.name }}
                </option>
              </select>
              <button
                @click="handleTransferHost"
                :disabled="!selectedTransferTarget"
                class="px-4 py-2 min-h-[44px] bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition disabled:opacity-50 shadow-lg shadow-blue-500/30 flex items-center gap-2 btn-game"
              >
                <img src="../assets/icons/ui/transfer.svg" alt="" class="w-4 h-4" />
                Transfer
              </button>
            </div>
          </div>

          <!-- Custom Phrases -->
          <div class="mt-4">
            <CustomPhraseEditor
              :teamCode="teamCode"
              :isHost="true"
              @phrases-updated="handleCustomPhrasesUpdated"
            />
          </div>
        </div>

        <!-- Non-host waiting message -->
        <div v-else class="glass-card p-5 sm:p-6 mb-4">
          <div v-if="gamePhase === 'PLAYING'" class="space-y-3 text-center">
            <p class="text-lg text-yellow-400 font-semibold">🎮 Game in Progress!</p>
            <p class="text-white/80">You've joined an ongoing game. Your board is being generated...</p>
            <p class="text-sm text-white/60">You can start marking your board immediately based on the standup updates.</p>
          </div>
          <div v-else class="text-center space-y-3">
            <div class="w-12 h-12 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center">
              <span class="text-xl">⏳</span>
            </div>
            <p class="text-white/80 text-lg">Waiting for host to start the game...</p>
            <p class="text-sm text-white/50">Host: {{ hostPlayer?.name || 'Unknown' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import PlayerAvatar from './PlayerAvatar.vue'
import CustomPhraseEditor from './CustomPhraseEditor.vue'
import { useSoundEffects } from '../composables/useSoundEffects.js'

const props = defineProps({
  networking: {
    type: Object,
    required: true
  },
  players: {
    type: Array,
    default: () => []
  },
  isHost: {
    type: Boolean,
    default: false
  },
  gamePhase: {
    type: String,
    default: 'LOBBY' // 'LOBBY' | 'PLAYING'
  },
  gameState: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['join', 'start-game', 'end-game', 'transfer-host', 'toggle-ready', 'custom-phrases-updated', 'reseed'])

const { isMuted, toggleMute } = useSoundEffects()

// Pre-compute icon URLs (import.meta.url can't be used in template expressions)
const muteIconUrl = new URL('../assets/icons/ui/mute.svg', import.meta.url).href
const unmuteIconUrl = new URL('../assets/icons/ui/unmute.svg', import.meta.url).href

// Load saved values from localStorage for "Remember me" functionality
const STORAGE_KEYS = {
  teamCode: 'standup-bingo-teamCode',
  playerName: 'standup-bingo-playerName',
  theme: 'standup-bingo-theme',
  boardSharing: 'standup-bingo-boardSharing'
}

const teamCode = ref(localStorage.getItem(STORAGE_KEYS.teamCode) || '')
const playerName = ref(localStorage.getItem(STORAGE_KEYS.playerName) || '')
const selectedTheme = ref(localStorage.getItem(STORAGE_KEYS.theme) || 'default')
const dateISO = ref('')
const boardSharing = ref(localStorage.getItem(STORAGE_KEYS.boardSharing) || 'separate')
const seedInput = ref('')
const showLateJoinDialog = ref(false)
const pendingJoinData = ref(null)
const rememberMe = ref(!!(localStorage.getItem(STORAGE_KEYS.teamCode) || localStorage.getItem(STORAGE_KEYS.playerName)))
const hasSavedData = ref(rememberMe.value)


const inRoom = computed(() => !!props.gameState.teamCode)
const lobbyDate = computed(() => dateISO.value || new Date().toISOString().split('T')[0])

// Watch for phase changes during pending join - triggers late-join dialog
watch(() => props.gamePhase, (newPhase) => {
  if (newPhase === 'PLAYING' && pendingJoinData.value) {
    // Game started while we were connecting - show late join confirmation
    showLateJoinDialog.value = true
    // Clear pending data to prevent re-triggering
    pendingJoinData.value = null
  }
})

// Sync local refs from gameState when returning from a game (End Game)
watch(() => props.gameState.phase, (newPhase) => {
  if (newPhase === 'LOBBY' && props.gameState.teamCode) {
    teamCode.value = props.gameState.teamCode
    playerName.value = props.gameState.playerName
    selectedTheme.value = props.gameState.theme || 'default'
    if (!dateISO.value) {
      dateISO.value = new Date().toISOString().split('T')[0]
    }
  }
}, { immediate: true })
const isReady = computed(() => props.players.find(p => p.peerId === props.networking.myPeerId.value)?.ready ?? false)
const selectedTransferTarget = ref('')
const customPhrases = ref(null)

const otherPlayers = computed(() => {
  return props.players.filter(p => p.peerId !== props.networking.peer?.value?.id)
})

const hostPlayer = computed(() => {
  return props.players.find(p => p.isHost)
})

const readyCount = computed(() => {
  return props.players.filter(p => p.ready).length
})


function saveToLocalStorage() {
  if (rememberMe.value) {
    localStorage.setItem(STORAGE_KEYS.teamCode, teamCode.value.trim().toUpperCase())
    localStorage.setItem(STORAGE_KEYS.playerName, playerName.value.trim())
    localStorage.setItem(STORAGE_KEYS.theme, selectedTheme.value)
    localStorage.setItem(STORAGE_KEYS.boardSharing, boardSharing.value)
  }
}

function clearLocalStorage() {
  localStorage.removeItem(STORAGE_KEYS.teamCode)
  localStorage.removeItem(STORAGE_KEYS.playerName)
  localStorage.removeItem(STORAGE_KEYS.theme)
  localStorage.removeItem(STORAGE_KEYS.boardSharing)
  hasSavedData.value = false
}

// Watch rememberMe to clear storage when unchecked
watch(rememberMe, (val) => {
  if (!val) {
    clearLocalStorage()
  }
})

function handleJoin() {
  if (teamCode.value.trim() && playerName.value.trim()) {
    // Save to localStorage for next visit
    saveToLocalStorage()

    // Store join data for potential late-join detection
    // NOTE: seed and boardSharing are NOT passed at join time anymore
    // They are set by the host in the lobby before starting the game
    pendingJoinData.value = {
      teamCode: teamCode.value.trim().toUpperCase(),
      playerName: playerName.value.trim(),
      theme: selectedTheme.value,
      date: new Date().toISOString().split('T')[0]
    }
    
    // Check if game is already in progress
    if (props.gameState.phase === 'PLAYING') {
      // Game already started - show confirmation dialog immediately
      showLateJoinDialog.value = true
    } else {
      // Normal join flow for games not yet started
      dateISO.value = pendingJoinData.value.date
      props.gameState.teamCode = pendingJoinData.value.teamCode
      emit('join', 
        pendingJoinData.value.teamCode, 
        pendingJoinData.value.playerName, 
        pendingJoinData.value.theme, 
        pendingJoinData.value.date
      )
    }
  }
}

function confirmLateJoin() {
  if (pendingJoinData.value) {
    dateISO.value = pendingJoinData.value.date
    props.gameState.teamCode = pendingJoinData.value.teamCode
    emit('join', 
      pendingJoinData.value.teamCode, 
      pendingJoinData.value.playerName, 
      pendingJoinData.value.theme, 
      pendingJoinData.value.date
    )
    showLateJoinDialog.value = false
    pendingJoinData.value = null
  }
}

function cancelLateJoin() {
  showLateJoinDialog.value = false
  // Clear pending join data on cancel
  pendingJoinData.value = null
}

function toggleReady() {
  emit('toggle-ready', !isReady.value)
}

function handleStartGame() {
  // Pass seed and boardSharing from host controls to the start-game event
  const seed = seedInput.value.trim() ? Number(seedInput.value.trim()) : Date.now()
  emit('start-game', selectedTheme.value, seed, boardSharing.value)
}

function handleEndGame() {
  emit('end-game')
}

function handleTransferHost() {
  if (selectedTransferTarget.value) {
    emit('transfer-host', selectedTransferTarget.value)
  }
}

function handleCustomPhrasesUpdated(phrases) {
  customPhrases.value = phrases
  emit('custom-phrases-updated', phrases)
}

function formatJoinTime(timestamp) {
  const now = Date.now()
  const diff = Math.floor((now - timestamp) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}
</script>

<style scoped>
/* Setup card - distinct from lobby glass cards */
.setup-card {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1.25rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

/* Lobby header - distinct from setup */
.lobby-header {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Animate pulse for connected indicator */
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>