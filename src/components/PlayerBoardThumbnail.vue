<template>
  <div
    @click="$emit('click')"
    class="player-board-thumbnail cursor-pointer hover:scale-105 transition-transform"
  >
    <div class="rounded-lg shadow-md p-2 border-2" :style="{ borderColor: themeColors.border, background: themeColors.card }">
      <!-- Avatar + Name -->
      <div class="flex items-center justify-between gap-1.5 mb-1.5 min-w-0">
        <div class="flex items-center gap-1.5 min-w-0">
          <PlayerAvatar :name="playerName" :size="20" />
          <span class="text-xs font-semibold truncate" :style="{ color: themeColors.text }">{{ playerName }}</span>
        </div>
        <span v-if="seed" class="text-[9px] font-mono opacity-60 px-1 rounded bg-white/10" :style="{ color: themeColors.text }">
          #{{ seed }}
        </span>
      </div>
      
      <!-- Mini Bingo Grid (5x5 compact squares) -->
      <div class="grid grid-cols-5 gap-0.5 rounded overflow-hidden">
        <template v-for="(row, rowIndex) in grid" :key="`row-${rowIndex}`">
          <div v-for="(cell, colIndex) in row" :key="`cell-${rowIndex}-${colIndex}`"
            class="aspect-square rounded-sm flex items-center justify-center"
            :style="{ background: cell.marked ? themeColors.accent : themeColors.background }"
          >
            <span v-if="cell.isFree" class="text-[5px] font-bold" :style="{ color: themeColors.text }">★</span>
          </div>
        </template>
      </div>
      
      <!-- Bingo Count -->
      <div class="mt-1.5 text-center">
        <span class="text-[10px] font-bold" :style="{ color: themeColors.accent }">
          {{ bingoCount }} BINGO{{ bingoCount !== 1 ? 'S' : '' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import PlayerAvatar from './PlayerAvatar.vue'
import { THEMES } from '../data/themes.js'

const props = defineProps({
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
  },
  seed: {
    type: [Number, String],
    default: null
  }
})

defineEmits(['click'])

const themeColors = THEMES[props.theme]?.colors || THEMES.default.colors
</script>
