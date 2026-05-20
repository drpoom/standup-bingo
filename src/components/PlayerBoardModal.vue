<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
    @click="close"
  >
    <div
      class="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
      :style="{ background: themeColors.card }"
      @click.stop
    >
      <!-- Header -->
      <div class="sticky top-0 border-b p-4 flex items-center justify-between" :style="{ background: themeColors.card, borderColor: themeColors.border }">
        <div class="flex items-center gap-3">
          <PlayerAvatar :name="playerName" :size="48" />
          <div>
            <h2 class="text-xl font-bold" :style="{ color: themeColors.text }">{{ playerName }}</h2>
            <p class="text-sm font-semibold" :style="{ color: themeColors.accent }">
              {{ bingoCount }} BINGO{{ bingoCount !== 1 ? 'S' : '' }}
            </p>
          </div>
        </div>
        <button
          @click="close"
          class="transition p-1 rounded-full hover:opacity-70"
          :style="{ color: themeColors.text }"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Bingo Card -->
      <div class="p-4 sm:p-6">
        <div class="grid grid-cols-5 gap-1.5 sm:gap-2">
          <template v-for="(row, rowIndex) in grid" :key="`row-${rowIndex}`">
            <div v-for="(cell, colIndex) in row" :key="`cell-${rowIndex}-${colIndex}`"
              class="aspect-square rounded flex items-center justify-center text-[10px] sm:text-xs font-medium transition p-0.5"
              :style="{
                background: cell.marked ? themeColors.accent : themeColors.background,
                color: cell.marked ? (themeColors.background) : themeColors.text
              }"
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
import { THEMES } from '../data/themes.js'

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
  },
  theme: {
    type: String,
    default: 'default'
  }
})

const emit = defineEmits(['close'])

const themeColors = THEMES[props.theme]?.colors || THEMES.default.colors

function close() {
  emit('close')
}
</script>
