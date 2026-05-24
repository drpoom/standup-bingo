/**
 * CameraController.js - Third-person follow camera with smooth interpolation
 * Handles camera positioning, rotation, and smooth following of target
 */

import * as THREE from 'three';

export class CameraController {
  constructor(camera, target) {
    this.camera = camera;
    this.target = target;
    
    // Camera offset relative to target (third-person position)
    this.offset = new THREE.Vector3(0, 5, -10);
    
    // Look-at offset (where camera should point relative to target)
    this.lookAtOffset = new THREE.Vector3(0, 2, 0);
    
    // Smoothing factor for lerp (0-1, higher = faster)
    this.smoothness = 0.1;
    
    // Rotation angles (in radians)
    this.rotationY = 0; // Horizontal rotation
    this.rotationX = 0.3; // Vertical rotation (slightly looking down)
    
    // Rotation speed
    this.rotationSpeed = 0.02;
    
    // Distance from target
    this.distance = 10;
    this.minDistance = 5;
    this.maxDistance = 20;
    
    // Vertical limits
    this.minHeight = 2;
    this.maxHeight = 15;
    
    // Current interpolated position
    this.currentPosition = new THREE.Vector3();
    this.currentLookAt = new THREE.Vector3();
  }

  /**
   * Set the target object to follow
   */
  setTarget(target) {
    this.target = target;
    return this;
  }

  /**
   * Update camera position to follow target with smooth interpolation
   */
  update(deltaTime = 1) {
    if (!this.target) return;

    const targetPosition = this.getTargetPosition();
    const targetLookAt = this.getTargetLookAt();

    // Calculate desired camera position based on rotation and distance
    const desiredPosition = this.calculateDesiredPosition(targetPosition);

    // Smoothly interpolate camera position
    this.currentPosition.lerp(desiredPosition, this.smoothness * deltaTime);
    this.currentLookAt.lerp(targetLookAt, this.smoothness * deltaTime);

    // Apply position and lookAt
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  /**
   * Get the target's position (can be overridden for custom behavior)
   */
  getTargetPosition() {
    if (this.target.position) {
      return this.target.position.clone();
    }
    return new THREE.Vector3(0, 0, 0);
  }

  /**
   * Get the point the camera should look at
   */
  getTargetLookAt() {
    if (this.target.position) {
      return this.target.position.clone().add(this.lookAtOffset);
    }
    return new THREE.Vector3(0, this.lookAtOffset.y, 0);
  }

  /**
   * Calculate desired camera position based on rotation and distance
   */
  calculateDesiredPosition(targetPos) {
    const position = new THREE.Vector3();
    
    // Calculate position using spherical coordinates
    position.x = targetPos.x + this.distance * Math.sin(this.rotationY) * Math.cos(this.rotationX);
    position.y = targetPos.y + this.distance * Math.sin(this.rotationX);
    position.z = targetPos.z - this.distance * Math.cos(this.rotationY) * Math.cos(this.rotationX);

    // Clamp height
    position.y = Math.max(this.minHeight, Math.min(this.maxHeight, position.y));

    return position;
  }

  /**
   * Rotate camera horizontally (left/right)
   */
  rotateHorizontal(amount) {
    this.rotationY += amount * this.rotationSpeed;
    // Normalize to 0-2PI
    this.rotationY = this.rotationY % (Math.PI * 2);
    return this;
  }

  /**
   * Rotate camera vertically (up/down)
   */
  rotateVertical(amount) {
    this.rotationX += amount * this.rotationSpeed;
    // Clamp vertical rotation (can't go too high or low)
    this.rotationX = Math.max(0.1, Math.min(Math.PI / 2 - 0.1, this.rotationX));
    return this;
  }

  /**
   * Set camera distance from target
   */
  setDistance(distance) {
    this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, distance));
    return this;
  }

  /**
   * Zoom in
   */
  zoomIn(amount = 1) {
    return this.setDistance(this.distance - amount);
  }

  /**
   * Zoom out
   */
  zoomOut(amount = 1) {
    return this.setDistance(this.distance + amount);
  }

  /**
   * Set camera offset from target
   */
  setOffset(x, y, z) {
    this.offset.set(x, y, z);
    return this;
  }

  /**
   * Set smoothness factor (0-1)
   */
  setSmoothness(value) {
    this.smoothness = Math.max(0.01, Math.min(1, value));
    return this;
  }

  /**
   * Instantly snap camera to target (no interpolation)
   */
  snapToTarget() {
    if (!this.target) return;
    
    const targetPos = this.getTargetPosition();
    const desiredPos = this.calculateDesiredPosition(targetPos);
    const lookAtPos = this.getTargetLookAt();
    
    this.camera.position.copy(desiredPos);
    this.camera.lookAt(lookAtPos);
    this.currentPosition.copy(desiredPos);
    this.currentLookAt.copy(lookAtPos);
    
    return this;
  }

  /**
   * Set rotation angles directly
   */
  setRotation(yaw, pitch) {
    this.rotationY = yaw;
    this.rotationX = pitch;
    return this;
  }
}
