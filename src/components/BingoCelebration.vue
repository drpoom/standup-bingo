<template>
  <div class="bingo-celebration" @animationend="handleAnimationEnd">
    <div class="celebration-content">
      <div class="bingo-text">
        🎉 {{ playerName }} got BINGO! 🎉
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  playerName: {
    type: String,
    required: true
  },
  bingoType: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['dismiss'])

const animationStarted = ref(false)

function handleAnimationEnd() {
  if (animationStarted.value) {
    emit('dismiss')
  } else {
    animationStarted.value = true
  }
}
</script>

<style scoped>
.bingo-celebration {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  pointer-events: none;
  animation: fadeInOut 4s ease-in-out forwards;
}

.celebration-content {
  text-align: center;
}

.bingo-text {
  font-size: 3rem;
  font-weight: bold;
  color: #00f0ff;
  text-shadow: 
    0 0 10px #00f0ff,
    0 0 20px #00f0ff,
    0 0 30px #00f0ff,
    0 0 40px #00f0ff;
  animation: pulse 0.5s ease-in-out infinite;
  white-space: nowrap;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@media (max-width: 640px) {
  .bingo-text {
    font-size: 1.5rem;
  }
}
</style>
