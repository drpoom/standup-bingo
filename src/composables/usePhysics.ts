/**
 * usePhysics.ts - Physics bridge composable
 * Connects game loop delta time to physics world step
 */

import { ref, reactive, onMounted, onUnmounted } from 'vue';
import type { GameLoopState } from './useGameLoop';
import type { InputState } from './useInput';

export interface PhysicsConfig {
  /** Fixed timestep for physics (default: 1/60 seconds) */
  fixedTimeStep?: number;
  /** Maximum substeps per frame (default: 4) */
  maxSubSteps?: number;
  /** Physics world gravity (default: -9.81) */
  gravity?: number;
}

export interface PhysicsState {
  /** Physics is running */
  isRunning: boolean;
  /** Accumulated time not yet processed */
  accumulator: number;
  /** Current physics time */
  physicsTime: number;
  /** Number of substeps taken last frame */
  subSteps: number;
}

export interface PhysicsWorld {
  /** Step the physics simulation by deltaTime */
  step: (deltaTime: number) => void;
  /** Set gravity */
  setGravity?: (gravity: number) => void;
  /** Get gravity */
  getGravity?: () => number;
  /** Pause physics */
  pause?: () => void;
  /** Resume physics */
  resume?: () => void;
  /** Reset physics world */
  reset?: () => void;
  /** Cleanup/dispose */
  dispose?: () => void;
}

export interface CarPhysicsBody {
  /** Apply input state to physics body */
  setInputs: (inputs: Partial<InputState>) => void;
  /** Update physics body */
  update: (deltaTime: number) => void;
  /** Get position */
  getPosition?: () => { x: number; y: number; z: number };
  /** Get rotation */
  getRotation?: () => number;
  /** Get velocity */
  getVelocity?: () => { x: number; y: number; z: number };
  /** Get speed */
  getSpeed?: () => number;
  /** Reset body */
  reset?: (x?: number, y?: number, z?: number, rotation?: number) => void;
}

export interface UsePhysicsOptions extends PhysicsConfig {
  /** Physics world instance */
  world?: PhysicsWorld;
  /** Car physics body */
  car?: CarPhysicsBody;
  /** Callback after each physics step */
  onStep?: (deltaTime: number, subSteps: number) => void;
}

export function usePhysics(options: UsePhysicsOptions = {}) {
  const {
    fixedTimeStep = 1 / 60,
    maxSubSteps = 4,
    gravity = -9.81,
    world,
    car,
    onStep
  } = options;

  // Reactive physics state
  const state = reactive<PhysicsState>({
    isRunning: false,
    accumulator: 0,
    physicsTime: 0,
    subSteps: 0
  });

  // Internal state
  let isPaused = false;
  let inputState: Partial<InputState> = {};

  /**
   * Initialize physics world
   */
  const init = (): void => {
    if (world && world.setGravity) {
      world.setGravity(gravity);
    }
    state.isRunning = true;
    isPaused = false;
  };

  /**
   * Step the physics simulation
   * Called by game loop with variable deltaTime
   */
  const step = (deltaTime: number): void => {
    if (!state.isRunning || isPaused) return;

    // Clamp deltaTime to prevent spiral of death
    const clampedDeltaTime = Math.min(deltaTime, 0.25);

    // Add to accumulator
    state.accumulator += clampedDeltaTime;

    // Process fixed time steps
    let steps = 0;
    while (state.accumulator >= fixedTimeStep && steps < maxSubSteps) {
      // Apply inputs to car physics
      if (car && car.setInputs) {
        car.setInputs(inputState);
      }

      // Step physics world
      if (world) {
        world.step(fixedTimeStep);
      }

      // Step car physics
      if (car && car.update) {
        car.update(fixedTimeStep);
      }

      state.accumulator -= fixedTimeStep;
      state.physicsTime += fixedTimeStep;
      steps++;
    }

    state.subSteps = steps;

    // Notify step callback
    if (onStep) {
      onStep(deltaTime, steps);
    }
  };

  /**
   * Update input state for physics
   */
  const updateInputs = (inputs: Partial<InputState>): void => {
    inputState = { ...inputState, ...inputs };
  };

  /**
   * Set specific input
   */
  const setInput = (key: keyof InputState, value: boolean): void => {
    inputState[key] = value;
  };

  /**
   * Pause physics simulation
   */
  const pause = (): void => {
    isPaused = true;
    if (world && world.pause) {
      world.pause();
    }
  };

  /**
   * Resume physics simulation
   */
  const resume = (): void => {
    isPaused = false;
    if (world && world.resume) {
      world.resume();
    }
  };

  /**
   * Toggle pause state
   */
  const togglePause = (): void => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  /**
   * Reset physics state
   */
  const reset = (): void => {
    state.accumulator = 0;
    state.physicsTime = 0;
    state.subSteps = 0;
    inputState = {};

    if (world && world.reset) {
      world.reset();
    }

    if (car && car.reset) {
      car.reset();
    }
  };

  /**
   * Stop physics
   */
  const stop = (): void => {
    state.isRunning = false;
  };

  /**
   * Start physics
   */
  const start = (): void => {
    state.isRunning = true;
    isPaused = false;
  };

  /**
   * Get physics state
   */
  const getState = (): PhysicsState => ({ ...state });

  /**
   * Get car position (if available)
   */
  const getCarPosition = (): { x: number; y: number; z: number } | null => {
    if (car && car.getPosition) {
      return car.getPosition();
    }
    return null;
  };

  /**
   * Get car rotation (if available)
   */
  const getCarRotation = (): number | null => {
    if (car && car.getRotation) {
      return car.getRotation();
    }
    return null;
  };

  /**
   * Get car speed (if available)
   */
  const getCarSpeed = (): number | null => {
    if (car && car.getSpeed) {
      return car.getSpeed();
    }
    return null;
  };

  /**
   * Cleanup
   */
  const destroy = (): void => {
    stop();
    if (world && world.dispose) {
      world.dispose();
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
    isPaused: (): boolean => isPaused,
    
    // Core methods
    step,
    updateInputs,
    setInput,
    
    // Controls
    start,
    stop,
    pause,
    resume,
    togglePause,
    reset,
    
    // Queries
    getState,
    getCarPosition,
    getCarRotation,
    getCarSpeed,
    
    // Cleanup
    destroy
  };
}

export default usePhysics;
