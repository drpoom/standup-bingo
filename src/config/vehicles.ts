/**
 * vehicles.ts - Vehicle configuration presets
 * Defines vehicle parameters for speed, steering, mass, and friction
 */

import { VehicleConfig } from '../game/Vehicle';

/**
 * Default vehicle configuration
 * Balanced settings for general-purpose driving
 */
export const defaultVehicleConfig: VehicleConfig = {
  chassis: {
    mass: 150,
    halfExtents: [1, 0.5, 2],
    position: [0, 2, 0]
  },
  wheels: {
    front: {
      radius: 0.4,
      suspensionStiffness: 30,
      suspensionRestLength: 0.4,
      frictionSlip: 2.5,
      dampingRelaxation: 4.0,
      dampingCompression: 4.5,
      maxSuspensionForce: 100000,
      maxSuspensionTravel: 0.3,
      rollInfluence: 0.01,
      isFrontWheel: true
    },
    rear: {
      radius: 0.4,
      suspensionStiffness: 30,
      suspensionRestLength: 0.4,
      frictionSlip: 2.5,
      dampingRelaxation: 4.0,
      dampingCompression: 4.5,
      maxSuspensionForce: 100000,
      maxSuspensionTravel: 0.3,
      rollInfluence: 0.01,
      isFrontWheel: false
    }
  },
  wheelPositions: {
    frontLeft: [-1, 0, 1.2],
    frontRight: [1, 0, 1.2],
    rearLeft: [-1, 0, -1.2],
    rearRight: [1, 0, -1.2]
  },
  engineForce: 800,
  maxBrakeForce: 500,
  steeringClamp: 0.5
};

/**
 * Sport vehicle configuration
 * Higher speed, sharper steering, lighter mass
 */
export const sportVehicleConfig: VehicleConfig = {
  chassis: {
    mass: 120,
    halfExtents: [0.95, 0.4, 1.9],
    position: [0, 2, 0]
  },
  wheels: {
    front: {
      radius: 0.38,
      suspensionStiffness: 40,
      suspensionRestLength: 0.38,
      frictionSlip: 3.0,
      dampingRelaxation: 3.5,
      dampingCompression: 4.0,
      maxSuspensionForce: 120000,
      maxSuspensionTravel: 0.25,
      rollInfluence: 0.008,
      isFrontWheel: true
    },
    rear: {
      radius: 0.38,
      suspensionStiffness: 40,
      suspensionRestLength: 0.38,
      frictionSlip: 3.0,
      dampingRelaxation: 3.5,
      dampingCompression: 4.0,
      maxSuspensionForce: 120000,
      maxSuspensionTravel: 0.25,
      rollInfluence: 0.008,
      isFrontWheel: false
    }
  },
  wheelPositions: {
    frontLeft: [-0.9, 0, 1.1],
    frontRight: [0.9, 0, 1.1],
    rearLeft: [-0.9, 0, -1.1],
    rearRight: [0.9, 0, -1.1]
  },
  engineForce: 1200,
  maxBrakeForce: 700,
  steeringClamp: 0.6
};

/**
 * Truck vehicle configuration
 * Heavier mass, lower speed, more stable
 */
export const truckVehicleConfig: VehicleConfig = {
  chassis: {
    mass: 250,
    halfExtents: [1.2, 0.7, 2.5],
    position: [0, 2.5, 0]
  },
  wheels: {
    front: {
      radius: 0.5,
      suspensionStiffness: 25,
      suspensionRestLength: 0.5,
      frictionSlip: 2.0,
      dampingRelaxation: 5.0,
      dampingCompression: 5.5,
      maxSuspensionForce: 150000,
      maxSuspensionTravel: 0.4,
      rollInfluence: 0.015,
      isFrontWheel: true
    },
    rear: {
      radius: 0.5,
      suspensionStiffness: 25,
      suspensionRestLength: 0.5,
      frictionSlip: 2.0,
      dampingRelaxation: 5.0,
      dampingCompression: 5.5,
      maxSuspensionForce: 150000,
      maxSuspensionTravel: 0.4,
      rollInfluence: 0.015,
      isFrontWheel: false
    }
  },
  wheelPositions: {
    frontLeft: [-1.1, 0, 1.5],
    frontRight: [1.1, 0, 1.5],
    rearLeft: [-1.1, 0, -1.5],
    rearRight: [1.1, 0, -1.5]
  },
  engineForce: 600,
  maxBrakeForce: 800,
  steeringClamp: 0.4
};

/**
 * Vehicle presets map
 */
export const vehiclePresets: Record<string, VehicleConfig> = {
  default: defaultVehicleConfig,
  sport: sportVehicleConfig,
  truck: truckVehicleConfig
};

export default defaultVehicleConfig;
