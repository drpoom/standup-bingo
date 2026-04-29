<template>
  <div
    v-for="(cell, colIndex) in row"
    :key="`cell-${cell.row}-${cell.col}`"
    :data-row="cell.row"
    :data-col="cell.col"
    @click="handleClick"
    :class="[
      'aspect-square flex items-center justify-center p-1 sm:p-2 rounded-lg cursor-pointer transition-all duration-200 select-none',
      'text-xs sm:text-sm font-medium',
      cell.isFree 
        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg' 
        : cell.marked
          ? 'bg-blue-100 border-2 border-blue-500 text-slate-800 shadow-inner'
          : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-md'
    ]"
  >
    <span class="text-center leading-tight break-words line-clamp-3">
      {{ cell.phrase }}
    </span>
    <span 
      v-if="cell.marked && !cell.isFree"
      class="text-2xl sm:text-3xl opacity-30 pointer-events-none"
    >
      ✓
    </span>
  </div>
</template>

<script setup>
defineProps({
  row: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['toggle'])

function handleClick(event) {
  const cell = event.currentTarget
  const rowIndex = parseInt(cell.dataset.row)
  const colIndex = parseInt(cell.dataset.col)
  
  emit('toggle', {
    row: rowIndex,
    col: colIndex
  })
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
