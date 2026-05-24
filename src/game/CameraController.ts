/**
 * CameraController.ts - Third-person chase camera with smooth follow
 * Handles camera positioning, rotation, and smooth following of vehicle
 */

import * as THREE from 'three';

export interface CameraControllerOptions {
  offset?: THREE.Vector3;
  smoothness?: number;
  distance?: number;
  minDistance?: number;
  maxDistance?: number;
  height?: number;
  minHeight?: number;
  maxHeight?: number;
}

export class CameraController {
  camera: THREE.Camera;
  
  // Camera offset behind vehicle (third-person position)
  offset: THREE.Vector3;
  
  // Smoothing factor for lerp (0-1, higher = faster)
  smoothness: number;
  
  // Distance from vehicle
  distance: number;
  minDistance: number;
  maxDistance: number;
  
  // Vertical limits
  height: number;
  minHeight: number;
  maxHeight: number;
  
  // Current interpolated position
  currentPosition: THREE.Vector3;
  currentLookAt: THREE.Vector3;

  constructor(camera: THREE.Camera, options?: CameraControllerOptions) {
    this.camera = camera;
    
    // Camera offset behind vehicle (third-person chase camera)
    this.offset = options?.offset || new THREE.Vector3(0, 5, -10);
    
    // Smoothing factor for lerp (0-1, higher = faster)
    this.smoothness = options?.smoothness ?? 0.1;
    
    // Distance from vehicle
    this.distance = options?.distance ?? 10;
    this.minDistance = options?.minDistance ?? 5;
    this.maxDistance = options?.maxDistance ?? 20;
    
    // Camera height
    this.height = options?.height ?? 5;
    this.minHeight = options?.minHeight ?? 2;
    this.maxHeight = options?.maxHeight ?? 15;
    
    // Current interpolated position
    this.currentPosition = new THREE.Vector3();
    this.currentLookAt = new THREE.Vector3();
  }

  /**
   * Update camera position to follow vehicle with smooth interpolation
   * @param vehiclePosition - The vehicle's world position
   * @param vehicleRotation - The vehicle's rotation (Euler angles in radians)
   */
  update(vehiclePosition: THREE.Vector3, vehicleRotation: THREE.Euler): void {
    // Calculate desired camera position based on vehicle rotation and offset
    const desiredPosition = this.calculateDesiredPosition(vehiclePosition, vehicleRotation);
    const desiredLookAt = this.calculateLookAt(vehiclePosition, vehicleRotation);

    // Smoothly interpolate camera position using lerp
    this.currentPosition.lerp(desiredPosition, this.smoothness);
    this.currentLookAt.lerp(desiredLookAt, this.smoothness);

    // Apply position and lookAt to camera
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  /**
   * Calculate desired camera position based on vehicle position and rotation
   */
  private calculateDesiredPosition(vehiclePosition: THREE.Vector3, vehicleRotation: THREE.Euler): THREE.Vector3 {
    // Create rotation matrix from vehicle's Y rotation (yaw)
    const yaw = vehicleRotation.y;
    
    // Calculate camera position behind and above the vehicle
    const offsetX = this.offset.x * Math.cos(yaw) - this.offset.z * Math.sin(yaw);
    const offsetZ = this.offset.x * Math.sin(yaw) + this.offset.z * Math.cos(yaw);
    
    const position = new THREE.Vector3(
      vehiclePosition.x + offsetX,
      vehiclePosition.y + this.clampHeight(this.offset.y),
      vehiclePosition.z + offsetZ
    );
    
    return position;
  }

  /**
   * Calculate the point the camera should look at (slightly ahead of vehicle)
   */
  private calculateLookAt(vehiclePosition: THREE.Vector3, vehicleRotation: THREE.Euler): THREE.Vector3 {
    // Look at a point slightly ahead and above the vehicle
    const lookAheadDistance = 5;
    const yaw = vehicleRotation.y;
    
    const lookAtX = vehiclePosition.x + lookAheadDistance * Math.sin(yaw);
    const lookAtZ = vehiclePosition.z + lookAheadDistance * Math.cos(yaw);
    
    return new THREE.Vector3(
      lookAtX,
      vehiclePosition.y + 2,
      lookAtZ
    );
  }

  /**
   * Clamp height within min/max bounds
   */
  private clampHeight(height: number): number {
    return Math.max(this.minHeight, Math.min(this.maxHeight, height));
  }

  /**
   * Set camera offset from vehicle
   */
  setOffset(x: number, y: number, z: number): this {
    this.offset.set(x, y, z);
    return this;
  }

  /**
   * Set smoothness factor (0-1)
   */
  setSmoothness(value: number): this {
    this.smoothness = Math.max(0.01, Math.min(1, value));
    return this;
  }

  /**
   * Set camera distance from vehicle
   */
  setDistance(distance: number): this {
    this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, distance));
    return this;
  }

  /**
   * Zoom in
   */
  zoomIn(amount: number = 1): this {
    return this.setDistance(this.distance - amount);
  }

  /**
   * Zoom out
   */
  zoomOut(amount: number = 1): this {
    return this.setDistance(this.distance + amount);
  }

  /**
   * Instantly snap camera to vehicle (no interpolation)
   */
  snapToVehicle(vehiclePosition: THREE.Vector3, vehicleRotation: THREE.Euler): void {
    const desiredPos = this.calculateDesiredPosition(vehiclePosition, vehicleRotation);
    const lookAtPos = this.calculateLookAt(vehiclePosition, vehicleRotation);
    
    this.camera.position.copy(desiredPos);
    this.camera.lookAt(lookAtPos);
    this.currentPosition.copy(desiredPos);
    this.currentLookAt.copy(lookAtPos);
  }
}
