<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    @click="close"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
      @click.stop
    >
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <PlayerAvatar :name="playerName" :size="48" />
          <div>
            <h2 class="text-xl font-bold text-slate-800">{{ playerName }}</h2>
            <p class="text-sm text-green-600 font-semibold">
              🎉 {{ bingoCount }} BINGO{{ bingoCount !== 1 ? 'S' : '' }}
            </p>
          </div>
        </div>
        <button
          @click="close"
          class="text-slate-400 hover:text-slate-600 transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Bingo Card -->
      <div class="p-6">
        <div class="grid grid-cols-5 gap-2">
          <template v-for="(row, rowIndex) in grid" :key="`row-${rowIndex}`">
            <div v-for="(cell, colIndex) in row" :key="`cell-${rowIndex}-${colIndex}`"
              :class="[
                'aspect-square rounded flex items-center justify-center text-xs font-medium transition',
                cell.marked ? 'square-marked' : 'bg-white/10'
              ]"
              :style="{ background: cell.marked ? 'var(--theme-accent)' : '' }"
            >
              <span class="text-center leading-tight">{{ cell.phrase }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PlayerAvatar from './PlayerAvatar.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  playerName: {
    type: String,
    required: true
  },
  grid: {
    type: Array,
    required: true
  },
  bingoCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>
