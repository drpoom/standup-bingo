import * as THREE from 'three'

export default class Car {
  constructor(scene) {
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1, 4),
      new THREE.MeshLambertMaterial({ color: 0xe03030 })
    )
    this.mesh.position.y = 0.5
    scene.add(this.mesh)
    this.x = 0; this.z = 0; this.angle = 0
    this.vx = 0; this.vz = 0; this.angVel = 0
    this.keys = {}
    window.addEventListener('keydown', e => { this.keys[e.key] = true })
    window.addEventListener('keyup', e => { this.keys[e.key] = false })
  }
  update(dt) {
    const accel = 15, steer = 2.5, friction = 0.95
    if (this.keys['ArrowUp']) { this.vx += Math.cos(this.angle) * accel * dt; this.vz += Math.sin(this.angle) * accel * dt }
    if (this.keys['ArrowDown']) { this.vx -= Math.cos(this.angle) * accel * dt; this.vz -= Math.sin(this.angle) * accel * dt }
    const speed = Math.sqrt(this.vx * this.vx + this.vz * this.vz)
    if (speed > 0.5) {
      if (this.keys['ArrowLeft']) this.angVel += steer * dt
      if (this.keys['ArrowRight']) this.angVel -= steer * dt
    }
    this.vx *= friction; this.vz *= friction; this.angVel *= 0.9
    this.x += this.vx * dt; this.z += this.vz * dt; this.angle += this.angVel * dt
    if (speed > 15) { const s = 15 / speed; this.vx *= s; this.vz *= s }
    this.mesh.position.set(this.x, 0.5, this.z)
    this.mesh.rotation.y = -this.angle
  }
}