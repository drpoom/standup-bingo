<template>
  <div class="w-full max-w-full sm:max-w-2xl mx-auto px-2">
    <div class="grid grid-cols-5 gap-2 sm:gap-3">
      <BingoSquare
        v-for="(row, rowIndex) in grid"
        :key="`row-${rowIndex}`"
        :row="row"
        :rowIndex="rowIndex"
        @toggle="$emit('toggle', $event.row, $event.col)"
      />
    </div>
  </div>
</template>

<script setup>
import BingoSquare from './BingoSquare.vue'

defineProps({
  grid: {
    type: Array,
    required: true
  }
})

defineEmits(['toggle'])
</script>
