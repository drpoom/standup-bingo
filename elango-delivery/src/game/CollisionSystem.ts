/**
 * CollisionSystem - Simple bounding box collision detection for Elango Delivery
 * 
 * Handles collision detection between the car and static objects (buildings, trees).
 * Uses simple AABB (Axis-Aligned Bounding Box) collision for performance.
 * When collision is detected, the car bounces off the object.
 */

import type { VehicleState } from './VehiclePhysics'

export interface BoundingBox {
  // Center position
  x: number
  z: number
  
  // Half-extents (half width and half depth)
  halfWidth: number
  halfDepth: number
}

export interface CollisionObject {
  id: string
  type: 'building' | 'tree' | 'wall' | 'obstacle'
  bounds: BoundingBox
  solid: boolean  // If true, car bounces off; if false, no collision response
}

export interface CollisionResult {
  collided: boolean
  object?: CollisionObject
  normal?: { x: number; z: number }  // Collision normal (direction to push car)
  penetration: number  // How deep the collision is
}

/**
 * Simple AABB collision detection system
 */
export class CollisionSystem {
  private objects: Map<string, CollisionObject> = new Map()
  
  // Car bounding box (approximate)
  private carHalfWidth: number = 1.0
  private carHalfDepth: number = 2.0
  
  constructor(carSize?: { halfWidth: number; halfDepth: number }) {
    if (carSize) {
      this.carHalfWidth = carSize.halfWidth
      this.carHalfDepth = carSize.halfDepth
    }
  }
  
  /**
   * Add a collision object to the world
   */
  addObject(obj: CollisionObject): void {
    this.objects.set(obj.id, obj)
  }
  
  /**
   * Remove a collision object from the world
   */
  removeObject(id: string): void {
    this.objects.delete(id)
  }
  
  /**
   * Get all collision objects
   */
  getObjects(): CollisionObject[] {
    return Array.from(this.objects.values())
  }
  
  /**
   * Check collision between car and all objects
   * Returns the first collision found (or null if no collision)
   */
  checkCollision(carState: VehicleState): CollisionResult | null {
    const carBounds = this.getCarBounds(carState)
    
    for (const obj of this.objects.values()) {
      if (!obj.solid) continue
      
      const result = this.checkAABBCollision(carBounds, obj.bounds)
      if (result.collided) {
        return {
          collided: true,
          object: obj,
          normal: result.normal,
          penetration: result.penetration
        }
      }
    }
    
    return { collided: false, penetration: 0 }
  }
  
  /**
   * Check AABB collision and return collision info
   */
  private checkAABBCollision(car: BoundingBox, obj: BoundingBox): {
    collided: boolean
    normal?: { x: number; z: number }
    penetration: number
  } {
    // Calculate overlap on each axis
    const dx = car.x - obj.x
    const dz = car.z - obj.z
    
    const combinedHalfWidth = car.halfWidth + obj.halfWidth
    const combinedHalfDepth = car.halfDepth + obj.halfDepth
    
    const overlapX = combinedHalfWidth - Math.abs(dx)
    const overlapZ = combinedHalfDepth - Math.abs(dz)
    
    // If both overlaps are positive, we have a collision
    if (overlapX > 0 && overlapZ > 0) {
      // Find the smallest penetration (collision normal direction)
      if (overlapX < overlapZ) {
        // Collision on X axis
        const normal = {
          x: dx > 0 ? 1 : -1,
          z: 0
        }
        return {
          collided: true,
          normal,
          penetration: overlapX
        }
      } else {
        // Collision on Z axis
        const normal = {
          x: 0,
          z: dz > 0 ? 1 : -1
        }
        return {
          collided: true,
          normal,
          penetration: overlapZ
        }
      }
    }
    
    return { collided: false, penetration: 0 }
  }
  
  /**
   * Get car bounding box from vehicle state
   */
  private getCarBounds(state: VehicleState): BoundingBox {
    // For simplicity, we use axis-aligned bounds
    // A more accurate approach would rotate the bounds by the car's angle
    return {
      x: state.x,
      z: state.z,
      halfWidth: this.carHalfWidth,
      halfDepth: this.carHalfDepth
    }
  }
  
  /**
   * Resolve collision by applying bounce impulse to vehicle
   * Modifies the vehicle state directly
   */
  resolveCollision(
    carState: VehicleState,
    collision: CollisionResult,
    bounceFactor: number = 0.5
  ): void {
    if (!collision.collided || !collision.normal) return
    
    const { normal, penetration } = collision
    
    // Push car out of collision
    carState.x += normal.x * penetration
    carState.z += normal.z * penetration
    
    // Reflect velocity across collision normal
    const dotProduct = carState.vx * normal.x + carState.vz * normal.z
    
    // Only bounce if moving toward the object
    if (dotProduct < 0) {
      carState.vx -= 2 * dotProduct * normal.x * bounceFactor
      carState.vz -= 2 * dotProduct * normal.z * bounceFactor
      
      // Reduce angular velocity on collision
      carState.angularVelocity *= 0.5
    }
  }
  
  /**
   * Create a building collision object
   */
  createBuilding(
    id: string,
    x: number,
    z: number,
    width: number,
    depth: number
  ): CollisionObject {
    return {
      id,
      type: 'building',
      solid: true,
      bounds: {
        x,
        z,
        halfWidth: width / 2,
        halfDepth: depth / 2
      }
    }
  }
  
  /**
   * Create a tree collision object
   */
  createTree(
    id: string,
    x: number,
    z: number,
    radius: number
  ): CollisionObject {
    // Trees are roughly circular, use square bounds for simplicity
    return {
      id,
      type: 'tree',
      solid: true,
      bounds: {
        x,
        z,
        halfWidth: radius,
        halfDepth: radius
      }
    }
  }
  
  /**
   * Create a wall collision object
   */
  createWall(
    id: string,
    x: number,
    z: number,
    width: number,
    depth: number
  ): CollisionObject {
    return {
      id,
      type: 'wall',
      solid: true,
      bounds: {
        x,
        z,
        halfWidth: width / 2,
        halfDepth: depth / 2
      }
    }
  }
  
  /**
   * Check if a point is inside any collision object
   */
  isPointInsideObject(x: number, z: number): boolean {
    for (const obj of this.objects.values()) {
      if (!obj.solid) continue
      
      const dx = Math.abs(x - obj.bounds.x)
      const dz = Math.abs(z - obj.bounds.z)
      
      if (dx <= obj.bounds.halfWidth && dz <= obj.bounds.halfDepth) {
        return true
      }
    }
    return false
  }
  
  /**
   * Clear all collision objects
   */
  clear(): void {
    this.objects.clear()
  }
}

export default CollisionSystem
