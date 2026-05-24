<template>
  <div class="game-canvas-container" ref="container">
    <canvas ref="canvas"></canvas>
    <!-- Touch joystick container -->
    <div id="joystick-container" v-if="enableTouch"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { SceneManager } from '../../game/SceneManager';
import { CameraController } from '../../game/CameraController';
import { PhysicsWorld } from '../../game/PhysicsWorld';
import { Vehicle } from '../../game/Vehicle';
import { VehicleMesh } from '../../game/entities/VehicleMesh';
import { GroundPlane } from '../../game/entities/GroundPlane';
import { useGameLoop } from '../../composables/useGameLoop';
import { useInput } from '../../composables/useInput';
import { usePhysics } from '../../composables/usePhysics';

// Props
interface Props {
  width?: number;
  height?: number;
  autoStart?: boolean;
  enableTouch?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: 0,
  height: 0,
  autoStart: true,
  enableTouch: true
});

// Emits
const emit = defineEmits<{
  (e: 'ready'): void;
  (e: 'update', deltaTime: number): void;
  (e: 'error', error: Error): void;
}>();

// Refs
const container = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

// Game state
let sceneManager: SceneManager | null = null;
let physicsWorld: PhysicsWorld | null = null;
let vehicle: Vehicle | null = null;
let vehicleMesh: VehicleMesh | null = null;
let cameraController: CameraController | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let groundPlane: GroundPlane | null = null;

// Composables
const gameLoop = useGameLoop({
  targetFps: 60,
  autoStart: false,
  onFrame: (deltaTime, elapsedTime) => {
    updateGame(deltaTime);
  }
});

const input = useInput({
  enableTouch: props.enableTouch,
  joystickContainerId: 'joystick-container',
  deadzone: 0.1,
  onChange: (state) => {
    // Update vehicle inputs from input state
    updateVehicleInputs(state);
  }
});

const physics = usePhysics({
  fixedTimeStep: 1 / 60,
  maxSubSteps: 4,
  gravity: -9.82,
  world: undefined, // Will be set after physicsWorld is created
  onStep: (deltaTime, subSteps) => {
    // Physics step callback
  }
});

// Update vehicle inputs from input state
function updateVehicleInputs(inputState: any): void {
  if (!vehicle) return;

  // Calculate steering from left/right inputs
  let steerValue = 0;
  if (inputState.left) steerValue -= 1;
  if (inputState.right) steerValue += 1;
  vehicle.setSteering(steerValue);

  // Calculate throttle from forward/backward inputs
  let throttleValue = 0;
  if (inputState.forward) throttleValue += 1;
  if (inputState.backward) throttleValue -= 1;
  vehicle.setThrottle(throttleValue);

  // Apply brake
  const brakeValue = inputState.brake || inputState.handbrake ? 1 : 0;
  vehicle.setBrake(brakeValue);
}

// Initialize game
function initGame(): void {
  if (!container.value || !canvas.value) return;

  try {
    // Initialize scene manager
    sceneManager = new SceneManager({
      antialias: true,
      shadowMapEnabled: true,
      clearColor: 0x87ceeb // Sky blue
    });
    sceneManager.init(container.value);

    // Create camera
    camera = new THREE.PerspectiveCamera(
      75,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, -15);
    sceneManager.setCamera(camera);

    // Initialize physics world
    physicsWorld = new PhysicsWorld({
      gravity: -9.82,
      fixedTimeStep: 1 / 60,
      maxSubSteps: 10
    });

    // Create vehicle
    vehicle = new Vehicle(physicsWorld, {
      chassis: {
        mass: 1500,
        halfExtents: [1, 0.5, 2],
        position: [0, 2, 0]
      },
      wheels: {
        front: {
          radius: 0.4,
          suspensionStiffness: 30,
          suspensionRestLength: 0.3,
          frictionSlip: 1.4,
          dampingRelaxation: 2.3,
          dampingCompression: 4.4,
          maxSuspensionForce: 100000,
          maxSuspensionTravel: 0.3,
          rollInfluence: 0.2,
          isFrontWheel: true
        },
        rear: {
          radius: 0.4,
          suspensionStiffness: 30,
          suspensionRestLength: 0.3,
          frictionSlip: 1.4,
          dampingRelaxation: 2.3,
          dampingCompression: 4.4,
          maxSuspensionForce: 100000,
          maxSuspensionTravel: 0.3,
          rollInfluence: 0.2,
          isFrontWheel: false
        }
      },
      wheelPositions: {
        frontLeft: [-1, -0.5, 1.2],
        frontRight: [1, -0.5, 1.2],
        rearLeft: [-1, -0.5, -1.2],
        rearRight: [1, -0.5, -1.2]
      },
      engineForce: 2000,
      maxBrakeForce: 100,
      steeringClamp: 0.5
    });

    // Create vehicle mesh
    vehicleMesh = new VehicleMesh(vehicle);
    vehicleMesh.register(sceneManager.getScene());

    // Create camera controller
    cameraController = new CameraController(camera, {
      offset: new THREE.Vector3(0, 5, -10),
      smoothness: 0.1,
      distance: 10,
      height: 5
    });

    // Create ground plane
    createGround();

    // Add lights
    createLights();

    // Notify ready
    emit('ready');

    // Auto-start if enabled
    if (props.autoStart) {
      startGame();
    }
  } catch (error) {
    emit('error', error instanceof Error ? error : new Error(String(error)));
  }
}

// Create ground plane with physics
function createGround(): void {
  if (!sceneManager || !physicsWorld) return;

  // Create ground plane entity (1000x1000 units, green material)
  groundPlane = new GroundPlane(physicsWorld, {
    size: 1000,
    color: 0x3d8c40, // Green color
    position: [0, -0.05, 0]
  });
  groundPlane.register(sceneManager.getScene(), physicsWorld);
}

// Create lights
function createLights(): void {
  if (!sceneManager) return;

  // Ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  sceneManager.addToScene(ambientLight);

  // Directional light (sun)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(50, 100, 50);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.left = -50;
  directionalLight.shadow.camera.right = 50;
  directionalLight.shadow.camera.top = 50;
  directionalLight.shadow.camera.bottom = -50;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  sceneManager.addToScene(directionalLight);
}

// Update game state
function updateGame(deltaTime: number): void {
  if (!sceneManager || !physicsWorld || !vehicle || !vehicleMesh || !cameraController) return;

  // Step physics
  physicsWorld.step(deltaTime);

  // Update vehicle physics
  vehicle.update(deltaTime);

  // Update vehicle mesh (syncs with physics)
  vehicleMesh.update(deltaTime);

  // Update camera to follow vehicle
  const chassisBody = vehicle.getChassisBody();
  cameraController.update(chassisBody.position, chassisBody.rotation);

  // Render scene
  sceneManager.render();

  // Emit update event
  emit('update', deltaTime);
}

// Start game loop
function startGame(): void {
  gameLoop.start();
}

// Stop game loop
function stopGame(): void {
  gameLoop.stop();
}

// Pause game
function pauseGame(): void {
  gameLoop.pause();
}

// Resume game
function resumeGame(): void {
  gameLoop.resume();
}

// Handle window resize
function handleResize(): void {
  if (!sceneManager || !container.value) return;
  
  const width = props.width || container.value.clientWidth;
  const height = props.height || container.value.clientHeight;
  
  sceneManager.resize(width, height);
}

// Lifecycle
onMounted(() => {
  initGame();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  stopGame();
  
  // Cleanup
  if (groundPlane) {
    groundPlane.dispose();
  }
  if (vehicleMesh) {
    vehicleMesh.dispose();
  }
  if (vehicle) {
    vehicle.dispose();
  }
  if (physicsWorld) {
    physicsWorld.dispose();
  }
  if (sceneManager) {
    sceneManager.dispose();
  }
  input.destroy();
  
  window.removeEventListener('resize', handleResize);
});

// Watch for size changes
watch(() => [props.width, props.height], () => {
  handleResize();
});

// Expose methods for parent components
defineExpose({
  startGame,
  stopGame,
  pauseGame,
  resumeGame,
  getSceneManager: () => sceneManager,
  getPhysicsWorld: () => physicsWorld,
  getVehicle: () => vehicle,
  getCameraController: () => cameraController,
  getInput: () => input.state
});
</script>

<style scoped>
.game-canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.game-canvas-container canvas {
  display: block;
  width: 100%;
  height: 100%;
}

#joystick-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
