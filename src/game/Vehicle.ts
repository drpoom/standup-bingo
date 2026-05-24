/**
 * Vehicle.ts - Raycast vehicle with Cannon-es
 * Handles vehicle physics, wheel suspension, and drive mechanics
 */

import * as CANNON from 'cannon-es';
import { PhysicsWorld } from './PhysicsWorld';

export interface WheelConfig {
  radius: number;
  suspensionStiffness: number;
  suspensionRestLength: number;
  frictionSlip: number;
  dampingRelaxation: number;
  dampingCompression: number;
  maxSuspensionForce: number;
  maxSuspensionTravel: number;
  rollInfluence: number;
  isFrontWheel: boolean;
}

export interface VehicleConfig {
  chassis: {
    mass: number;
    halfExtents: [number, number, number];
    position?: [number, number, number];
  };
  wheels: {
    front: WheelConfig;
    rear: WheelConfig;
  };
  wheelPositions: {
    frontLeft: [number, number, number];
    frontRight: [number, number, number];
    rearLeft: [number, number, number];
    rearRight: [number, number, number];
  };
  engineForce: number;
  maxBrakeForce: number;
  steeringClamp: number;
}

export class Vehicle {
  private physicsWorld: PhysicsWorld;
  private vehicle: CANNON.RaycastVehicle;
  private chassisBody: CANNON.Body;
  private wheelBodies: CANNON.Body[];
  private config: VehicleConfig;
  private steeringValue: number;
  private engineForceValue: number;
  private brakeForceValue: number;

  constructor(physicsWorld: PhysicsWorld, config: VehicleConfig) {
    this.physicsWorld = physicsWorld;
    this.config = config;
    this.wheelBodies = [];
    this.steeringValue = 0;
    this.engineForceValue = 0;
    this.brakeForceValue = 0;

    // Create chassis body
    this.chassisBody = this.createChassis();

    // Create raycast vehicle
    this.vehicle = new CANNON.RaycastVehicle({
      chassisBody: this.chassisBody
    });

    // Add wheels
    this.addWheels();

    // Add vehicle to physics world
    this.vehicle.addToWorld(physicsWorld.getWorld());

    // Setup wheel collision
    this.setupWheelCollision();
  }

  /**
   * Create the chassis body
   */
  private createChassis(): CANNON.Body {
    const { chassis } = this.config;
    
    const shape = new CANNON.Box(new CANNON.Vec3(...chassis.halfExtents));
    
    const body = new CANNON.Body({
      mass: chassis.mass,
      material: this.physicsWorld.getMaterial('vehicle')
    });
    
    body.addShape(shape);
    body.position.set(
      chassis.position?.[0] ?? 0,
      chassis.position?.[1] ?? 2,
      chassis.position?.[2] ?? 0
    );
    
    body.angularVelocity.set(0, 0, 0);
    body.updateMassProperties();
    
    return body;
  }

  /**
   * Add wheels to the vehicle
   */
  private addWheels(): void {
    const { wheels, wheelPositions } = this.config;

    // Wheel options helper
    const createWheelOptions = (pos: [number, number, number], isFront: boolean): CANNON.RaycastVehicle.WheelOptions => {
      const wheelConfig = isFront ? wheels.front : wheels.rear;
      
      return {
        chassisConnectionPointLocal: new CANNON.Vec3(...pos),
        axisLocal: new CANNON.Vec3(0, -1, 0),
        directionLocal: new CANNON.Vec3(0, -1, 0),
        suspensionStiffness: wheelConfig.suspensionStiffness,
        suspensionRestLength: wheelConfig.suspensionRestLength,
        frictionSlip: wheelConfig.frictionSlip,
        dampingRelaxation: wheelConfig.dampingRelaxation,
        dampingCompression: wheelConfig.dampingCompression,
        maxSuspensionForce: wheelConfig.maxSuspensionForce,
        maxSuspensionTravel: wheelConfig.maxSuspensionTravel,
        rollInfluence: wheelConfig.rollInfluence,
        isFrontWheel: isFront,
        useCustomWheelTransform: false
      };
    };

    // Add each wheel
    this.vehicle.addWheel(createWheelOptions(wheelPositions.frontLeft, true));
    this.vehicle.addWheel(createWheelOptions(wheelPositions.frontRight, true));
    this.vehicle.addWheel(createWheelOptions(wheelPositions.rearLeft, false));
    this.vehicle.addWheel(createWheelOptions(wheelPositions.rearRight, false));
  }

  /**
   * Setup wheel collision filtering
   */
  private setupWheelCollision(): void {
    const world = this.physicsWorld.getWorld();
    
    // Wheel collision filter groups
    const chassisGroup = 1;
    const wheelGroup = 2;
    const groundGroup = 4;

    this.chassisBody.collisionFilterGroup = chassisGroup;
    this.chassisBody.collisionFilterMask = groundGroup | wheelGroup;

    // Wheels only collide with ground
    for (let i = 0; i < this.vehicle.wheelInfos.length; i++) {
      const wheelBody = this.vehicle.wheelBodies[i];
      if (wheelBody) {
        wheelBody.collisionFilterGroup = wheelGroup;
        wheelBody.collisionFilterMask = groundGroup;
      }
    }
  }

  /**
   * Update vehicle physics
   */
  update(deltaTime: number): void {
    // Apply steering
    if (this.config.wheels.front) {
      this.vehicle.setSteeringValue(this.steeringValue, 0);
      this.vehicle.setSteeringValue(this.steeringValue, 1);
    }

    // Apply engine force to rear wheels (RWD) or all wheels (AWD)
    const driveWheelIndices = [2, 3]; // Rear wheels
    driveWheelIndices.forEach(index => {
      this.vehicle.applyEngineForce(this.engineForceValue, index);
    });

    // Apply braking
    for (let i = 0; i < 4; i++) {
      this.vehicle.setBrake(this.brakeForceValue, i);
    }

    // Sync wheel visuals
    for (let i = 0; i < this.vehicle.wheelInfos.length; i++) {
      this.vehicle.updateWheelTransform(i);
    }
  }

  /**
   * Set steering input (-1 to 1)
   */
  setSteering(value: number): void {
    const clamped = Math.max(-1, Math.min(1, value));
    this.steeringValue = clamped * this.config.steeringClamp;
  }

  /**
   * Steer the vehicle (-1 to 1)
   * Alias for setSteering
   */
  steer(value: number): void {
    this.setSteering(value);
  }

  /**
   * Set throttle input (-1 to 1, negative for reverse)
   */
  setThrottle(value: number): void {
    const clamped = Math.max(-1, Math.min(1, value));
    this.engineForceValue = clamped * this.config.engineForce;
  }

  /**
   * Accelerate the vehicle (-1 to 1, negative for reverse)
   * Alias for setThrottle
   */
  accelerate(value: number): void {
    this.setThrottle(value);
  }

  /**
   * Set brake input (0 to 1)
   */
  setBrake(value: number): void {
    const clamped = Math.max(0, Math.min(1, value));
    this.brakeForceValue = clamped * this.config.maxBrakeForce;
  }

  /**
   * Apply brake (0 to 1)
   * Alias for setBrake
   */
  brake(value: number): void {
    this.setBrake(value);
  }

  /**
   * Get chassis body
   */
  getChassisBody(): CANNON.Body {
    return this.chassisBody;
  }

  /**
   * Get vehicle
   */
  getVehicle(): CANNON.RaycastVehicle {
    return this.vehicle;
  }

  /**
   * Get wheel info at index
   */
  getWheelInfo(index: number): CANNON.WheelInfo {
    return this.vehicle.wheelInfos[index];
  }

  /**
   * Get wheel world transform
   */
  getWheelWorldTransform(index: number): {
    position: CANNON.Vec3;
    quaternion: CANNON.Quaternion;
  } {
    const wheel = this.vehicle.wheelInfos[index];
    const transform = this.vehicle.getWheelTransformWorld(index);
    
    return {
      position: transform.position.clone(),
      quaternion: transform.quaternion.clone()
    };
  }

  /**
   * Get vehicle speed
   */
  getSpeed(): number {
    return this.chassisBody.velocity.length();
  }

  /**
   * Get vehicle velocity
   */
  getVelocity(): CANNON.Vec3 {
    return this.chassisBody.velocity.clone();
  }

  /**
   * Get chassis position
   */
  getPosition(): CANNON.Vec3 {
    return this.chassisBody.position.clone();
  }

  /**
   * Get chassis orientation
   */
  getQuaternion(): CANNON.Quaternion {
    return this.chassisBody.quaternion.clone();
  }

  /**
   * Reset vehicle to starting position
   */
  reset(position?: [number, number, number], rotation?: [number, number, number]): void {
    this.chassisBody.position.set(
      position?.[0] ?? 0,
      position?.[1] ?? 2,
      position?.[2] ?? 0
    );
    
    this.chassisBody.velocity.set(0, 0, 0);
    this.chassisBody.angularVelocity.set(0, 0, 0);
    
    if (rotation) {
      const q = new CANNON.Quaternion();
      q.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotation[1] ?? 0);
      this.chassisBody.quaternion.copy(q);
    }
    
    this.steeringValue = 0;
    this.engineForceValue = 0;
    this.brakeForceValue = 0;
  }

  /**
   * Check if vehicle is in air
   */
  isAirborne(): boolean {
    let onGround = false;
    for (let i = 0; i < this.vehicle.wheelInfos.length; i++) {
      if (this.vehicle.wheelInfos[i].isInContact) {
        onGround = true;
        break;
      }
    }
    return !onGround;
  }

  /**
   * Get wheel suspension compression (0-1)
   */
  getWheelSuspensionCompression(index: number): number {
    const wheel = this.vehicle.wheelInfos[index];
    const travel = wheel.suspensionRestLength - wheel.suspensionLength;
    const maxTravel = this.config.wheels.front.maxSuspensionTravel;
    return Math.max(0, Math.min(1, travel / maxTravel));
  }

  /**
   * Cleanup and dispose
   */
  dispose(): void {
    this.vehicle.removeFromWorld(this.physicsWorld.getWorld());
    this.physicsWorld.removeBody(this.chassisBody);
    this.wheelBodies.forEach(body => this.physicsWorld.removeBody(body));
    this.wheelBodies = [];
  }
}
