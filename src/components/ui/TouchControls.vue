<template>
  <div class="touch-controls" @touchstart.prevent @touchmove.prevent @touchend.prevent>
    <!-- Virtual Joystick (Left Side) -->
    <div
      ref="joystickZone"
      class="joystick-zone"
      @touchstart="handleJoystickStart"
      @touchmove="handleJoystickMove"
      @touchend="handleJoystickEnd"
    >
      <div class="joystick-base" :style="joystickBaseStyle">
        <div class="joystick-knob" :style="joystickKnobStyle"></div>
      </div>
    </div>

    <!-- Action Buttons (Right Side) -->
    <div class="action-buttons">
      <!-- Horn Button -->
      <button
        class="action-button horn-button"
        :class="{ active: hornActive }"
        @touchstart="handleHornStart"
        @touchend="handleHornEnd"
        @touchcancel="handleHornEnd"
      >
        <span class="button-icon">📯</span>
        <span class="button-label">Horn</span>
      </button>

      <!-- Brake Button -->
      <button
        class="action-button brake-button"
        :class="{ active: brakeActive }"
        @touchstart="handleBrakeStart"
        @touchend="handleBrakeEnd"
        @touchcancel="handleBrakeEnd"
      >
        <span class="button-icon">🛑</span>
        <span class="button-label">Brake</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['input']);

// Joystick state
const joystickZone = ref(null);
const joystickActive = ref(false);
const joystickOrigin = ref({ x: 0, y: 0 });
const joystickPosition = ref({ x: 0, y: 0 });
const joystickTouchId = ref(null);

// Button states
const hornActive = ref(false);
const brakeActive = ref(false);

// Joystick configuration
const joystickMaxRadius = 50; // Maximum distance the knob can move
const joystickDeadZone = 10;  // Dead zone to prevent drift

// Computed styles for joystick visual feedback
const joystickBaseStyle = computed(() => {
  if (!joystickActive.value) {
    return {
      opacity: 0.3,
      transform: 'scale(0.9)'
    };
  }
  return {
    opacity: 1,
    transform: 'scale(1)',
    transition: 'opacity 0.1s, transform 0.1s'
  };
});

const joystickKnobStyle = computed(() => {
  const dx = joystickPosition.value.x - joystickOrigin.value.x;
  const dy = joystickPosition.value.y - joystickOrigin.value.y;
  return {
    transform: `translate(${dx}px, ${dy}px)`
  };
});

// Joystick handlers
function handleJoystickStart(event) {
  event.preventDefault();
  const touch = event.changedTouches[0];
  joystickTouchId.value = touch.identifier;
  joystickActive.value = true;

  // Set origin at touch point
  const rect = joystickZone.value.getBoundingClientRect();
  joystickOrigin.value = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
  joystickPosition.value = { x: touch.clientX, y: touch.clientY };

  emitInput();
}

function handleJoystickMove(event) {
  event.preventDefault();
  if (!joystickActive.value) return;

  // Find the touch with matching identifier
  for (let i = 0; i < event.changedTouches.length; i++) {
    if (event.changedTouches[i].identifier === joystickTouchId.value) {
      const touch = event.changedTouches[i];
      
      // Calculate offset from origin
      let dx = touch.clientX - joystickOrigin.value.x;
      let dy = touch.clientY - joystickOrigin.value.y;

      // Clamp to maximum radius
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > joystickMaxRadius) {
        const ratio = joystickMaxRadius / distance;
        dx *= ratio;
        dy *= ratio;
      }

      joystickPosition.value = {
        x: joystickOrigin.value.x + dx,
        y: joystickOrigin.value.y + dy
      };

      emitInput();
      break;
    }
  }
}

function handleJoystickEnd(event) {
  event.preventDefault();
  if (!joystickActive.value) return;

  // Check if the ending touch is our joystick touch
  for (let i = 0; i < event.changedTouches.length; i++) {
    if (event.changedTouches[i].identifier === joystickTouchId.value) {
      joystickActive.value = false;
      joystickTouchId.value = null;
      joystickPosition.value = { ...joystickOrigin.value };
      emitInput();
      break;
    }
  }
}

// Button handlers
function handleHornStart(event) {
  event.preventDefault();
  hornActive.value = true;
  emitInput();
}

function handleHornEnd(event) {
  event.preventDefault();
  hornActive.value = false;
  emitInput();
}

function handleBrakeStart(event) {
  event.preventDefault();
  brakeActive.value = true;
  emitInput();
}

function handleBrakeEnd(event) {
  event.preventDefault();
  brakeActive.value = false;
  emitInput();
}

// Emit input event with current control state
function emitInput() {
  // Calculate normalized joystick values (-1 to 1)
  const dx = joystickPosition.value.x - joystickOrigin.value.x;
  const dy = joystickPosition.value.y - joystickOrigin.value.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  let normalizedX = 0;
  let normalizedY = 0;

  if (distance > joystickDeadZone) {
    normalizedX = Math.max(-1, Math.min(1, dx / joystickMaxRadius));
    normalizedY = Math.max(-1, Math.min(1, dy / joystickMaxRadius));
  }

  emit('input', {
    joystick: {
      x: normalizedX,
      y: normalizedY,
      active: joystickActive.value
    },
    horn: hornActive.value,
    brake: brakeActive.value
  });
}

// Initialize joystick position to center
onMounted(() => {
  if (joystickZone.value) {
    const rect = joystickZone.value.getBoundingClientRect();
    joystickOrigin.value = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    joystickPosition.value = { ...joystickOrigin.value };
  }
});

// Handle window resize
function handleResize() {
  if (joystickZone.value && !joystickActive.value) {
    const rect = joystickZone.value.getBoundingClientRect();
    joystickOrigin.value = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    joystickPosition.value = { ...joystickOrigin.value };
  }
}

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
});
</script>

<style scoped>
.touch-controls {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 40;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

/* Joystick Zone (Left Side) */
.joystick-zone {
  position: absolute;
  left: 20px;
  bottom: 40px;
  width: 150px;
  height: 150px;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.joystick-base {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 3px solid rgba(0, 255, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  position: relative;
  transition: opacity 0.2s, transform 0.2s;
}

.joystick-knob {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  margin-top: -25px;
  margin-left: -25px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.8), rgba(0, 255, 255, 0.4));
  border: 2px solid rgba(0, 255, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  transition: transform 0.05s linear;
}

/* Action Buttons (Right Side) */
.action-buttons {
  position: absolute;
  right: 20px;
  bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  pointer-events: auto;
}

.action-button {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.1s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.action-button:active,
.action-button.active {
  transform: scale(0.9);
}

.horn-button {
  border-color: rgba(255, 200, 0, 0.6);
  background: rgba(255, 200, 0, 0.15);
  box-shadow: 0 0 15px rgba(255, 200, 0, 0.3);
}

.horn-button.active {
  background: rgba(255, 200, 0, 0.4);
  box-shadow: 0 0 30px rgba(255, 200, 0, 0.6);
  border-color: rgba(255, 200, 0, 0.9);
}

.brake-button {
  border-color: rgba(255, 50, 50, 0.6);
  background: rgba(255, 50, 50, 0.15);
  box-shadow: 0 0 15px rgba(255, 50, 50, 0.3);
}

.brake-button.active {
  background: rgba(255, 50, 50, 0.4);
  box-shadow: 0 0 30px rgba(255, 50, 50, 0.6);
  border-color: rgba(255, 50, 50, 0.9);
}

.button-icon {
  font-size: 24px;
  line-height: 1;
}

.button-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive adjustments for smaller screens */
@media (max-width: 400px) {
  .joystick-zone {
    left: 10px;
    bottom: 20px;
    width: 120px;
    height: 120px;
  }

  .joystick-base {
    width: 100px;
    height: 100px;
  }

  .joystick-knob {
    width: 40px;
    height: 40px;
    margin-top: -20px;
    margin-left: -20px;
  }

  .action-buttons {
    right: 10px;
    bottom: 20px;
    gap: 15px;
  }

  .action-button {
    width: 75px;
    height: 75px;
  }

  .button-icon {
    font-size: 20px;
  }

  .button-label {
    font-size: 10px;
  }
}

/* Landscape mode adjustments */
@media (orientation: landscape) and (max-height: 500px) {
  .joystick-zone {
    left: 10px;
    bottom: 10px;
  }

  .action-buttons {
    right: 10px;
    bottom: 10px;
    flex-direction: row;
    gap: 15px;
  }
}
</style>
