/**
 * CarPhysics.js - Car physics simulation
 * Handles acceleration, braking, turning, friction, and drifting mechanics
 */

import * as THREE from 'three';

export class CarPhysics {
  constructor(mesh) {
    this.mesh = mesh;
    
    // Position and velocity
    this.position = new THREE.Vector3(0, 0, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.acceleration = new THREE.Vector3(0, 0, 0);
    
    // Rotation
    this.rotation = 0; // Y-axis rotation in radians
    this.angularVelocity = 0;
    
    // Car properties
    this.maxSpeed = 50;
    this.maxReverseSpeed = -15;
    this.accelerationRate = 15;
    this.brakeRate = 25;
    this.friction = 0.98;
    this.airResistance = 0.995;
    this.turnSpeed = 2.5;
    this.minTurnSpeed = 0.1;
    
    // Drift mechanics
    this.isDrifting = false;
    this.driftFactor = 0.92; // How much sideways velocity is preserved
    this.grip = 0.95; // Lateral grip (lower = more drift)
    this.driftThreshold = 0.7; // Speed threshold for drift initiation
    
    // Input state
    this.inputs = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      brake: false,
      handbrake: false
    };
    
    // Ground detection
    this.onGround = true;
    this.gravity = -20;
  }

  /**
   * Set the mesh to control
   */
  setMesh(mesh) {
    this.mesh = mesh;
    return this;
  }

  /**
   * Update physics state
   */
  update(deltaTime) {
    // Normalize deltaTime (assume 60fps if not provided)
    const dt = deltaTime || (1 / 60);
    
    // Apply inputs
    this.applyAcceleration(dt);
    this.applySteering(dt);
    this.applyBraking(dt);
    
    // Apply physics
    this.applyFriction();
    this.applyAirResistance();
    this.applyDriftPhysics();
    
    // Update velocity and position
    this.velocity.add(this.acceleration.clone().multiplyScalar(dt));
    this.position.add(this.velocity.clone().multiplyScalar(dt));
    
    // Apply gravity if not on ground
    if (!this.onGround) {
      this.velocity.y += this.gravity * dt;
    }
    
    // Update mesh
    this.updateMesh();
    
    // Reset acceleration for next frame
    this.acceleration.set(0, 0, 0);
  }

  /**
   * Apply acceleration based on inputs
   */
  applyAcceleration(dt) {
    if (this.inputs.forward) {
      const forwardForce = this.accelerationRate * dt;
      this.acceleration.z += Math.cos(this.rotation) * forwardForce;
      this.acceleration.x += Math.sin(this.rotation) * forwardForce;
    }
    
    if (this.inputs.backward) {
      const reverseForce = (this.accelerationRate * 0.5) * dt;
      this.acceleration.z -= Math.cos(this.rotation) * reverseForce;
      this.acceleration.x -= Math.sin(this.rotation) * reverseForce;
    }
  }

  /**
   * Apply steering/turning
   */
  applySteering(dt) {
    // Only turn when moving
    const speed = this.getSpeed();
    if (speed < this.minTurnSpeed) return;
    
    // Adjust turn speed based on velocity (slower turns at high speed)
    const turnMultiplier = Math.max(0.5, 1 - (speed / this.maxSpeed) * 0.5);
    const effectiveTurnSpeed = this.turnSpeed * turnMultiplier * dt;
    
    if (this.inputs.left) {
      this.rotation += effectiveTurnSpeed;
      this.angularVelocity = effectiveTurnSpeed / dt;
    } else if (this.inputs.right) {
      this.rotation -= effectiveTurnSpeed;
      this.angularVelocity = -effectiveTurnSpeed / dt;
    } else {
      this.angularVelocity = 0;
    }
    
    // Normalize rotation
    this.rotation = this.rotation % (Math.PI * 2);
  }

  /**
   * Apply braking
   */
  applyBraking() {
    if (this.inputs.brake) {
      // Regular brake - stronger deceleration
      this.velocity.multiplyScalar(1 - (this.brakeRate * 0.05));
    }
    
    if (this.inputs.handbrake) {
      // Handbrake - initiates drift by reducing grip
      this.velocity.multiplyScalar(this.driftFactor);
      this.isDrifting = true;
    } else if (this.getSpeed() < 5) {
      this.isDrifting = false;
    }
  }

  /**
   * Apply friction
   */
  applyFriction() {
    // Ground friction
    this.velocity.x *= this.friction;
    this.velocity.z *= this.friction;
  }

  /**
   * Apply air resistance
   */
  applyAirResistance() {
    this.velocity.multiplyScalar(this.airResistance);
  }

  /**
   * Apply drift physics - lateral velocity preservation
   */
  applyDriftPhysics() {
    // Get forward direction
    const forward = new THREE.Vector3(
      Math.sin(this.rotation),
      0,
      Math.cos(this.rotation)
    ).normalize();
    
    // Get right direction (perpendicular to forward)
    const right = new THREE.Vector3(-forward.z, 0, forward.x).normalize();
    
    // Decompose velocity into forward and lateral components
    const speed = this.velocity.length();
    const forwardVelocity = this.velocity.dot(forward);
    const lateralVelocity = this.velocity.dot(right);
    
    // Apply grip to lateral velocity (less grip = more drift)
    const effectiveGrip = this.isDrifting ? this.grip * 0.5 : this.grip;
    const newLateralVelocity = lateralVelocity * effectiveGrip;
    
    // Reconstruct velocity
    this.velocity.copy(
      forward.multiplyScalar(forwardVelocity).add(
        right.multiplyScalar(newLateralVelocity)
      )
    );
    
    // Clamp speed
    this.clampSpeed();
  }

  /**
   * Clamp velocity to max/min speeds
   */
  clampSpeed() {
    const speed = this.getSpeed();
    if (speed > 0 && speed > this.maxSpeed) {
      this.velocity.normalize().multiplyScalar(this.maxSpeed);
    } else if (speed < 0 && speed < this.maxReverseSpeed) {
      this.velocity.normalize().multiplyScalar(this.maxReverseSpeed);
    }
  }

  /**
   * Update mesh position and rotation
   */
  updateMesh() {
    if (this.mesh) {
      this.mesh.position.copy(this.position);
      this.mesh.rotation.y = this.rotation;
    }
  }

  /**
   * Get current speed
   */
  getSpeed() {
    return Math.sqrt(
      this.velocity.x * this.velocity.x +
      this.velocity.z * this.velocity.z
    );
  }

  /**
   * Get velocity magnitude including vertical
   */
  getVelocityMagnitude() {
    return this.velocity.length();
  }

  /**
   * Set input state
   */
  setInput(input, value) {
    if (this.inputs.hasOwnProperty(input)) {
      this.inputs[input] = value;
    }
    return this;
  }

  /**
   * Set all inputs at once
   */
  setInputs(inputs) {
    Object.assign(this.inputs, inputs);
    return this;
  }

  /**
   * Reset car to starting position
   */
  reset(x = 0, y = 0, z = 0, rotation = 0) {
    this.position.set(x, y, z);
    this.velocity.set(0, 0, 0);
    this.acceleration.set(0, 0, 0);
    this.rotation = rotation;
    this.angularVelocity = 0;
    this.isDrifting = false;
    this.updateMesh();
    return this;
  }

  /**
   * Apply impulse (instant velocity change)
   */
  applyImpulse(x, y, z) {
    this.velocity.add(new THREE.Vector3(x, y, z));
    return this;
  }

  /**
   * Set position directly (for teleportation)
   */
  setPosition(x, y, z) {
    this.position.set(x, y, z);
    this.updateMesh();
    return this;
  }

  /**
   * Set rotation directly
   */
  setRotation(rotation) {
    this.rotation = rotation;
    this.updateMesh();
    return this;
  }

  /**
   * Check if car is drifting
   */
  isDriftingActive() {
    return this.isDrifting;
  }

  /**
   * Get drift intensity (0-1)
   */
  getDriftIntensity() {
    if (!this.isDrifting) return 0;
    const speed = this.getSpeed();
    return Math.min(1, speed / this.maxSpeed);
  }
}
