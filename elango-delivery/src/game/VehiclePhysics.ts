/**
 * VehiclePhysics - Simple arcade vehicle physics for Elango Delivery
 * 
 * Handles acceleration, braking, steering, and friction for a fun, responsive driving feel.
 * Uses arcade physics (not realistic simulation) for smooth, game-y controls.
 */

export interface VehicleState {
  // Position (world coordinates)
  x: number
  y: number
  z: number
  
  // Velocity
  vx: number
  vy: number
  vz: number
  
  // Rotation (yaw angle in radians)
  angle: number
  
  // Angular velocity (rotation speed)
  angularVelocity: number
  
  // Speed magnitude (for display/UI)
  speed: number
}

export interface VehiclePhysicsConfig {
  // Acceleration (units per second²)
  acceleration: number
  
  // Braking/deceleration (units per second²)
  braking: number
  
  // Maximum forward speed
  maxSpeed: number
  
  // Maximum reverse speed
  maxReverseSpeed: number
  
  // Steering speed (radians per second at max speed)
  steeringSpeed: number
  
  // Linear friction (velocity multiplier per second, e.g., 0.98 = 2% loss)
  friction: number
  
  // Angular friction (rotation multiplier per second)
  angularFriction: number
  
  // Steering scales with speed (more speed = more turn radius)
  speedSteeringScale: number
  
  // Minimum speed for steering to work (prevents spinning in place)
  minSteeringSpeed: number
}

/**
 * Default arcade physics configuration
 * Tuned for fun, responsive controls
 */
export const DEFAULT_VEHICLE_CONFIG: VehiclePhysicsConfig = {
  acceleration: 8.0,           // Strong acceleration for responsive feel
  braking: 12.0,               // Braking stronger than acceleration
  maxSpeed: 15.0,              // Max forward speed
  maxReverseSpeed: -5.0,       // Max reverse speed (slower than forward)
  steeringSpeed: 2.5,          // Base steering speed
  friction: 0.95,              // Linear friction (coasting slowdown)
  angularFriction: 0.90,       // Angular friction (rotation slowdown)
  speedSteeringScale: 0.6,     // Steering effectiveness scales with speed
  minSteeringSpeed: 0.5        // Need some movement to steer effectively
}

export class VehiclePhysics {
  state: VehicleState
  config: VehiclePhysicsConfig
  
  // Input state
  private inputThrottle: number = 0  // -1 (full brake/reverse) to 1 (full throttle)
  private inputSteering: number = 0  // -1 (full left) to 1 (full right)
  
  constructor(config: Partial<VehiclePhysicsConfig> = {}) {
    this.config = { ...DEFAULT_VEHICLE_CONFIG, ...config }
    this.state = {
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      angle: 0,
      angularVelocity: 0,
      speed: 0
    }
  }
  
  /**
   * Set throttle input (-1 to 1)
   * -1 = full brake/reverse, 0 = neutral, 1 = full throttle
   */
  setThrottle(value: number): void {
    this.inputThrottle = Math.max(-1, Math.min(1, value))
  }
  
  /**
   * Set steering input (-1 to 1)
   * -1 = full left, 0 = center, 1 = full right
   */
  setSteering(value: number): void {
    this.inputSteering = Math.max(-1, Math.min(1, value))
  }
  
  /**
   * Set keyboard input state
   */
  setKeyboardInput(keys: {
    up?: boolean
    down?: boolean
    left?: boolean
    right?: boolean
  }): void {
    // Throttle: up = accelerate, down = brake/reverse
    if (keys.up && !keys.down) {
      this.inputThrottle = 1
    } else if (keys.down && !keys.up) {
      this.inputThrottle = -1
    } else if (keys.up && keys.down) {
      this.inputThrottle = 0  // Both pressed = neutral
    } else {
      this.inputThrottle = 0
    }
    
    // Steering: left/right
    if (keys.left && !keys.right) {
      this.inputSteering = -1
    } else if (keys.right && !keys.left) {
      this.inputSteering = 1
    } else {
      this.inputSteering = 0
    }
  }
  
  /**
   * Update physics state
   * @param deltaTime - Time since last update in seconds
   */
  update(deltaTime: number): void {
    const dt = Math.min(deltaTime, 0.1)  // Cap delta time to prevent instability
    
    // Apply acceleration/braking
    this.applyThrottle(dt)
    
    // Apply steering
    this.applySteering(dt)
    
    // Apply friction
    this.applyFriction(dt)
    
    // Update position from velocity
    this.updatePosition(dt)
    
    // Update rotation from angular velocity
    this.updateRotation(dt)
    
    // Calculate speed magnitude
    this.updateSpeed()
  }
  
  /**
   * Apply throttle input to velocity
   */
  private applyThrottle(dt: number): void {
    if (this.inputThrottle === 0) return
    
    // Get current forward velocity (project velocity onto facing direction)
    const forwardVx = Math.cos(this.state.angle)
    const forwardVz = Math.sin(this.state.angle)
    
    const currentForwardSpeed = 
      this.state.vx * forwardVx + 
      this.state.vz * forwardVz
    
    // Determine acceleration or braking
    let accelForce: number
    if (this.inputThrottle > 0) {
      // Accelerating forward
      accelForce = this.config.acceleration * this.inputThrottle
    } else {
      // Braking or reversing
      if (currentForwardSpeed > 0) {
        // Moving forward, apply braking
        accelForce = -this.config.braking * Math.abs(this.inputThrottle)
      } else {
        // Stationary or moving backward, apply reverse acceleration
        accelForce = this.config.acceleration * 0.5 * this.inputThrottle
      }
    }
    
    // Apply acceleration in facing direction
    this.state.vx += forwardVx * accelForce * dt
    this.state.vz += forwardVz * accelForce * dt
    
    // Clamp speed
    this.clampSpeed()
  }
  
  /**
   * Apply steering input to angular velocity
   */
  private applySteering(dt: number): void {
    if (this.inputSteering === 0) return
    
    // Steering effectiveness scales with speed
    const currentSpeed = Math.abs(this.state.vx) + Math.abs(this.state.vz)
    
    if (currentSpeed < this.config.minSteeringSpeed) {
      // Can't steer when nearly stationary (prevents spinning in place)
      return
    }
    
    // Scale steering by speed (more speed = wider turn radius)
    const speedFactor = Math.min(1, currentSpeed / this.config.maxSpeed)
    const effectiveSteering = this.config.speedSteeringScale + 
      (1 - this.config.speedSteeringScale) * speedFactor
    
    // Apply angular velocity based on steering input
    const steeringForce = this.config.steeringSpeed * 
      this.inputSteering * 
      effectiveSteering
    
    this.state.angularVelocity += steeringForce * dt
  }
  
  /**
   * Apply friction to slow down velocity and rotation
   */
  private applyFriction(dt: number): void {
    // Linear friction (exponential decay)
    const frictionFactor = Math.pow(this.config.friction, dt * 60)
    this.state.vx *= frictionFactor
    this.state.vz *= frictionFactor
    
    // Angular friction
    const angularFrictionFactor = Math.pow(this.config.angularFriction, dt * 60)
    this.state.angularVelocity *= angularFrictionFactor
    
    // Stop tiny velocities to prevent drift
    const epsilon = 0.001
    if (Math.abs(this.state.vx) < epsilon) this.state.vx = 0
    if (Math.abs(this.state.vz) < epsilon) this.state.vz = 0
    if (Math.abs(this.state.angularVelocity) < epsilon) this.state.angularVelocity = 0
  }
  
  /**
   * Update position from velocity
   */
  private updatePosition(dt: number): void {
    this.state.x += this.state.vx * dt
    this.state.z += this.state.vz * dt
    // Y position is typically controlled by terrain/physics world
  }
  
  /**
   * Update rotation from angular velocity
   */
  private updateRotation(dt: number): void {
    this.state.angle += this.state.angularVelocity * dt
    
    // Normalize angle to [-PI, PI]
    while (this.state.angle > Math.PI) {
      this.state.angle -= Math.PI * 2
    }
    while (this.state.angle < -Math.PI) {
      this.state.angle += Math.PI * 2
    }
  }
  
  /**
   * Update speed magnitude for UI/display
   */
  private updateSpeed(): void {
    this.state.speed = Math.sqrt(
      this.state.vx * this.state.vx + 
      this.state.vz * this.state.vz
    )
  }
  
  /**
   * Clamp velocity to max speed limits
   */
  private clampSpeed(): void {
    const currentSpeed = Math.sqrt(
      this.state.vx * this.state.vx + 
      this.state.vz * this.state.vz
    )
    
    let maxAllowed: number
    if (currentSpeed > 0.1) {
      // Check if moving forward or backward
      const forwardVx = Math.cos(this.state.angle)
      const forwardVz = Math.sin(this.state.angle)
      const forwardSpeed = this.state.vx * forwardVx + this.state.vz * forwardVz
      
      if (forwardSpeed >= 0) {
        maxAllowed = this.config.maxSpeed
      } else {
        maxAllowed = Math.abs(this.config.maxReverseSpeed)
      }
    } else {
      maxAllowed = this.config.maxSpeed
    }
    
    if (currentSpeed > maxAllowed) {
      const scale = maxAllowed / currentSpeed
      this.state.vx *= scale
      this.state.vz *= scale
    }
  }
  
  /**
   * Get the forward direction vector
   */
  getForwardDirection(): { x: number; z: number } {
    return {
      x: Math.cos(this.state.angle),
      z: Math.sin(this.state.angle)
    }
  }
  
  /**
   * Get the right direction vector (perpendicular to forward)
   */
  getRightDirection(): { x: number; z: number } {
    return {
      x: Math.cos(this.state.angle + Math.PI / 2),
      z: Math.sin(this.state.angle + Math.PI / 2)
    }
  }
  
  /**
   * Reset vehicle state to initial conditions
   */
  reset(position?: { x: number; y: number; z: number }, angle?: number): void {
    this.state.x = position?.x ?? 0
    this.state.y = position?.y ?? 0
    this.state.z = position?.z ?? 0
    this.state.vx = 0
    this.state.vy = 0
    this.state.vz = 0
    this.state.angle = angle ?? 0
    this.state.angularVelocity = 0
    this.state.speed = 0
    this.inputThrottle = 0
    this.inputSteering = 0
  }
  
  /**
   * Get current state (for rendering sync)
   */
  getState(): Readonly<VehicleState> {
    return this.state
  }
  
  /**
   * Set position directly (for spawning/checkpoint resets)
   */
  setPosition(x: number, y: number, z: number): void {
    this.state.x = x
    this.state.y = y
    this.state.z = z
  }
  
  /**
   * Set rotation directly
   */
  setAngle(angle: number): void {
    this.state.angle = angle
  }
  
  /**
   * Apply an impulse force (for collisions, bumps, etc.)
   * @param impulseX - X component of impulse
   * @param impulseZ - Z component of impulse
   */
  applyImpulse(impulseX: number, impulseZ: number): void {
    this.state.vx += impulseX
    this.state.vz += impulseZ
  }
  
  /**
   * Apply an angular impulse (for spinning hits)
   * @param impulse - Angular impulse in radians
   */
  applyAngularImpulse(impulse: number): void {
    this.state.angularVelocity += impulse
  }
}

export default VehiclePhysics
