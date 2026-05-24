<template>
  <div class="game-hud">
    <!-- Speedometer -->
    <div class="hud-panel speedometer">
      <div class="panel-icon">🚗</div>
      <div class="value-container">
        <span class="value">{{ formattedSpeed }}</span>
        <span class="unit">km/h</span>
      </div>
    </div>

    <!-- Delivery Timer -->
    <div class="hud-panel timer" :class="{ 'urgent': isUrgent }">
      <div class="panel-icon">⏱️</div>
      <div class="value-container">
        <span class="value">{{ formattedTime }}</span>
        <span class="unit">{{ timeLabel }}</span>
      </div>
    </div>

    <!-- Score -->
    <div class="hud-panel score">
      <div class="panel-icon">⭐</div>
      <div class="value-container">
        <span class="value">{{ score }}</span>
        <span class="unit">points</span>
      </div>
    </div>

    <!-- Minimap -->
    <div class="hud-panel minimap">
      <div class="minimap-container">
        <canvas ref="minimapCanvas" width="150" height="150"></canvas>
        <div class="minimap-overlay">
          <span class="player-marker">📍</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

/**
 * GameHUD Component - Heads-Up Display for delivery game
 * Displays speedometer, delivery timer, score, and minimap
 */

interface Props {
  /**
   * Current vehicle speed in km/h
   */
  speed?: number
  /**
   * Time remaining for delivery in seconds
   */
  timeRemaining?: number
  /**
   * Current player score
   */
  score?: number
  /**
   * Player position for minimap [x, y, z]
   */
  playerPosition?: [number, number, number]
  /**
   * Target delivery position for minimap [x, y, z]
   */
  targetPosition?: [number, number, number]
  /**
   * Whether the timer is in urgent mode (less than 30 seconds)
   */
  urgentThreshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  speed: 0,
  timeRemaining: 0,
  score: 0,
  playerPosition: () => [0, 0, 0],
  targetPosition: () => [0, 0, 0],
  urgentThreshold: 30
})

// Canvas ref for minimap
const minimapCanvas = ref<HTMLCanvasElement | null>(null)

// Computed properties
const formattedSpeed = computed(() => {
  return Math.round(props.speed)
})

const formattedTime = computed(() => {
  const minutes = Math.floor(Math.abs(props.timeRemaining) / 60)
  const seconds = Math.floor(Math.abs(props.timeRemaining) % 60)
  const sign = props.timeRemaining < 0 ? '-' : ''
  return `${sign}${minutes}:${seconds.toString().padStart(2, '0')}`
})

const timeLabel = computed(() => {
  return props.timeRemaining < 0 ? 'overtime' : 'remaining'
})

const isUrgent = computed(() => {
  return props.timeRemaining >= 0 && props.timeRemaining <= props.urgentThreshold
})

// Minimap drawing
function drawMinimap(): void {
  const canvas = minimapCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height
  const centerX = width / 2
  const centerY = height / 2

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Draw background
  ctx.fillStyle = 'rgba(0, 20, 0, 0.8)'
  ctx.fillRect(0, 0, width, height)

  // Draw grid
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)'
  ctx.lineWidth = 1
  const gridSize = 30
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  // Draw target marker (relative to player position)
  const [playerX, , playerZ] = props.playerPosition
  const [targetX, , targetZ] = props.targetPosition

  // Scale factor for minimap (adjust based on your world scale)
  const scale = 0.5
  const maxRange = 100

  // Calculate relative position
  const relX = (targetX - playerX) * scale
  const relZ = (targetZ - playerZ) * scale

  // Clamp to minimap bounds
  const clampedX = Math.max(-maxRange, Math.min(maxRange, relX))
  const clampedZ = Math.max(-maxRange, Math.min(maxRange, relZ))

  // Draw target marker
  const targetScreenX = centerX + clampedX
  const targetScreenY = centerY + clampedZ

  // Draw direction indicator
  ctx.strokeStyle = '#00ff00'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(targetScreenX, targetScreenY)
  ctx.stroke()

  // Draw target circle
  ctx.fillStyle = '#ff4444'
  ctx.beginPath()
  ctx.arc(targetScreenX, targetScreenY, 5, 0, Math.PI * 2)
  ctx.fill()

  // Draw player marker (center)
  ctx.fillStyle = '#00ff00'
  ctx.beginPath()
  ctx.arc(centerX, centerY, 4, 0, Math.PI * 2)
  ctx.fill()
}

// Watch for position changes and redraw minimap
watch(
  [() => props.playerPosition, () => props.targetPosition],
  () => {
    drawMinimap()
  },
  { deep: true }
)

// Lifecycle
onMounted(() => {
  drawMinimap()
})

onUnmounted(() => {
  // Cleanup if needed
})
</script>

<style scoped>
.game-hud {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  pointer-events: none;
}

.hud-panel {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.75);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  min-width: 140px;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  pointer-events: auto;
  transition: all 0.3s ease;
}

.panel-icon {
  font-size: 28px;
  line-height: 1;
}

.value-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.value {
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  line-height: 1;
}

.unit {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 2px;
}

/* Speedometer specific */
.speedometer {
  border-color: #00ff88;
}

.speedometer .value {
  color: #00ff88;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

/* Timer specific */
.timer {
  border-color: #00ccff;
}

.timer .value {
  color: #00ccff;
  text-shadow: 0 0 10px rgba(0, 204, 255, 0.5);
}

.timer.urgent {
  border-color: #ff4444;
  animation: pulse 1s ease-in-out infinite;
}

.timer.urgent .value {
  color: #ff4444;
  text-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Score specific */
.score {
  border-color: #ffcc00;
}

.score .value {
  color: #ffcc00;
  text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
}

/* Minimap specific */
.minimap {
  padding: 10px;
  min-width: auto;
}

.minimap-container {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid rgba(0, 255, 0, 0.5);
}

.minimap-container canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.minimap-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.player-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  filter: drop-shadow(0 0 4px rgba(0, 255, 0, 0.8));
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .game-hud {
    top: 10px;
    left: 10px;
    gap: 8px;
  }

  .hud-panel {
    padding: 8px 12px;
    min-width: 110px;
    border-radius: 8px;
  }

  .panel-icon {
    font-size: 22px;
  }

  .value {
    font-size: 22px;
  }

  .unit {
    font-size: 9px;
  }

  .minimap-container {
    width: 120px;
    height: 120px;
  }
}
</style>
