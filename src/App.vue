<template>
  <div class="app">
    <!-- Confetti Canvas -->
    <canvas
      v-show="showConfetti"
      ref="canvasRef"
      class="fixed inset-0 pointer-events-none z-50"
    />

    <!-- Join Screen -->
    <JoinScreen
      v-if="gameState.phase === 'join'"
      @join="handleJoin"
    />

    <!-- Game Screen -->
    <GameScreen
      v-else-if="gameState.phase === 'playing' || gameState.phase === 'won'"
      :gameState="gameState"
      :toggleMark="toggleMark"
      :formatTime="formatTime"
      @continue="handleContinue"
    />

    <!-- Stats Panel -->
    <StatsPanel
      v-else-if="gameState.phase === 'finished'"
      :playerName="gameState.playerName"
      :bingos="gameState.bingos.length"
      :marksCount="gameState.marksCount"
      :bingoTime="gameState.bingoTime"
      :stats="stats"
      @playAgain="handlePlayAgain"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBingoCard } from './composables/useBingoCard'
import { useGameState } from './composables/useGameState'
import { usePersistence } from './composables/usePersistence'
import { useConfetti } from './composables/useConfetti'
import JoinScreen from './components/JoinScreen.vue'
import GameScreen from './components/GameScreen.vue'
import StatsPanel from './components/StatsPanel.vue'

const { generateCard } = useBingoCard()
const { gameState, startGame, toggleMark, finishGame, resetGame, formatTime } = useGameState()
const { stats, recordGame } = usePersistence()
const { canvasRef, burst: burstConfetti, stop: stopConfetti } = useConfetti()

const showConfetti = computed(() => gameState.phase === 'won')

function handleJoin(teamCode, playerName) {
  const dateISO = new Date().toISOString().split('T')[0]
  const grid = generateCard(teamCode, playerName, dateISO)
  startGame(teamCode, playerName, grid)
}

function handleContinue() {
  // Continue playing after bingo
  stopConfetti()
}

function handlePlayAgain() {
  resetGame()
}

// Watch for bingo and trigger confetti
import { watch } from 'vue'
watch(
  () => gameState.phase,
  (newPhase) => {
    if (newPhase === 'won') {
      burstConfetti()
      // Record the game
      recordGame(gameState.bingoTime, true)
    } else if (newPhase === 'finished') {
      stopConfetti()
      // Record game even without bingo
      if (!gameState.bingoTime) {
        recordGame(null, false)
      }
    }
  }
)
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
</style>
