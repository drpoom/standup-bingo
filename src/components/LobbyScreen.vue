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
      <div class="circuit-node-pulse" style="top: 85%; lefts: 70%;"></div>
    </div>
    <div class="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 relative z-10">
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-8 relative z-10">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2 sm:gap-3">
          <img src="../assets/icons/ui/start.svg" alt="" class="w-6 h-6 sm:w-8 sm:h-8 inline" />
          Standup Bingo
        </h1>
        <p class="text-white/70 text-sm sm:text-base">Make your daily standup more fun!</p>
      </div>

      <!-- How to Play -->
      <div class="glass-card relative z-10 p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 class="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
          <img src="../assets/icons/steps/join.svg" alt="" class="w-5 h-5 sm:w-6 sm:h-6" />
          How to Play
        </h2>
        <div class="flex flex-wrap gap-3 sm:gap-4 justify-center text-white/80">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <img src="../assets/icons/steps/join.svg" alt="" class="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span class="text-xs sm:text-sm">Join</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <img src="../assets/icons/steps/wait.svg" alt="" class="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span class="text-xs sm:text-sm">Wait</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <img src="../assets/icons/steps/mark.svg" alt="" class="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span class="text-xs sm:text-sm">Mark</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <img src="../assets/icons/steps/win.svg" alt="" class="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span class="text-xs sm:text-sm">Win</span>
          </div>
        </div>
      </div>

      <!-- Join Form (shown when not in room) -->
      <div v-if="!inRoom" class="glass-card relative z-10 p-5 sm:p-8 mb-6 sm:mb-8">
        <form @submit.prevent="handleJoin" class="space-y-6">
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
              class="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-lg uppercase bg-white/10 text-white placeholder-white/50"
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
              class="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-lg bg-white/10 text-white placeholder-white/50"
              required
              maxlength="20"
            />
          </div>

          <ThemePicker v-model:theme="selectedTheme" @select="handleThemeSelect" />
          <div class="text-right">
            <span class="cursor-help text-white/50 hover:text-white transition-colors text-xs" title="Themes change the set of phrases on the bingo cards to match your team's vibe.">
              ℹ️ What is a theme?
            </span>
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

          <!-- Board Preview -->
          <div v-if="boardPreview && boardPreview.length === 25" class="mt-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-white/70">Your Board:</span>
              <button @click="reseedBoard" class="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                <span>🔄</span> Reseed
              </button>
            </div>
            <div class="grid grid-cols-5 gap-0.5 w-48">
              <div v-for="(cell, idx) in boardPreview" :key="idx" 
                class="aspect-square bg-white/10 rounded-[2px] flex items-center justify-center overflow-hidden"
                :title="cell.phrase"
              >
                <span class="text-[6px] text-white/50 truncate px-0.5 leading-tight">
                  {{ cell.phrase.split(' ').slice(0, 2).join(' ') }}
                </span>
              </div>
            </div>
            <p class="text-[10px] text-white/40 mt-1">Click Reseed for new random board</p>
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

      <!-- Lobby (shown when in room) -->
      <div v-else class="glass-card relative z-10 p-8">
        <!-- Room Info -->
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/20">
          <div>
            <h2 class="text-xl font-semibold text-white">Room: {{ gameState.teamCode }}</h2>
            <p class="text-sm text-white/60">Date: {{ lobbyDate }}</p>
          </div>
          <div class="text-sm text-white/80">
            {{ players.length }} player{{ players.length !== 1 ? 's' : '' }} in room
          </div>
        </div>

        <!-- Player List -->
        <div class="mb-6">
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
        <div class="mb-6">
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
        <div class="mb-6">
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

        <!-- Host Controls -->
        <div v-if="isHost" class="border-t border-white/20 pt-6">
          <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
            <img src="../assets/icons/ui/settings.svg" alt="" class="w-5 h-5" />
            Host Controls
          </h3>
          
          <div class="flex gap-4 mb-4">
            <button
              v-if="gamePhase === 'LOBBY'"
              @click="handleStartGame"
              :class="[
                'flex-1 py-3 min-h-[44px] rounded-lg font-semibold transition flex items-center justify-center gap-2 btn-game',
                'bg-green-500 hover:bg-green-600 text-white'
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
          <div class="mb-4">
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
          <CustomPhraseEditor
            :teamCode="teamCode"
            :isHost="true"
            @phrases-updated="handleCustomPhrasesUpdated"
          />
        </div>

        <!-- Non-host waiting message -->
        <div v-else class="border-t border-white/20 pt-6 text-center text-white/70">
          <p>Waiting for host to start the game...</p>
          <p class="text-sm mt-2">Host: {{ hostPlayer?.name || 'Unknown' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ThemePicker from './ThemePicker.vue'
import PlayerAvatar from './PlayerAvatar.vue'
import CustomPhraseEditor from './CustomPhraseEditor.vue'
import { useSoundEffects } from '../composables/useSoundEffects.js'
import { useBingoCard } from '../composables/useBingoCard.js'

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

const teamCode = ref('')
const playerName = ref('')
const selectedTheme = ref('default')
const dateISO = ref('')
const boardSharing = ref('separate')
const boardPreview = ref(null)
const { generateCard } = useBingoCard()

function reseedBoard() {
  if (!teamCode.value.trim() || !playerName.value.trim()) return
  
  const newSeed = Date.now()
  const grid = generateCard(
    teamCode.value.trim().toUpperCase(),
    playerName.value.trim(),
    dateISO.value || new Date().toISOString().split('T')[0],
    selectedTheme.value,
    null,
    newSeed,
    boardSharing.value
  )
  // Flatten grid to array for preview
  boardPreview.value = grid.flat()
}

// Watch for changes to update preview
watch([teamCode, playerName, selectedTheme, boardSharing], () => {
  if (teamCode.value.trim() && playerName.value.trim()) {
    reseedBoard()
  } else {
    boardPreview.value = null
  }
}, { immediate: true })

const inRoom = computed(() => !!props.gameState.teamCode)
const lobbyDate = computed(() => dateISO.value || new Date().toISOString().split('T')[0])

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

function handleThemeSelect(themeId) {
  selectedTheme.value = themeId
}

function handleJoin() {
  if (teamCode.value.trim() && playerName.value.trim()) {
    dateISO.value = new Date().toISOString().split('T')[0]
    props.gameState.teamCode = teamCode.value.trim().toUpperCase()
    props.gameState.boardSharing = boardSharing.value
    emit('join', teamCode.value.trim().toUpperCase(), playerName.value.trim(), selectedTheme.value, dateISO.value, boardSharing.value)
  }
}

function toggleReady() {
  emit('toggle-ready', !isReady.value)
}

function handleStartGame() {
  emit('start-game', selectedTheme.value)
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
