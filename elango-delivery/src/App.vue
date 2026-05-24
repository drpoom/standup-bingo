<template>
  <div id="canvas-container" ref="container"></div>
</template>
<script>
import { onMounted, ref } from 'vue'
import GameEngine from './game/GameEngine.js'
import Ground from './game/Ground.js'
import Lights from './game/Lights.js'
import Car from './game/Car.js'
import MapBorder from './game/MapBorder.js'
import GameLoop from './game/GameLoop.js'

export default {
  setup() {
    const container = ref(null)
    onMounted(() => {
      const engine = new GameEngine(container.value)
      new Ground(engine.scene)
      new Lights(engine.scene)
      const car = new Car(engine.scene)
      const border = new MapBorder(100)
      engine.update = (dt) => {
        car.update(dt)
        const col = border.checkCollision(car)
        if (col) border.resolve(car, col)
        engine.camera.position.set(
          car.x - Math.cos(car.angle) * 12,
          8,
          car.z - Math.sin(car.angle) * 12
        )
        engine.camera.lookAt(car.x, 0.5, car.z)
      }
      window.addEventListener('resize', () => {
        const w = container.value.clientWidth, h = container.value.clientHeight
        engine.camera.aspect = w / h
        engine.camera.updateProjectionMatrix()
        engine.renderer.setSize(w, h)
      })
      new GameLoop(engine).start()
    })
    return { container }
  }
}
</script>