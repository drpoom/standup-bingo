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