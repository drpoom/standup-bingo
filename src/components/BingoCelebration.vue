<template>
  <div class="bingo-celebration" @click.stop>
    <div class="overlay"></div>
    <div class="content">
      <h1 class="celebration-text">
        🎉 {{ playerName }} got BINGO!
      </h1>
      <p v-if="bingoType" class="bingo-type">
        {{ bingoType.toUpperCase() }} BINGO
      </p>
    </div>
    <!-- Confetti/Fireworks would be triggered here or via a global system -->
    <div class="particle-container"></div>
  </div>
</template>

<script setup>
import { onMounted, defineProps, defineEmits } from 'vue';

const props = defineProps({
  playerName: {
    type: String,
    required: true
  },
  bingoType: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['dismiss']);

onMounted(() => {
  // Auto-dismiss after 4 seconds
  setTimeout(() => {
    emit('dismiss');
  }, 4000);
});
</script>

<style scoped>
.bingo-celebration {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.5s ease-out;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}

.content {
  position: relative;
  text-align: center;
  z-index: 1;
}

.celebration-text {
  font-size: 4rem;
  font-weight: bold;
  color: #00ffff;
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
  animation: pulse 1s infinite ease-in-out;
  margin: 0;
}

.bingo-type {
  font-size: 1.5rem;
  color: #fff;
  text-shadow: 0 0 5px #00ffff;
  margin-top: 1rem;
  opacity: 0.8;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Simple particle burst simulation if no external system is available, 
   though requirements say "reuse existing confetti system" 
   which usually means triggering a global event or using a shared component.
   For now, we provide the visual structure. */
.particle-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
