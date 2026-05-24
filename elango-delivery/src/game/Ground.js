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