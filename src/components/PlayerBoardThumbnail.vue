<template>
  <div
    @click="$emit('click')"
    class="player-board-thumbnail cursor-pointer hover:scale-105 transition-transform"
  >
    <div class="bg-white rounded-lg shadow-md p-3 border-2" :style="{ borderColor: themeColors.border }">
      <!-- Avatar + Name -->
      <div class="flex items-center gap-2 mb-2">
        <PlayerAvatar :name="playerName" :size="24" />
        <span class="text-sm font-semibold truncate">{{ playerName }}</span>
      </div>
      
      <!-- Mini Bingo Grid (5x5 tiny squares) -->
      <div class="grid grid-cols-5 gap-px bg-slate-200 rounded overflow-hidden">
        <div
          v-for="(row, rowIndex) in grid"
          :key="rowIndex"
          class="flex"
        >
          <div
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            :class="[
              'w-4 h-4',
              cell.marked ? 'bg-blue-500' : 'bg-white'
            ]"
          />
        </div>
      </div>
      
      <!-- Bingo Count -->
      <div class="mt-2 text-center">
        <span class="text-xs font-bold text-green-600">
          🎉 {{ bingoCount }} BINGO{{ bingoCount !== 1 ? 'S' : '' }}
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
  }
})

defineEmits(['click'])

const themeColors = THEMES[props.theme]?.colors || THEMES.default.colors
</script>
