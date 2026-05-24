/**
 * VehicleMesh.ts - Low-poly truck mesh synced to Vehicle physics body
 * Implements SceneObject interface for lifecycle management
 */

import * as THREE from 'three';
import { SceneObject } from './SceneObject';
import { Vehicle } from '../Vehicle';

export class VehicleMesh implements SceneObject {
  private mesh: THREE.Group;
  private chassisMesh: THREE.Mesh;
  private wheelMeshes: THREE.Mesh[];
  private vehicle: Vehicle;
  private scene: THREE.Scene | null;
  private registered: boolean;

  constructor(vehicle: Vehicle) {
    this.vehicle = vehicle;
    this.scene = null;
    this.registered = false;
    this.wheelMeshes = [];

    // Create the mesh group
    this.mesh = new THREE.Group();

    // Create chassis mesh
    this.chassisMesh = this.createChassisMesh();
    this.mesh.add(this.chassisMesh);

    // Create wheel meshes
    this.wheelMeshes = this.createWheelMeshes();
    this.wheelMeshes.forEach(wheel => this.mesh.add(wheel));
  }

  /**
   * Create low-poly truck chassis mesh
   */
  private createChassisMesh(): THREE.Mesh {
    // Truck body - box geometry
    const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 4);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x3366cc,
      roughness: 0.7,
      metalness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    body.castShadow = true;
    body.receiveShadow = true;

    // Truck cab - smaller box at front
    const cabGeometry = new THREE.BoxGeometry(1.8, 0.6, 1.5);
    const cabMaterial = new THREE.MeshStandardMaterial({
      color: 0x4477dd,
      roughness: 0.6,
      metalness: 0.4
    });
    const cab = new THREE.Mesh(cabGeometry, cabMaterial);
    cab.position.set(0, 1.4, -1);
    cab.castShadow = true;
    cab.receiveShadow = true;

    // Truck bed - flat box at back
    const bedGeometry = new THREE.BoxGeometry(1.9, 0.2, 2);
    const bedMaterial = new THREE.MeshStandardMaterial({
      color: 0x224488,
      roughness: 0.8,
      metalness: 0.2
    });
    const bed = new THREE.Mesh(bedGeometry, bedMaterial);
    bed.position.set(0, 1.2, 1.2);
    bed.castShadow = true;
    bed.receiveShadow = true;

    // Combine into group
    const chassisGroup = new THREE.Group();
    chassisGroup.add(body);
    chassisGroup.add(cab);
    chassisGroup.add(bed);

    // Create mesh wrapper
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    // Add the actual chassis as children
    mesh.add(chassisGroup);
    
    return mesh;
  }

  /**
   * Create low-poly wheel meshes
   */
  private createWheelMeshes(): THREE.Mesh[] {
    const wheels: THREE.Mesh[] = [];
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 12);
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.9,
      metalness: 0.1
    });

    // Create 4 wheels
    for (let i = 0; i < 4; i++) {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      wheel.receiveShadow = true;
      wheels.push(wheel);
    }

    return wheels;
  }

  /**
   * Sync mesh position and rotation to physics body
   */
  private syncWithPhysics(): void {
    // Get chassis position and rotation from physics
    const position = this.vehicle.getPosition();
    const quaternion = this.vehicle.getQuaternion();

    // Update chassis mesh
    this.chassisMesh.position.set(position.x, position.y, position.z);
    this.chassisMesh.quaternion.set(
      quaternion.x,
      quaternion.y,
      quaternion.z,
      quaternion.w
    );

    // Update wheel positions
    for (let i = 0; i < 4; i++) {
      const wheelTransform = this.vehicle.getWheelWorldTransform(i);
      const wheelMesh = this.wheelMeshes[i];
      
      if (wheelMesh) {
        wheelMesh.position.set(
          wheelTransform.position.x,
          wheelTransform.position.y,
          wheelTransform.position.z
        );
        wheelMesh.quaternion.set(
          wheelTransform.quaternion.x,
          wheelTransform.quaternion.y,
          wheelTransform.quaternion.z,
          wheelTransform.quaternion.w
        );
      }
    }
  }

  /**
   * Register the mesh with the scene
   */
  register(scene?: THREE.Scene): void {
    if (scene) {
      this.scene = scene;
    }
    
    if (this.scene && !this.registered) {
      this.scene.add(this.mesh);
      this.registered = true;
    }
  }

  /**
   * Update the mesh every frame
   * @param delta - Time elapsed since last update in seconds
   */
  update(delta: number): void {
    if (!this.registered) return;

    // Sync mesh with physics body
    this.syncWithPhysics();
  }

  /**
   * Dispose of the mesh and clean up resources
   */
  dispose(): void {
    // Remove from scene
    if (this.scene && this.registered) {
      this.scene.remove(this.mesh);
      this.registered = false;
    }

    // Dispose geometries
    this.chassisMesh.geometry.dispose();
    
    // Dispose materials
    if (Array.isArray(this.chassisMesh.material)) {
      this.chassisMesh.material.forEach(m => m.dispose());
    } else {
      this.chassisMesh.material.dispose();
    }

    // Dispose wheel geometries and materials
    this.wheelMeshes.forEach(wheel => {
      wheel.geometry.dispose();
      if (Array.isArray(wheel.material)) {
        wheel.material.forEach(m => m.dispose());
      } else {
        wheel.material.dispose();
      }
    });

    // Clear references
    this.mesh.clear();
    this.wheelMeshes = [];
    this.scene = null;
  }

  /**
   * Get the Three.js mesh group
   */
  getMesh(): THREE.Group {
    return this.mesh;
  }

  /**
   * Set the chassis color
   */
  setChassisColor(color: number): void {
    const chassisGroup = this.chassisMesh.children[0] as THREE.Group;
    if (chassisGroup && chassisGroup.children.length > 0) {
      const body = chassisGroup.children[0] as THREE.Mesh;
      if (body.material instanceof THREE.MeshStandardMaterial) {
        body.material.color.setHex(color);
      }
    }
  }

  /**
   * Check if mesh is registered with scene
   */
  isRegistered(): boolean {
    return this.registered;
  }
}
