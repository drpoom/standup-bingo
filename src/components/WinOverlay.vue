<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center transform animate-bounce-in">
      <div class="text-6xl mb-4">🎉</div>
      <h2 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-2">
        BINGO!
      </h2>
      <p class="text-slate-600 mb-6">
        {{ victoryMessages[Math.floor(Math.random() * victoryMessages.length)] }}
      </p>

      <div class="bg-slate-50 rounded-lg p-4 mb-6">
        <div class="text-sm text-slate-500 mb-1">Winning pattern</div>
        <div class="flex flex-wrap gap-2 justify-center">
          <span
            v-for="(bingo, index) in bingos"
            :key="index"
            class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
          >
            {{ formatBingoType(bingo) }}
          </span>
        </div>
      </div>

      <button
        @click="$emit('continue')"
        class="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 rounded-lg transition transform hover:scale-105 btn-game"
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
