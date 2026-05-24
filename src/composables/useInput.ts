/**
 * useInput.ts - Reactive input composable for keyboard and touch
 * Provides normalized input state with touch joystick support
 */

import { ref, reactive, onMounted, onUnmounted, type Ref } from 'vue';

export interface InputState {
  // Driving inputs
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  
  // Brake inputs
  brake: boolean;
  handbrake: boolean;
  
  // Camera inputs
  cameraLeft: boolean;
  cameraRight: boolean;
  cameraUp: boolean;
  cameraDown: boolean;
  
  // Normalized driving vector (-1 to 1)
  driveX: number;
  driveY: number;
  
  // Touch joystick state
  joystickActive: boolean;
  joystickX: number;
  joystickY: number;
}

export interface UseInputOptions {
  /** Enable touch joystick controls (default: true) */
  enableTouch?: boolean;
  /** Joystick container element ID (default: 'joystick-container') */
  joystickContainerId?: string;
  /** Joystick deadzone (0-1, default: 0.1) */
  deadzone?: number;
  /** Callback on input change */
  onChange?: (state: InputState) => void;
}

export function useInput(options: UseInputOptions = {}) {
  const {
    enableTouch = true,
    joystickContainerId = 'joystick-container',
    deadzone = 0.1,
    onChange
  } = options;

  // Reactive input state
  const state = reactive<InputState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
    handbrake: false,
    cameraLeft: false,
    cameraRight: false,
    cameraUp: false,
    cameraDown: false,
    driveX: 0,
    driveY: 0,
    joystickActive: false,
    joystickX: 0,
    joystickY: 0
  });

  // Key mappings
  const keyMap: Record<string, string[]> = {
    forward: ['KeyW', 'ArrowUp'],
    backward: ['KeyS', 'ArrowDown'],
    left: ['KeyA', 'ArrowLeft'],
    right: ['KeyD', 'ArrowRight'],
    brake: ['Space'],
    handbrake: ['ShiftLeft', 'ShiftRight'],
    cameraLeft: ['KeyQ'],
    cameraRight: ['KeyE'],
    cameraUp: ['KeyR'],
    cameraDown: ['KeyF']
  };

  // Reverse key map for quick lookup
  const codeToAction: Record<string, keyof InputState> = {};
  Object.entries(keyMap).forEach(([action, codes]) => {
    codes.forEach(code => {
      codeToAction[code] = action as keyof InputState;
    });
  });

  // Touch/joystick state
  let joystickElement: HTMLElement | null = null;
  let joystickKnob: HTMLElement | null = null;
  let joystickOrigin = { x: 0, y: 0 };
  let joystickTouchId: number | null = null;
  let joystickRadius = 50;

  // Bound event handlers
  const boundKeyDown = handleKeyDown.bind(this);
  const boundKeyUp = handleKeyUp.bind(this);
  const boundTouchStart = handleTouchStart.bind(this);
  const boundTouchMove = handleTouchMove.bind(this);
  const boundTouchEnd = handleTouchEnd.bind(this);

  /**
   * Initialize input handlers
   */
  const init = (): void => {
    // Keyboard listeners
    window.addEventListener('keydown', boundKeyDown);
    window.addEventListener('keyup', boundKeyUp);

    // Touch/joystick listeners
    if (enableTouch) {
      setupJoystick();
    }
  };

  /**
   * Setup touch joystick
   */
  const setupJoystick = (): void => {
    const container = document.getElementById(joystickContainerId);
    if (!container) return;

    // Create joystick base
    joystickElement = document.createElement('div');
    joystickElement.style.cssText = `
      position: fixed;
      bottom: 40px;
      left: 40px;
      width: 120px;
      height: 120px;
      background: rgba(255, 255, 255, 0.15);
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      touch-action: none;
      user-select: none;
      pointer-events: auto;
      z-index: 1000;
    `;

    // Create joystick knob
    joystickKnob = document.createElement('div');
    joystickKnob.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 50px;
      height: 50px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    `;

    joystickElement.appendChild(joystickKnob);
    container.appendChild(joystickElement);

    // Add touch listeners
    joystickElement.addEventListener('touchstart', boundTouchStart, { passive: false });
    joystickElement.addEventListener('touchmove', boundTouchMove, { passive: false });
    joystickElement.addEventListener('touchend', boundTouchEnd);
  };

  /**
   * Handle key down
   */
  function handleKeyDown(event: KeyboardEvent): void {
    const action = codeToAction[event.code];
    if (action && !state[action]) {
      state[action] = true;
      updateDriveVector();
      notifyChange();
      event.preventDefault();
    }
  }

  /**
   * Handle key up
   */
  function handleKeyUp(event: KeyboardEvent): void {
    const action = codeToAction[event.code];
    if (action && state[action]) {
      state[action] = false;
      updateDriveVector();
      notifyChange();
      event.preventDefault();
    }
  }

  /**
   * Handle touch start on joystick
   */
  function handleTouchStart(event: TouchEvent): void {
    if (!joystickElement || !joystickKnob) return;
    event.preventDefault();

    const touch = event.changedTouches[0];
    joystickTouchId = touch.identifier;
    state.joystickActive = true;

    // Get joystick center
    const rect = joystickElement.getBoundingClientRect();
    joystickOrigin = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    joystickRadius = rect.width / 2;

    // Update joystick position
    updateJoystick(touch.clientX, touch.clientY);
  }

  /**
   * Handle touch move on joystick
   */
  function handleTouchMove(event: TouchEvent): void {
    if (!joystickTouchId || !joystickKnob) return;
    event.preventDefault();

    // Find the touch with matching ID
    for (const touch of event.changedTouches) {
      if (touch.identifier === joystickTouchId) {
        updateJoystick(touch.clientX, touch.clientY);
        break;
      }
    }
  }

  /**
   * Handle touch end
   */
  function handleTouchEnd(event: TouchEvent): void {
    if (!joystickTouchId) return;

    for (const touch of event.changedTouches) {
      if (touch.identifier === joystickTouchId) {
        joystickTouchId = null;
        state.joystickActive = false;
        state.joystickX = 0;
        state.joystickY = 0;
        updateDriveVector();
        notifyChange();

        // Reset knob position
        if (joystickKnob) {
          joystickKnob.style.transform = 'translate(-50%, -50%)';
        }
        break;
      }
    }
  }

  /**
   * Update joystick position based on touch coordinates
   */
  function updateJoystick(clientX: number, clientY: number): void {
    if (!joystickKnob) return;

    // Calculate offset from center
    const dx = clientX - joystickOrigin.x;
    const dy = clientY - joystickOrigin.y;

    // Calculate distance and angle
    const distance = Math.sqrt(dx * dx + dy * dy);
    const clampedDistance = Math.min(distance, joystickRadius);
    const angle = Math.atan2(dy, dx);

    // Calculate normalized joystick values (-1 to 1)
    const normalizedDistance = clampedDistance / joystickRadius;
    state.joystickX = (clampedDistance / joystickRadius) * Math.cos(angle);
    state.joystickY = (clampedDistance / joystickRadius) * Math.sin(angle);

    // Apply deadzone
    if (Math.abs(state.joystickX) < deadzone) state.joystickX = 0;
    if (Math.abs(state.joystickY) < deadzone) state.joystickY = 0;

    // Move knob visually
    const knobX = Math.cos(angle) * clampedDistance;
    const knobY = Math.sin(angle) * clampedDistance;
    joystickKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;

    // Update drive vector from joystick
    updateDriveVector();
    notifyChange();
  }

  /**
   * Update normalized drive vector from inputs
   */
  function updateDriveVector(): void {
    // Keyboard inputs
    let x = 0;
    let y = 0;

    if (state.left) x -= 1;
    if (state.right) x += 1;
    if (state.backward) y -= 1;
    if (state.forward) y += 1;

    // Joystick overrides keyboard if active
    if (state.joystickActive) {
      x = state.joystickX;
      y = state.joystickY;
    }

    // Normalize to prevent faster diagonal movement
    const magnitude = Math.sqrt(x * x + y * y);
    if (magnitude > 1) {
      x /= magnitude;
      y /= magnitude;
    }

    state.driveX = x;
    state.driveY = y;
  }

  /**
   * Notify change callback
   */
  function notifyChange(): void {
    if (onChange) {
      onChange({ ...state });
    }
  }

  /**
   * Check if an input is pressed
   */
  const isPressed = (action: keyof InputState): boolean => {
    return state[action] as unknown as boolean || false;
  };

  /**
   * Get normalized driving direction as angle in radians
   */
  const getDriveAngle = (): number => {
    return Math.atan2(state.driveX, state.driveY);
  };

  /**
   * Get drive vector magnitude
   */
  const getDriveMagnitude = (): number => {
    return Math.sqrt(state.driveX * state.driveX + state.driveY * state.driveY);
  };

  /**
   * Reset all inputs
   */
  const reset = (): void => {
    state.forward = false;
    state.backward = false;
    state.left = false;
    state.right = false;
    state.brake = false;
    state.handbrake = false;
    state.cameraLeft = false;
    state.cameraRight = false;
    state.cameraUp = false;
    state.cameraDown = false;
    state.driveX = 0;
    state.driveY = 0;
    state.joystickActive = false;
    state.joystickX = 0;
    state.joystickY = 0;
    notifyChange();
  };

  /**
   * Destroy and cleanup
   */
  const destroy = (): void => {
    window.removeEventListener('keydown', boundKeyDown);
    window.removeEventListener('keyup', boundKeyUp);

    if (joystickElement) {
      joystickElement.removeEventListener('touchstart', boundTouchStart);
      joystickElement.removeEventListener('touchmove', boundTouchMove);
      joystickElement.removeEventListener('touchend', boundTouchEnd);
      joystickElement.remove();
      joystickElement = null;
      joystickKnob = null;
    }
  };

  // Initialize on mount
  onMounted(() => {
    init();
  });

  // Cleanup on unmount
  onUnmounted(() => {
    destroy();
  });

  return {
    // Reactive state
    state,
    
    // Query methods
    isPressed,
    getDriveAngle,
    getDriveMagnitude,
    
    // Controls
    reset,
    destroy
  };
}

export default useInput;
