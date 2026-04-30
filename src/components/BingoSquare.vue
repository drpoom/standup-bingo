<template>
  <div
    v-for="(cell, colIndex) in row"
    :key="`cell-${cell.row}-${cell.col}`"
    :data-row="cell.row"
    :data-col="cell.col"
    @click="handleClick"
    :class="[
      'aspect-square flex items-center justify-center p-1.5 sm:p-2 rounded-lg cursor-pointer transition-all duration-200 select-none',
      'text-[10px] xs:text-xs sm:text-sm font-medium',
      cell.isFree 
        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg' 
        : cell.marked
          ? 'bg-blue-100 border-2 border-blue-500 text-slate-800 shadow-inner square-marked'
          : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-md'
    ]"
  >
    <span class="text-center leading-tight break-words line-clamp-3 max-w-full">
      {{ cell.phrase }}
    </span>
    <img
      v-if="cell.marked && !cell.isFree"
      :src="getMarkerForTheme(cell.theme || 'default')"
      alt=""
      class="w-8 h-8 sm:w-10 sm:h-10 opacity-40 pointer-events-none absolute"
    />
    <!-- Particle burst container -->
    <div v-if="showParticles" class="particle-container inset-0">
      <span
        v-for="particle in particles"
        :key="particle.id"
        class="particle"
        :style="{
          left: particle.x + 'px',
          top: particle.y + 'px',
          width: particle.size + 'px',
          height: particle.size + 'px',
          backgroundColor: particle.color,
          transform: `translate(${particle.vx * 10}px, ${particle.vy * 10}px) scale(0)`,
          animationDelay: particle.delay + 'ms'
        }"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  row: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['toggle'])

const showParticles = ref(false)
const particles = ref([])
let particleId = 0

function createParticles() {
  const colors = ['#3b82f6', '#f0abfc', '#00ff41', '#fbbf24', '#ef4444', '#8b5cf6']
  const newParticles = []
  
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8
    const velocity = 0.5 + Math.random() * 0.5
    newParticles.push({
      id: particleId++,
      x: 50,
      y: 50,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      size: 4 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 50
    })
  }
  
  particles.value = newParticles
  showParticles.value = true
  
  // Hide particles after animation
  setTimeout(() => {
    showParticles.value = false
  }, 300)
}

function handleClick(event) {
  const cell = event.currentTarget
  const rowIndex = parseInt(cell.dataset.row)
  const colIndex = parseInt(cell.dataset.col)
  
  // Create particle burst
  createParticles()
  
  emit('toggle', {
    row: rowIndex,
    col: colIndex
  })
}

// Reset particles when row changes
watch(() => props.row, () => {
  showParticles.value = false
}, { deep: true })

function getMarkerForTheme(themeId) {
  const markerMap = {
    'embedded': '../assets/markers/embedded-marker.svg',
    'default': '../assets/markers/default-marker.svg'
  }
  return markerMap[themeId] || markerMap['default']
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Marker overlay positioning */
.aspect-square {
  position: relative;
}

.particle-container {
  position: absolute;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: particle-burst 300ms ease-out forwards;
}

@keyframes particle-burst {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx, 0), var(--ty, 0)) scale(0);
    opacity: 0;
  }
}
</style>
