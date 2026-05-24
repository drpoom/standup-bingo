/**
 * GroundPlane.ts - Large ground plane with Three.js mesh and Cannon-es physics
 * Implements SceneObject interface for lifecycle management
 * Size: 1000x1000 units
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { SceneObject } from './SceneObject';
import { PhysicsWorld } from '../PhysicsWorld';

export interface GroundPlaneConfig {
  size?: number;
  color?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  material?: CANNON.Material;
}

export class GroundPlane implements SceneObject {
  private mesh: THREE.Mesh;
  private body: CANNON.Body;
  private scene: THREE.Scene | null;
  private registered: boolean;
  private size: number;

  constructor(physicsWorld: PhysicsWorld, config?: GroundPlaneConfig) {
    this.scene = null;
    this.registered = false;
    this.size = config?.size ?? 1000;

    // Create Three.js mesh
    this.mesh = this.createMesh(config?.color ?? 0x3d8c40);

    // Create Cannon-es physics body
    this.body = this.createBody(physicsWorld, config);
  }

  /**
   * Create the Three.js ground plane mesh
   */
  private createMesh(color: number): THREE.Mesh {
    // Large plane geometry (1000x1000 units)
    const geometry = new THREE.PlaneGeometry(this.size, this.size);

    // Green ground material
    const material = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    mesh.receiveShadow = true;
    mesh.name = 'GroundPlane';

    return mesh;
  }

  /**
   * Create the Cannon-es static physics body
   */
  private createBody(physicsWorld: PhysicsWorld, config?: GroundPlaneConfig): CANNON.Body {
    // Get ground material from physics world
    const groundMaterial = config?.material ?? physicsWorld.getMaterial('ground');

    // Create box shape for ground (half extents)
    const halfSize = this.size / 2;
    const thickness = 0.1;
    const groundShape = new CANNON.Box(new CANNON.Vec3(halfSize, thickness, halfSize));

    // Create static body (mass = 0)
    const body = new CANNON.Body({
      mass: 0, // Static body
      material: groundMaterial
    });

    body.addShape(groundShape);

    // Set position (default at y=0, slightly below visual mesh)
    const position = config?.position ?? [0, -thickness, 0];
    body.position.set(position[0], position[1], position[2]);

    // Set rotation if specified
    if (config?.rotation) {
      const euler = new CANNON.Vec3(
        config.rotation[0] ?? 0,
        config.rotation[1] ?? 0,
        config.rotation[2] ?? 0
      );
      const quaternion = new CANNON.Quaternion();
      quaternion.setFromEuler(euler.x, euler.y, euler.z);
      body.quaternion.copy(quaternion);
    }

    body.name = 'GroundPlane';

    return body;
  }

  /**
   * Register the mesh with the scene and body with physics world
   */
  register(scene?: THREE.Scene, physics?: PhysicsWorld): void {
    if (scene) {
      this.scene = scene;
    }

    if (this.scene && !this.registered) {
      this.scene.add(this.mesh);
      this.registered = true;
    }

    if (physics) {
      physics.addBody(this.body);
    }
  }

  /**
   * Update the ground plane (static, so minimal update needed)
   * @param delta - Time elapsed since last update in seconds
   */
  update(delta: number): void {
    // Ground is static, no update needed
    // Sync visual mesh position with physics body (in case it was modified)
    this.mesh.position.copy(this.body.position as any);
    this.mesh.quaternion.copy(this.body.quaternion as any);
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

    // Dispose geometry and material
    this.mesh.geometry.dispose();
    if (Array.isArray(this.mesh.material)) {
      this.mesh.material.forEach(m => m.dispose());
    } else {
      this.mesh.material.dispose();
    }

    // Remove body from physics world (handled by caller)
    this.body.shapes = [];

    // Clear references
    this.scene = null;
  }

  /**
   * Get the Three.js mesh
   */
  getMesh(): THREE.Mesh {
    return this.mesh;
  }

  /**
   * Get the Cannon-es physics body
   */
  getBody(): CANNON.Body {
    return this.body;
  }

  /**
   * Check if ground plane is registered with scene
   */
  isRegistered(): boolean {
    return this.registered;
  }

  /**
   * Set the ground color
   */
  setColor(color: number): void {
    if (this.mesh.material instanceof THREE.MeshStandardMaterial) {
      this.mesh.material.color.setHex(color);
    }
  }

  /**
   * Get the size of the ground plane
   */
  getSize(): number {
    return this.size;
  }
}
