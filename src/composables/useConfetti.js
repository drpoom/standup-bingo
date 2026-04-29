import { ref, onMounted, onUnmounted } from 'vue'

export function useConfetti() {
  const canvasRef = ref(null)
  const particles = ref([])
  const animationId = ref(null)
  const isRunning = ref(false)

  function createParticle(canvas) {
    const colors = ['#3b82f6', '#f0abfc', '#00ff41', '#fbbf24', '#ef4444', '#8b5cf6']
    return {
      x: Math.random() * canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.1,
      drag: 0.99
    }
  }

  function start() {
    if (!canvasRef.value) return
    
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    // Create particles
    particles.value = []
    for (let i = 0; i < 150; i++) {
      particles.value.push(createParticle(canvas))
    }
    
    isRunning.value = true
    
    function animate() {
      if (!isRunning.value) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.value.forEach((p, index) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.vx *= p.drag
        p.rotation += p.rotationSpeed
        
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()
        
        // Remove particles that fall off screen
        if (p.y > canvas.height + 20) {
          particles.value.splice(index, 1)
        }
      })
      
      if (particles.value.length > 0) {
        animationId.value = requestAnimationFrame(animate)
      } else {
        isRunning.value = false
      }
    }
    
    animate()
  }

  function stop() {
    isRunning.value = false
    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
    }
    particles.value = []
  }

  function burst() {
    stop()
    start()
  }

  onUnmounted(() => {
    stop()
  })

  return {
    canvasRef,
    burst,
    stop,
    isRunning
  }
}
