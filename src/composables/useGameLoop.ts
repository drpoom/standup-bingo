/**
 * useGameLoop.ts - Reactive game loop composable
 * Provides requestAnimationFrame-based loop with delta time, pause/resume control
 */

import { ref, reactive, onMounted, onUnmounted, type Ref } from 'vue';

export interface GameLoopState {
  isRunning: boolean;
  isPaused: boolean;
  deltaTime: number;
  elapsedTime: number;
  frameCount: number;
  fps: number;
}

export interface UseGameLoopOptions {
  /** Target FPS for delta time calculation (default: 60) */
  targetFps?: number;
  /** Auto-start the loop on mount (default: true) */
  autoStart?: boolean;
  /** Callback called each frame with delta time */
  onFrame?: (deltaTime: number, elapsedTime: number) => void;
}

export function useGameLoop(options: UseGameLoopOptions = {}) {
  const {
    targetFps = 60,
    autoStart = true,
    onFrame
  } = options;

  const targetFrameTime = 1000 / targetFps;

  // Reactive state
  const state = reactive<GameLoopState>({
    isRunning: false,
    isPaused: false,
    deltaTime: 0,
    elapsedTime: 0,
    frameCount: 0,
    fps: 0
  });

  // Internal tracking
  let animationFrameId: number | null = null;
  let lastFrameTime: number = 0;
  let fpsUpdateTime: number = 0;
  let fpsFrameCount: number = 0;

  /**
   * Start the game loop
   */
  const start = (): void => {
    if (state.isRunning) return;
    
    state.isRunning = true;
    state.isPaused = false;
    lastFrameTime = performance.now();
    fpsUpdateTime = lastFrameTime;
    fpsFrameCount = 0;
    
    loop(lastFrameTime);
  };

  /**
   * Stop the game loop
   */
  const stop = (): void => {
    if (!state.isRunning) return;
    
    state.isRunning = false;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  /**
   * Pause the game loop (preserves state)
   */
  const pause = (): void => {
    if (!state.isRunning || state.isPaused) return;
    state.isPaused = true;
  };

  /**
   * Resume the game loop from pause
   */
  const resume = (): void => {
    if (!state.isRunning || !state.isPaused) return;
    state.isPaused = false;
    lastFrameTime = performance.now();
    loop(lastFrameTime);
  };

  /**
   * Toggle pause state
   */
  const togglePause = (): void => {
    if (state.isPaused) {
      resume();
    } else {
      pause();
    }
  };

  /**
   * Main animation frame loop
   */
  const loop = (currentTime: number): void => {
    if (!state.isRunning || state.isPaused) return;

    animationFrameId = requestAnimationFrame(loop);

    // Calculate delta time
    const deltaTimeMs = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    // Normalize delta time (in seconds, capped to avoid spiral of death)
    const deltaTime = Math.min(deltaTimeMs / 1000, 0.25);

    // Update elapsed time
    state.elapsedTime += deltaTime;
    state.deltaTime = deltaTime;

    // Update frame count
    state.frameCount++;
    fpsFrameCount++;

    // Calculate FPS every second
    if (currentTime - fpsUpdateTime >= 1000) {
      state.fps = fpsFrameCount;
      fpsFrameCount = 0;
      fpsUpdateTime = currentTime;
    }

    // Call frame callback
    if (onFrame) {
      onFrame(deltaTime, state.elapsedTime);
    }
  };

  /**
   * Reset the game loop state
   */
  const reset = (): void => {
    state.elapsedTime = 0;
    state.frameCount = 0;
    state.deltaTime = 0;
    fpsFrameCount = 0;
    fpsUpdateTime = performance.now();
  };

  // Auto-start on mount
  onMounted(() => {
    if (autoStart) {
      start();
    }
  });

  // Cleanup on unmount
  onUnmounted(() => {
    stop();
  });

  return {
    // Reactive state
    state,
    isRunning: (): boolean => state.isRunning,
    isPaused: (): boolean => state.isPaused,
    deltaTime: (): number => state.deltaTime,
    elapsedTime: (): number => state.elapsedTime,
    fps: (): number => state.fps,
    
    // Controls
    start,
    stop,
    pause,
    resume,
    togglePause,
    reset
  };
}

export default useGameLoop;
