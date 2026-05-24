<template>
  <div class="hud-container">
    <!-- Speedometer -->
    <div class="speedometer">
      <div class="speed-value">{{ speed }}</div>
      <div class="speed-unit">km/h</div>
    </div>

    <!-- Gear Indicator -->
    <div class="gear-indicator">
      <div class="gear-label">Gear</div>
      <div class="gear-value">{{ gear || 'N' }}</div>
    </div>

    <!-- Minimap Placeholder -->
    <div class="minimap">
      <div class="minimap-placeholder">
        <span>Minimap</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

/**
 * HUD Component - Heads-Up Display for vehicle information
 * Displays speedometer, gear indicator, and minimap placeholder
 */

const props = defineProps({
  /**
   * Current vehicle speed in km/h
   */
  speed: {
    type: Number,
    default: 0
  },
  /**
   * Current gear (e.g., '1', '2', '3', '4', '5', 'R', 'N')
   */
  gear: {
    type: String,
    default: ''
  },
  /**
   * Minimap data object (placeholder for future implementation)
   */
  minimapData: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped>
.hud-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  display: flex;
  align-items: flex-end;
  gap: 20px;
  z-index: 1000;
  font-family: 'Arial', sans-serif;
}

.speedometer {
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid #00ff00;
  border-radius: 10px;
  padding: 15px 25px;
  text-align: center;
  min-width: 120px;
}

.speed-value {
  font-size: 48px;
  font-weight: bold;
  color: #00ff00;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.speed-unit {
  font-size: 14px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.gear-indicator {
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid #ffff00;
  border-radius: 8px;
  padding: 10px 20px;
  text-align: center;
  min-width: 60px;
}

.gear-label {
  font-size: 10px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 5px;
}

.gear-value {
  font-size: 32px;
  font-weight: bold;
  color: #ffff00;
  text-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
}

.minimap {
  width: 200px;
  height: 150px;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid #0088ff;
  border-radius: 8px;
  overflow: hidden;
}

.minimap-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0088ff;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: linear-gradient(
    45deg,
    rgba(0, 136, 255, 0.1) 25%,
    transparent 25%,
    transparent 50%,
    rgba(0, 136, 255, 0.1) 50%,
    rgba(0, 136, 255, 0.1) 75%,
    transparent 75%,
    transparent
  );
  background-size: 20px 20px;
}
</style>
