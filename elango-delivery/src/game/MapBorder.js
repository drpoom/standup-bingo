export default class MapBorder {
  constructor(limit = 100) { this.limit = limit }
  checkCollision(car) {
    const L = this.limit
    if (car.x > L) return { normal: { x: -1, z: 0 }, pen: car.x - L }
    if (car.x < -L) return { normal: { x: 1, z: 0 }, pen: -L - car.x }
    if (car.z > L) return { normal: { x: 0, z: -1 }, pen: car.z - L }
    if (car.z < -L) return { normal: { x: 0, z: 1 }, pen: -L - car.z }
    return null
  }
  resolve(car, col) {
    car.x += col.normal.x * col.pen
    car.z += col.normal.z * col.pen
    const dot = car.vx * col.normal.x + car.vz * col.normal.z
    if (dot < 0) { car.vx -= 1.5 * dot * col.normal.x; car.vz -= 1.5 * dot * col.normal.z }
  }
}