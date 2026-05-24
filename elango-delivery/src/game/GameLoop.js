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