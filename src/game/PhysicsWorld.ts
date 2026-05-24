/**
 * PhysicsWorld.ts - Cannon-es physics world
 * Handles fixed-timestep physics simulation, material interactions, and collision detection
 */

import * as CANNON from 'cannon-es';

export interface PhysicsMaterialConfig {
  name: string;
  friction: number;
  restitution: number;
}

export interface PhysicsWorldConfig {
  gravity: number;
  fixedTimeStep: number;
  maxSubSteps: number;
  materials?: PhysicsMaterialConfig[];
}

export class PhysicsWorld {
  private world: CANNON.World;
  private fixedTimeStep: number;
  private maxSubSteps: number;
  private accumulator: number;
  private materials: Map<string, CANNON.Material>;
  private contactMaterials: Map<string, CANNON.ContactMaterial>;

  constructor(config: PhysicsWorldConfig = {
    gravity: -9.82,
    fixedTimeStep: 1 / 60,
    maxSubSteps: 10
  }) {
    // Create the physics world
    this.world = new CANNON.World();
    this.world.gravity.set(0, config.gravity, 0);
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.allowSleep = true;

    // Fixed timestep configuration
    this.fixedTimeStep = config.fixedTimeStep;
    this.maxSubSteps = config.maxSubSteps;
    this.accumulator = 0;

    // Material registry
    this.materials = new Map<string, CANNON.Material>();
    this.contactMaterials = new Map<string, CANNON.ContactMaterial>();

    // Setup default materials
    this.setupMaterials(config.materials);
  }

  /**
   * Setup physics materials and contact interactions
   */
  private setupMaterials(materialConfigs?: PhysicsMaterialConfig[]) {
    // Default materials
    const defaultMaterials: PhysicsMaterialConfig[] = [
      { name: 'ground', friction: 0.9, restitution: 0.1 },
      { name: 'vehicle', friction: 0.8, restitution: 0.05 },
      { name: 'wheel', friction: 0.95, restitution: 0.0 },
      { name: 'default', friction: 0.5, restitution: 0.3 }
    ];

    const materials = materialConfigs || defaultMaterials;

    // Create materials
    materials.forEach(matConfig => {
      const material = new CANNON.Material(matConfig.name);
      material.friction = matConfig.friction;
      material.restitution = matConfig.restitution;
      this.materials.set(matConfig.name, material);
    });

    // Create contact material table
    const materialArray = Array.from(this.materials.values());
    for (let i = 0; i < materialArray.length; i++) {
      for (let j = i; j < materialArray.length; j++) {
        const mat1 = materialArray[i];
        const mat2 = materialArray[j];
        const key = `${mat1.name}:${mat2.name}`;

        const contactMaterial = new CANNON.ContactMaterial(mat1, mat2, {
          friction: (mat1.friction + mat2.friction) / 2,
          restitution: Math.max(mat1.restitution, mat2.restitution)
        });

        this.world.addContactMaterial(contactMaterial);
        this.contactMaterials.set(key, contactMaterial);
      }
    }
  }

  /**
   * Get a physics material by name
   */
  getMaterial(name: string): CANNON.Material | undefined {
    return this.materials.get(name);
  }

  /**
   * Add a body to the physics world
   */
  addBody(body: CANNON.Body): CANNON.Body {
    this.world.addBody(body);
    return body;
  }

  /**
   * Remove a body from the physics world
   */
  removeBody(body: CANNON.Body): void {
    this.world.removeBody(body);
  }

  /**
   * Step the physics simulation with fixed timestep
   */
  step(deltaTime: number): void {
    this.accumulator += deltaTime;

    // Fixed timestep updates
    while (this.accumulator >= this.fixedTimeStep) {
      this.world.step(this.fixedTimeStep, this.fixedTimeStep, this.maxSubSteps);
      this.accumulator -= this.fixedTimeStep;
    }
  }

  /**
   * Get the underlying Cannon-es world
   */
  getWorld(): CANNON.World {
    return this.world;
  }

  /**
   * Raycast for collision detection
   */
  raycast(
    from: CANNON.Vec3,
    to: CANNON.Vec3,
    options?: {
      skipBackfaces?: boolean;
      collisionFilterMask?: number;
      collisionFilterGroup?: number;
    }
  ): CANNON.RaycastResult | null {
    const result = new CANNON.RaycastResult();
    const hasHit = this.world.raycastClosest(from, to, options, result);
    return hasHit ? result : null;
  }

  /**
   * Create a box shape helper
   */
  createBoxShape(halfExtents: [number, number, number]): CANNON.Box {
    return new CANNON.Box(new CANNON.Vec3(...halfExtents));
  }

  /**
   * Create a sphere shape helper
   */
  createSphereShape(radius: number): CANNON.Sphere {
    return new CANNON.Sphere(radius);
  }

  /**
   * Create a cylinder shape helper
   */
  createCylinderShape(radiusTop: number, radiusBottom: number, height: number, numSegments: number = 8): CANNON.Cylinder {
    return new CANNON.Cylinder(radiusTop, radiusBottom, height, numSegments);
  }

  /**
   * Create a heightfield terrain
   */
  createHeightfield(
    data: number[][],
    options: {
      scale?: [number, number, number];
      material?: CANNON.Material;
    } = {}
  ): { body: CANNON.Body; heightfield: CANNON.Heightfield } {
    const heightfield = new CANNON.Heightfield(data, {
      elementSize: options.scale?.[0] || 1
    });

    const body = new CANNON.Body({
      mass: 0 // Static
    });
    body.addShape(heightfield);
    body.position.set(
      0,
      0,
      0
    );

    if (options.material) {
      body.material = options.material;
    }

    return { body, heightfield };
  }

  /**
   * Debug: Get statistics about the physics world
   */
  getStats(): {
    bodies: number;
    contacts: number;
    constraints: number;
  } {
    return {
      bodies: this.world.bodies.length,
      contacts: this.world.contacts.length,
      constraints: this.world.constraints.length
    };
  }

  /**
   * Cleanup and dispose
   */
  dispose(): void {
    // Remove all bodies
    const bodies = [...this.world.bodies];
    bodies.forEach(body => this.world.removeBody(body));

    // Clear contact materials
    this.contactMaterials.clear();
    this.materials.clear();
  }
}
