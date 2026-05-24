/**
 * MovableObject.ts - Movable physics objects (barrels, crates) that can be pushed by the vehicle
 * Implements SceneObject interface for lifecycle management
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { SceneObject } from './SceneObject';
import { PhysicsWorld } from '../PhysicsWorld';

export type MovableObjectType = 'barrel' | 'crate';

export interface MovableObjectConfig {
  type?: MovableObjectType;
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: number;
  mass?: number;
  size?: number;
}

export class MovableObject implements SceneObject {
  private mesh: THREE.Mesh | THREE.Group;
  private body: CANNON.Body;
  private scene: THREE.Scene | null;
  private registered: boolean;
  private type: MovableObjectType;
  private size: number;

  constructor(physicsWorld: PhysicsWorld, config?: MovableObjectConfig) {
    this.scene = null;
    this.registered = false;
    this.type = config?.type ?? 'barrel';
    this.size = config?.size ?? 1;

    // Create Three.js mesh based on type
    this.mesh = this.createMesh(config?.color);

    // Create Cannon-es physics body
    this.body = this.createBody(physicsWorld, config);
  }

  /**
   * Create the Three.js mesh based on object type
   */
  private createMesh(color?: number): THREE.Mesh | THREE.Group {
    if (this.type === 'barrel') {
      return this.createBarrelMesh(color);
    } else {
      return this.createCrateMesh(color);
    }
  }

  /**
   * Create barrel mesh (cylinder)
   */
  private createBarrelMesh(color?: number): THREE.Mesh {
    const radius = 0.5 * this.size;
    const height = 1.2 * this.size;
    
    // Barrel body
    const barrelGeometry = new THREE.CylinderGeometry(radius, radius, height, 16);
    const barrelMaterial = new THREE.MeshStandardMaterial({
      color: color ?? 0x8b4513, // Brown
      roughness: 0.8,
      metalness: 0.2
    });
    const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    barrel.castShadow = true;
    barrel.receiveShadow = true;

    // Add barrel rings (decorative)
    const ringGeometry = new THREE.TorusGeometry(radius + 0.02, 0.03, 8, 16);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.6,
      metalness: 0.8
    });

    const topRing = new THREE.Mesh(ringGeometry, ringMaterial);
    topRing.rotation.x = Math.PI / 2;
    topRing.position.y = height / 2 - 0.15;
    topRing.castShadow = true;

    const bottomRing = new THREE.Mesh(ringGeometry, ringMaterial);
    bottomRing.rotation.x = Math.PI / 2;
    bottomRing.position.y = -height / 2 + 0.15;
    bottomRing.castShadow = true;

    // Group all parts
    const group = new THREE.Group();
    group.add(barrel);
    group.add(topRing);
    group.add(bottomRing);

    // Wrap in a mesh for consistent interface
    const wrapperGeometry = new THREE.BoxGeometry(1, 1, 1);
    const wrapperMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0
    });
    const wrapper = new THREE.Mesh(wrapperGeometry, wrapperMaterial);
    wrapper.add(group);
    
    return wrapper;
  }

  /**
   * Create crate mesh (box)
   */
  private createCrateMesh(color?: number): THREE.Mesh {
    const crateSize = this.size;
    
    // Crate body
    const crateGeometry = new THREE.BoxGeometry(crateSize, crateSize, crateSize);
    const crateMaterial = new THREE.MeshStandardMaterial({
      color: color ?? 0xcd853f, // Peru/wood color
      roughness: 0.9,
      metalness: 0.1
    });
    const crate = new THREE.Mesh(crateGeometry, crateMaterial);
    crate.castShadow = true;
    crate.receiveShadow = true;

    // Add crate slats (decorative lines)
    const slatMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b6914,
      roughness: 0.8,
      metalness: 0.2
    });

    // Create slat geometry
    const slatThickness = 0.05 * crateSize;
    const slatWidth = 0.15 * crateSize;
    const slatLength = crateSize + 0.02;

    // Horizontal slats
    for (let i = 0; i < 3; i++) {
      const y = -crateSize / 2 + (i + 1) * (crateSize / 4);
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(slatLength, slatThickness, slatThickness),
        slatMaterial
      );
      slat.position.set(0, y, 0);
      slat.castShadow = true;
      crate.add(slat);
    }

    // Vertical slats
    for (let i = 0; i < 2; i++) {
      const x = -crateSize / 2 + (i + 1) * (crateSize / 3);
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(slatThickness, slatThickness, slatLength),
        slatMaterial
      );
      slat.position.set(x, 0, 0);
      slat.castShadow = true;
      crate.add(slat);
    }

    // Wrap in a mesh for consistent interface
    const wrapperGeometry = new THREE.BoxGeometry(1, 1, 1);
    const wrapperMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0
    });
    const wrapper = new THREE.Mesh(wrapperGeometry, wrapperMaterial);
    wrapper.add(crate);
    
    return wrapper;
  }

  /**
   * Create the Cannon-es physics body
   */
  private createBody(physicsWorld: PhysicsWorld, config?: MovableObjectConfig): CANNON.Body {
    const mass = config?.mass ?? (this.type === 'barrel' ? 50 : 40);
    const material = physicsWorld.getMaterial('default');

    let shape: CANNON.Shape;
    
    if (this.type === 'barrel') {
      // Cylinder shape for barrel
      const radius = 0.5 * this.size;
      const height = 1.2 * this.size;
      shape = new CANNON.Cylinder(radius, radius, height, 16);
    } else {
      // Box shape for crate
      const halfSize = (this.size / 2);
      shape = new CANNON.Box(new CANNON.Vec3(halfSize, halfSize, halfSize));
    }

    const body = new CANNON.Body({
      mass: mass,
      material: material ?? undefined
    });

    body.addShape(shape);

    // Set position
    const position = config?.position ?? [0, 2, 0];
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

    // Allow sleeping for performance
    body.allowSleep = true;
    body.sleepSpeedLimit = 0.5;
    body.sleepTimeLimit = 1;

    body.name = `MovableObject_${this.type}`;

    return body;
  }

  /**
   * Register the object with the scene and physics world
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
   * Update the object every frame
   * @param delta - Time elapsed since last update in seconds
   */
  update(delta: number): void {
    if (!this.registered) return;

    // Sync visual mesh with physics body
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

    // Dispose geometries and materials
    this.disposeMesh(this.mesh);

    // Clear shapes from body
    this.body.shapes = [];

    // Clear references
    this.scene = null;
  }

  /**
   * Helper to dispose mesh resources recursively
   */
  private disposeMesh(mesh: THREE.Mesh | THREE.Group): void {
    if (mesh instanceof THREE.Group) {
      mesh.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        } else if (child instanceof THREE.Group) {
          this.disposeMesh(child);
        }
      });
    } else if (mesh instanceof THREE.Mesh) {
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }
  }

  /**
   * Get the Three.js mesh
   */
  getMesh(): THREE.Mesh | THREE.Group {
    return this.mesh;
  }

  /**
   * Get the Cannon-es physics body
   */
  getBody(): CANNON.Body {
    return this.body;
  }

  /**
   * Check if object is registered with scene
   */
  isRegistered(): boolean {
    return this.registered;
  }

  /**
   * Set the object color
   */
  setColor(color: number): void {
    if (this.mesh instanceof THREE.Group) {
      // Find the main mesh in the group
      const mainMesh = this.mesh.children[0] as THREE.Mesh;
      if (mainMesh && mainMesh.material instanceof THREE.MeshStandardMaterial) {
        mainMesh.material.color.setHex(color);
      }
    } else if (this.mesh.material instanceof THREE.MeshStandardMaterial) {
      this.mesh.material.color.setHex(color);
    }
  }

  /**
   * Apply an impulse to the object
   */
  applyImpulse(impulse: [number, number, number], point?: [number, number, number]): void {
    const impulseVec = new CANNON.Vec3(...impulse);
    if (point) {
      const pointVec = new CANNON.Vec3(...point);
      this.body.applyImpulse(impulseVec, pointVec);
    } else {
      this.body.applyImpulse(impulseVec, this.body.position);
    }
  }

  /**
   * Get the object type
   */
  getType(): MovableObjectType {
    return this.type;
  }

  /**
   * Get the object size
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Get the object mass
   */
  getMass(): number {
    return this.body.mass;
  }
}
