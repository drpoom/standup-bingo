<template>
  <div id="canvas-container" ref="container"></div>
  <GameOverlay />
  <TouchDPad />
</template>
<script>
import { onMounted, ref } from 'vue'
import GameEngine from './game/GameEngine.js'
import Ground from './game/Ground.js'
import Lights from './game/Lights.js'
import Car from './game/Car.js'
import MapBorder from './game/MapBorder.js'
import GameLoop from './game/GameLoop.js'
import { NPC } from './game/entities/NPC.js'
import { PickupPoint } from './game/entities/PickupPoint.js'
import { DropoffPoint } from './game/entities/DropoffPoint.js'
import { DeliveryManager } from './game/DeliveryManager.js'
import GameOverlay from './components/GameOverlay.vue'
import TouchDPad from './components/TouchDPad.vue'

export default {
  components: { GameOverlay, TouchDPad },
  setup() {
    const container = ref(null)
    onMounted(() => {
      const engine = new GameEngine(container.value)
      new Ground(engine.scene)
      new Lights(engine.scene)
      const car = new Car(engine.scene)
      const border = new MapBorder(100)
      // Spawn NPCs (5 chickens, 3 pedestrians)
      const npcs = []
      for (let i = 0; i < 5; i++) {
        const npc = new NPC(engine.scene, 'chicken')
        npc.mesh.position.set((Math.random() - 0.5) * 80, 0, (Math.random() - 0.5) * 80)
        engine.scene.add(npc.mesh)
        npcs.push(npc)
      }
      for (let i = 0; i < 3; i++) {
        const npc = new NPC(engine.scene, 'pedestrian')
        npc.mesh.position.set((Math.random() - 0.5) * 80, 0, (Math.random() - 0.5) * 80)
        engine.scene.add(npc.mesh)
        npcs.push(npc)
      }
      // Delivery missions
      const delivery = new DeliveryManager()
      function spawnMission() {
        const px = (Math.random() - 0.5) * 60, pz = (Math.random() - 0.5) * 60
        const dx = (Math.random() - 0.5) * 60, dz = (Math.random() - 0.5) * 60
        const pickup = new PickupPoint(engine.scene, px, pz)
        const dropoff = new DropoffPoint(engine.scene, dx, dz)
        delivery.startMission(pickup, dropoff, 60)
        return { pickup, dropoff }
      }
      let mission = spawnMission()
      // Initialize game state bridge for HUD
      window.__gameState = { vx: 0, vz: 0, score: 0, timeRemaining: 0, hasPackage: false }
      engine.update = (dt) => {
        car.update(dt)
        const col = border.checkCollision(car)
        if (col) border.resolve(car, col)
        // Update NPCs
        npcs.forEach(npc => {
          npc.update(car.mesh.position, dt)
          if (npc.checkCollision(car.mesh.position)) {
            // Flee faster when hit
            npc.direction.multiplyScalar(-1)
          }
        })
        // Update delivery mission
        mission.pickup.update(dt)
        mission.dropoff.update(dt)
        const result = delivery.update(dt, car.mesh.position)
        if (result && (result.event === 'delivered' || result.event === 'timeout')) {
          mission = spawnMission()
        }
        engine.camera.position.set(
          car.x - Math.cos(car.angle) * 12,
          8,
          car.z - Math.sin(car.angle) * 12
        )
        engine.camera.lookAt(car.x, 0.5, car.z)
        // Update game state bridge for HUD
        window.__gameState.vx = car.vx
        window.__gameState.vz = car.vz
        window.__gameState.score = delivery.score
        window.__gameState.timeRemaining = delivery.timeRemaining
        window.__gameState.hasPackage = delivery.hasPackage
      }
      window.addEventListener('resize', () => {
        const w = container.value.clientWidth, h = container.value.clientHeight
        engine.camera.aspect = w / h
        engine.camera.updateProjectionMatrix()
        engine.renderer.setSize(w, h)
      })
      // Expose for testing
      window.__gameCar = car
      window.__gameEngine = engine
      window.__gameBorder = border
      // Honk listener for traffic lights
      window.addEventListener('game-honk', () => {
        if (typeof trafficLights !== 'undefined') trafficLights.forEach(tl => tl.honk())
      })
      new GameLoop(engine).start()
    })
    return { container }
  }
}
</script>
