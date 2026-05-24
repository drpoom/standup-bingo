# Phase 2 Ultra-Atomic Task List — MINIMUM VIABLE GAME

> **Goal**: Car moves with arrow keys on a 3D canvas. Basic collision with map border. Nothing else.
> **Rule**: Each task ≤ 20 lines of new code. No exploration. Exact file, exact function. <60s execution.

---

## Task 1: Create `src/game/GameEngine.js` — Three.js scene + renderer + camera

**File**: `src/game/GameEngine.js`
**What**: Replace placeholder. Create Three.js WebGLRenderer, Scene, PerspectiveCamera. Mount to container.
**Max lines**: 15

```js
import * as THREE from 'three'

export default class GameEngine {
  constructor(container) {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x87CEEB)
    this.camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(this.renderer.domElement)
    this.objects = []
  }
  add(obj) { this.objects.push(obj); this.scene.add(obj.mesh) }
  update(dt) { this.objects.forEach(o => o.update(dt)) }
  render() { this.renderer.render(this.scene, this.camera) }
  onResize() { /* update camera aspect + renderer size */ }
}
```

---

## Task 2: Create `src/game/Ground.js` — Flat green ground plane

**File**: `src/game/Ground.js`
**What**: 200x200 green plane at y=0. Mesh + add to scene.
**Max lines**: 12

```js
import * as THREE from 'three'

export default class Ground {
  constructor(scene) {
    const geo = new THREE.PlaneGeometry(200, 200)
    const mat = new THREE.MeshLambertMaterial({ color: 0x4a7c3f })
    this.mesh = new THREE.Mesh(geo, mat)
    this.mesh.rotation.x = -Math.PI / 2
    this.mesh.position.y = 0
    scene.add(this.mesh)
  }
  update() {}
}
```

---

## Task 3: Create `src/game/Lights.js` — Ambient + directional light

**File**: `src/game/Lights.js`
**What**: Add ambient light (0x404040) and directional light (0xffffff, pos 50,50,50) to scene.
**Max lines**: 10

```js
import * as THREE from 'three'

export default class Lights {
  constructor(scene) {
    const ambient = new THREE.AmbientLight(0x404040, 2)
    scene.add(ambient)
    const dir = new THREE.DirectionalLight(0xffffff, 1.5)
    dir.position.set(50, 50, 50)
    scene.add(dir)
  }
  update() {}
}
```

---

## Task 4: Create `src/game/Car.js` — Box mesh car + VehiclePhysics integration

**File**: `src/game/Car.js`
**What**: 2x1x4 red box mesh. Import VehiclePhysics (inline JS version). Wire keyboard input. Expose update(dt).
**Max lines**: 20

```js
import * as THREE from 'three'

export default class Car {
  constructor(scene) {
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1, 4),
      new THREE.MeshLambertMaterial({ color: 0xe03030 })
    )
    this.mesh.position.y = 0.5
    scene.add(this.mesh)
    // Inline minimal physics state
    this.x = 0; this.z = 0; this.angle = 0
    this.vx = 0; this.vz = 0; this.angVel = 0
    this.keys = {}
    window.addEventListener('keydown', e => this.keys[e.key] = true)
    window.addEventListener('keyup', e => this.keys[e.key] = false)
  }
  update(dt) {
    const accel = 15, steer = 2.5, friction = 0.95
    if (this.keys['ArrowUp']) { this.vx += Math.cos(this.angle)*accel*dt; this.vz += Math.sin(this.angle)*accel*dt }
    if (this.keys['ArrowDown']) { this.vx -= Math.cos(this.angle)*accel*dt; this.vz -= Math.sin(this.angle)*accel*dt }
    const speed = Math.sqrt(this.vx*this.vx+this.vz*this.vz)
    if (speed > 0.5) {
      if (this.keys['ArrowLeft']) this.angVel += steer*dt
      if (this.keys['ArrowRight']) this.angVel -= steer*dt
    }
    this.vx *= friction; this.vz *= friction; this.angVel *= 0.9
    this.x += this.vx*dt; this.z += this.vz*dt; this.angle += this.angVel*dt
    // Clamp speed
    if (speed > 15) { const s=15/speed; this.vx*=s; this.vz*=s }
    this.mesh.position.set(this.x, 0.5, this.z)
    this.mesh.rotation.y = -this.angle
  }
}
```

---

## Task 5: Create `src/game/MapBorder.js` — Invisible walls at ±100 on X and Z

**File**: `src/game/MapBorder.js`
**What**: 4 walls at x=±100, z=±100. checkCollision(car) returns {collided, normal} or null.
**Max lines**: 15

```js
export default class MapBorder {
  constructor(limit = 100) { this.limit = limit }
  checkCollision(car) {
    const L = this.limit
    if (car.x > L) return { normal: {x:-1,z:0}, pen: car.x - L }
    if (car.x < -L) return { normal: {x:1,z:0}, pen: -L - car.x }
    if (car.z > L) return { normal: {x:0,z:-1}, pen: car.z - L }
    if (car.z < -L) return { normal: {x:0,z:1}, pen: -L - car.z }
    return null
  }
  resolve(car, col) {
    car.x += col.normal.x * col.pen
    car.z += col.normal.z * col.pen
    const dot = car.vx*col.normal.x + car.vz*col.normal.z
    if (dot < 0) { car.vx -= 1.5*dot*col.normal.x; car.vz -= 1.5*dot*col.normal.z }
  }
}
```

---

## Task 6: Create `src/game/GameLoop.js` — requestAnimationFrame loop with delta time

**File**: `src/game/GameLoop.js`
**What**: Start/stop. Each frame: compute dt, call engine.update(dt), call engine.render().
**Max lines**: 12

```js
export default class GameLoop {
  constructor(engine) { this.engine = engine; this.running = false; this.lastTime = 0 }
  start() {
    this.running = true; this.lastTime = performance.now()
    const tick = (now) => {
      if (!this.running) return
      const dt = Math.min((now - this.lastTime) / 1000, 0.1)
      this.lastTime = now
      this.engine.update(dt)
      this.engine.render()
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }
  stop() { this.running = false }
}
```

---

## Task 7: Rewrite `src/App.vue` — Wire GameEngine + Car + Ground + Lights + Border + Loop

**File**: `src/App.vue`
**What**: On mount, create GameEngine, add Ground/Lights/Car, create MapBorder, start GameLoop. Camera follows car.
**Max lines**: 20 (script section)

```vue
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
        engine.camera.position.set(car.x - Math.cos(car.angle)*12, 8, car.z - Math.sin(car.angle)*12)
        engine.camera.lookAt(car.x, 0.5, car.z)
      }
      engine.render = () => engine.renderer.render(engine.scene, engine.camera)
      window.addEventListener('resize', () => {
        engine.camera.aspect = container.value.clientWidth / container.value.clientHeight
        engine.camera.updateProjectionMatrix()
        engine.renderer.setSize(container.value.clientWidth, container.value.clientHeight)
      })
      new GameLoop(engine).start()
    })
    return { container }
  }
}
</script>
```

---

## Task 8: Update `src/style.css` — Full-screen canvas, no scroll

**File**: `src/style.css`
**What**: body overflow hidden, canvas-container 100vw/100vh.
**Max lines**: 8

```css
* { margin:0; padding:0; box-sizing:border-box; }
body { overflow:hidden; background:#000; }
#canvas-container { width:100vw; height:100vh; display:block; }
```

---

## Task 9: Verify build — `npm run build` succeeds

**File**: N/A (verification)
**What**: Run `cd elango-delivery && npm run build`. Must exit 0.
**Max time**: 30s

---

## Task 10: Verify dev server — `npm run dev` serves working game

**File**: N/A (verification)
**What**: Run `npm run dev`, open browser, press arrow keys, car moves, bounces off border.
**Max time**: 30s

---

## Execution Order

Tasks 1-6 are **independent** — can be written in parallel.
Task 7 depends on 1-6 (imports them all).
Task 8 is independent.
Task 9 depends on 7+8.
Task 10 depends on 9.

**Parallel batch 1**: Tasks 1, 2, 3, 4, 5, 6, 8 (all file writes)
**Sequential**: Task 7 (after batch 1)
**Sequential**: Task 9 (after 7)
**Sequential**: Task 10 (after 9)

Total: 10 tasks, ~5 minutes end-to-end.