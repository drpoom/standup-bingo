/**
 * MissionSystem - Delivery mission management for Elango Delivery
 * 
 * Handles creation, tracking, and completion of delivery missions.
 * Features:
 * - Pickup and dropoff points
 * - Mission timer with countdown
 * - Score tracking based on performance
 * - Mission state management (active, completed, failed)
 * - UI integration hooks for displaying current mission
 */

export interface Position3D {
  x: number
  y: number
  z: number
}

export interface MissionWaypoint {
  id: string
  position: Position3D
  radius: number  // Trigger radius for completion
  reached: boolean
}

export enum MissionState {
  PENDING = 'pending',
  ACTIVE = 'active',
  PICKUP_REACHED = 'pickup_reached',
  IN_DELIVERY = 'in_delivery',
  COMPLETED = 'completed',
  FAILED = 'failed',
  TIMEOUT = 'timeout'
}

export interface DeliveryMission {
  id: string
  type: 'delivery'
  state: MissionState
  
  // Pickup location
  pickup: MissionWaypoint
  
  // Dropoff location
  dropoff: MissionWaypoint
  
  // Timing
  createdAt: number
  startedAt?: number
  completedAt?: number
  timeLimit: number  // Total time limit in seconds
  remainingTime: number
  
  // Scoring
  baseScore: number
  scoreMultiplier: number
  finalScore: number
  
  // Metadata
  packageName: string
  distance: number  // Total distance from pickup to dropoff
}

export interface MissionConfig {
  // Default time limit per mission (seconds)
  defaultTimeLimit: number
  
  // Base score for completing a mission
  baseScore: number
  
  // Score bonus per second remaining
  timeBonusPerSecond: number
  
  // Minimum distance between pickup and dropoff
  minDistance: number
  
  // Maximum distance between pickup and dropoff
  maxDistance: number
  
  // Radius for waypoint completion
  waypointRadius: number
  
  // Grace period after timeout (seconds)
  gracePeriod: number
}

export const DEFAULT_MISSION_CONFIG: MissionConfig = {
  defaultTimeLimit: 120,        // 2 minutes per mission
  baseScore: 100,               // Base score for completion
  timeBonusPerSecond: 2,        // Bonus points per second remaining
  minDistance: 20,              // Minimum 20 units between points
  maxDistance: 150,             // Maximum 150 units between points
  waypointRadius: 5,            // 5 unit radius for waypoint trigger
  gracePeriod: 5                // 5 second grace period
}

export interface MissionProgress {
  currentMission: DeliveryMission | null
  totalMissions: number
  completedMissions: number
  failedMissions: number
  totalScore: number
  averageTime: number
}

export type MissionEvent =
  | { type: 'MISSION_STARTED'; mission: DeliveryMission }
  | { type: 'PICKUP_REACHED'; mission: DeliveryMission }
  | { type: 'MISSION_COMPLETED'; mission: DeliveryMission; score: number }
  | { type: 'MISSION_FAILED'; mission: DeliveryMission; reason: string }
  | { type: 'TIME_WARNING'; mission: DeliveryMission; remainingTime: number }
  | { type: 'MISSION_UPDATED'; mission: DeliveryMission }

export type MissionEventHandler = (event: MissionEvent) => void

/**
 * MissionSystem - Manages delivery missions
 */
export class MissionSystem {
  private config: MissionConfig
  private currentMission: DeliveryMission | null = null
  private eventHandlers: MissionEventHandler[] = []
  
  // Statistics
  private totalMissions: number = 0
  private completedMissions: number = 0
  private failedMissions: number = 0
  private totalScore: number = 0
  private completionTimes: number[] = []
  
  // Mission generation
  private missionCounter: number = 0
  
  constructor(config: Partial<MissionConfig> = {}) {
    this.config = { ...DEFAULT_MISSION_CONFIG, ...config }
  }
  
  /**
   * Register an event handler for mission events
   */
  onEvent(handler: MissionEventHandler): void {
    this.eventHandlers.push(handler)
  }
  
  /**
   * Remove an event handler
   */
  offEvent(handler: MissionEventHandler): void {
    const index = this.eventHandlers.indexOf(handler)
    if (index !== -1) {
      this.eventHandlers.splice(index, 1)
    }
  }
  
  /**
   * Emit a mission event
   */
  private emit(event: MissionEvent): void {
    for (const handler of this.eventHandlers) {
      handler(event)
    }
  }
  
  /**
   * Create a new delivery mission
   */
  createMission(
    pickupPos: Position3D,
    dropoffPos: Position3D,
    timeLimit?: number,
    packageName?: string
  ): DeliveryMission {
    this.missionCounter++
    
    const distance = this.calculateDistance(pickupPos, dropoffPos)
    const actualTimeLimit = timeLimit ?? this.config.defaultTimeLimit
    
    const mission: DeliveryMission = {
      id: `mission-${this.missionCounter}`,
      type: 'delivery',
      state: MissionState.PENDING,
      
      pickup: {
        id: 'pickup',
        position: pickupPos,
        radius: this.config.waypointRadius,
        reached: false
      },
      
      dropoff: {
        id: 'dropoff',
        position: dropoffPos,
        radius: this.config.waypointRadius,
        reached: false
      },
      
      createdAt: Date.now(),
      timeLimit: actualTimeLimit,
      remainingTime: actualTimeLimit,
      
      baseScore: this.config.baseScore,
      scoreMultiplier: 1.0,
      finalScore: 0,
      
      packageName: packageName ?? this.generatePackageName(),
      distance
    }
    
    return mission
  }
  
  /**
   * Start a mission
   */
  startMission(mission?: DeliveryMission): void {
    const targetMission = mission ?? this.currentMission
    if (!targetMission) {
      console.warn('No mission to start')
      return
    }
    
    targetMission.state = MissionState.ACTIVE
    targetMission.startedAt = Date.now()
    this.currentMission = targetMission
    this.totalMissions++
    
    this.emit({ type: 'MISSION_STARTED', mission: targetMission })
  }
  
  /**
   * Update mission state (call every frame)
   * @param deltaTime - Time since last update in seconds
   * @param playerPosition - Current player/vehicle position
   */
  update(deltaTime: number, playerPosition: Position3D): void {
    if (!this.currentMission || this.currentMission.state === MissionState.COMPLETED) {
      return
    }
    
    // Update timer
    if (this.currentMission.startedAt) {
      this.currentMission.remainingTime -= deltaTime
      
      // Time warning at 30, 20, 10 seconds
      const remaining = this.currentMission.remainingTime
      if (remaining > 0 && (remaining === 30 || remaining === 20 || remaining === 10)) {
        this.emit({ type: 'TIME_WARNING', mission: this.currentMission, remainingTime: remaining })
      }
      
      // Check timeout
      if (this.currentMission.remainingTime <= -this.config.gracePeriod) {
        this.failMission('Time limit exceeded')
        return
      }
    }
    
    // Check waypoint proximity
    this.checkWaypointProximity(playerPosition)
    
    // Emit update event
    this.emit({ type: 'MISSION_UPDATED', mission: this.currentMission })
  }
  
  /**
   * Check if player is near any waypoint
   */
  private checkWaypointProximity(position: Position3D): void {
    if (!this.currentMission) return
    
    const mission = this.currentMission
    
    // Check pickup
    if (!mission.pickup.reached) {
      const distToPickup = this.distance3D(position, mission.pickup.position)
      if (distToPickup <= mission.pickup.radius) {
        mission.pickup.reached = true
        mission.state = MissionState.PICKUP_REACHED
        
        // Automatically transition to delivery phase after brief moment
        setTimeout(() => {
          if (this.currentMission && this.currentMission.state === MissionState.PICKUP_REACHED) {
            this.currentMission.state = MissionState.IN_DELIVERY
          }
        }, 500)
      }
    }
    
    // Check dropoff (only after pickup is reached)
    if (mission.pickup.reached && !mission.dropoff.reached) {
      const distToDropoff = this.distance3D(position, mission.dropoff.position)
      if (distToDropoff <= mission.dropoff.radius) {
        mission.dropoff.reached = true
        this.completeMission()
      }
    }
  }
  
  /**
   * Complete the current mission
   */
  private completeMission(): void {
    if (!this.currentMission) return
    
    const mission = this.currentMission
    mission.state = MissionState.COMPLETED
    mission.completedAt = Date.now()
    
    // Calculate score
    const timeUsed = mission.timeLimit - mission.remainingTime
    const timeBonus = Math.max(0, mission.remainingTime) * this.config.timeBonusPerSecond
    const distanceBonus = Math.floor(mission.distance / 10)
    
    mission.finalScore = Math.floor(
      mission.baseScore + timeBonus + distanceBonus
    )
    
    // Update statistics
    this.completedMissions++
    this.totalScore += mission.finalScore
    this.completionTimes.push(timeUsed)
    
    this.emit({ type: 'MISSION_COMPLETED', mission, score: mission.finalScore })
    
    // Clear current mission reference (but keep for history)
    this.currentMission = null
  }
  
  /**
   * Fail the current mission
   */
  private failMission(reason: string): void {
    if (!this.currentMission) return
    
    const mission = this.currentMission
    mission.state = MissionState.FAILED
    mission.finalScore = 0
    
    this.failedMissions++
    
    this.emit({ type: 'MISSION_FAILED', mission, reason })
    
    this.currentMission = null
  }
  
  /**
   * Get the current active mission
   */
  getCurrentMission(): DeliveryMission | null {
    return this.currentMission
  }
  
  /**
   * Get mission progress statistics
   */
  getProgress(): MissionProgress {
    const avgTime = this.completionTimes.length > 0
      ? this.completionTimes.reduce((a, b) => a + b, 0) / this.completionTimes.length
      : 0
    
    return {
      currentMission: this.currentMission,
      totalMissions: this.totalMissions,
      completedMissions: this.completedMissions,
      failedMissions: this.failedMissions,
      totalScore: this.totalScore,
      averageTime: avgTime
    }
  }
  
  /**
   * Reset all mission data
   */
  reset(): void {
    this.currentMission = null
    this.totalMissions = 0
    this.completedMissions = 0
    this.failedMissions = 0
    this.totalScore = 0
    this.completionTimes = []
    this.missionCounter = 0
  }
  
  /**
   * Generate a random position for mission waypoints
   */
  generateRandomPosition(
    center: Position3D,
    minDist: number,
    maxDist: number
  ): Position3D {
    const angle = Math.random() * Math.PI * 2
    const distance = minDist + Math.random() * (maxDist - minDist)
    
    return {
      x: center.x + Math.cos(angle) * distance,
      y: center.y,
      z: center.z + Math.sin(angle) * distance
    }
  }
  
  /**
   * Generate a random delivery mission around a center point
   */
  generateRandomMission(
    center: Position3D,
    timeLimit?: number
  ): DeliveryMission {
    const pickup = this.generateRandomPosition(
      center,
      this.config.minDistance / 2,
      this.config.maxDistance / 2
    )
    
    const dropoff = this.generateRandomPosition(
      pickup,
      this.config.minDistance,
      this.config.maxDistance
    )
    
    return this.createMission(pickup, dropoff, timeLimit)
  }
  
  /**
   * Calculate distance between two 3D points (XZ plane only)
   */
  private calculateDistance(a: Position3D, b: Position3D): number {
    const dx = b.x - a.x
    const dz = b.z - a.z
    return Math.sqrt(dx * dx + dz * dz)
  }
  
  /**
   * Calculate 3D distance
   */
  private distance3D(a: Position3D, b: Position3D): number {
    const dx = b.x - a.x
    const dy = b.y - a.y
    const dz = b.z - a.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }
  
  /**
   * Generate a random package name
   */
  private generatePackageName(): string {
    const adjectives = ['Urgent', 'Fragile', 'Priority', 'Standard', 'Express', 'Heavy', 'Light', 'Special']
    const items = ['Package', 'Box', 'Crate', 'Envelope', 'Parcel', 'Shipment', 'Delivery', 'Order']
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
    const item = items[Math.floor(Math.random() * items.length)]
    
    return `${adj} ${item}`
  }
  
  /**
   * Get formatted time string from seconds
   */
  static formatTime(seconds: number): string {
    const absSeconds = Math.abs(seconds)
    const mins = Math.floor(absSeconds / 60)
    const secs = Math.floor(absSeconds % 60)
    
    const sign = seconds < 0 ? '-' : ''
    return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  /**
   * Get mission state display text
   */
  static getStateText(state: MissionState): string {
    switch (state) {
      case MissionState.PENDING:
        return 'Waiting to Start'
      case MissionState.ACTIVE:
        return 'Heading to Pickup'
      case MissionState.PICKUP_REACHED:
        return 'Package Collected!'
      case MissionState.IN_DELIVERY:
        return 'Delivering Package'
      case MissionState.COMPLETED:
        return 'Delivered!'
      case MissionState.FAILED:
        return 'Failed'
      case MissionState.TIMEOUT:
        return 'Time Expired'
      default:
        return 'Unknown'
    }
  }
  
  /**
   * Get mission state color for UI
   */
  static getStateColor(state: MissionState): string {
    switch (state) {
      case MissionState.PENDING:
        return '#9CA3AF'  // gray
      case MissionState.ACTIVE:
        return '#3B82F6'  // blue
      case MissionState.PICKUP_REACHED:
      case MissionState.IN_DELIVERY:
        return '#F59E0B'  // amber
      case MissionState.COMPLETED:
        return '#10B981'  // green
      case MissionState.FAILED:
      case MissionState.TIMEOUT:
        return '#EF4444'  // red
      default:
        return '#6B7280'  // gray
    }
  }
}

export default MissionSystem
