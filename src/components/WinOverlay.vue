<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" :style="{ backgroundColor: 'var(--theme-overlay)' }">
    <div class="rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center transform animate-bounce-in" :style="{ backgroundColor: 'var(--theme-surface)' }">
      <div class="text-6xl mb-4">🎉</div>
      <h2 class="text-4xl font-bold mb-2" :style="{ background: 'var(--theme-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }">
        BINGO!
      </h2>
      <p class="mb-6" :style="{ color: 'var(--theme-text-muted)' }">
        {{ victoryMessages[Math.floor(Math.random() * victoryMessages.length)] }}
      </p>

      <div class="rounded-lg p-4 mb-6" :style="{ backgroundColor: 'var(--theme-bg-secondary)' }">
        <div class="text-sm mb-1" :style="{ color: 'var(--theme-text-muted)' }">Winning pattern</div>
        <div class="flex flex-wrap gap-2 justify-center">
          <span
            v-for="(bingo, index) in bingos"
            :key="index"
            class="px-3 py-1 rounded-full text-sm font-medium"
            :style="{ backgroundColor: 'var(--theme-accent-light)', color: 'var(--theme-accent)' }"
          >
            {{ formatBingoType(bingo) }}
          </span>
        </div>
      </div>

      <button
        @click="$emit('continue')"
        class="w-full font-semibold py-4 rounded-lg transition transform hover:scale-105 btn-game"
        :style="{ background: 'var(--theme-gradient)', color: 'var(--theme-text-inverse)' }"
      >
        Keep Playing
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  bingos: {
    type: Array,
    required: true
  }
})

defineEmits(['continue'])

const victoryMessages = [
  "The Standup God smiles upon you!",
  "Absolute Legend!",
  "Meeting efficiency: 100%",
  "You've conquered the standup!",
  "Bingo master in the making!",
  "That's how it's done!"
]

function formatBingoType(bingo) {
  if (bingo.type === 'row') return `Row ${bingo.index + 1}`
  if (bingo.type === 'column') return `Column ${bingo.index + 1}`
  if (bingo.type === 'diagonal') return bingo.direction === 'main' ? 'Diagonal ↘' : 'Diagonal ↙'
  return 'Bingo!'
}
</script>

<style scoped>
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
</style>
