import { ref, onMounted, onUnmounted } from 'vue'

export function useConfetti() {
  const canvasRef = ref(null)
  const particles = ref([])
  const animationId = ref(null)
  const isRunning = ref(false)

  function createParticle(canvas) {
    // Enhanced variety of colors and shapes
    const colors = [
      '#3b82f6', '#f0abfc', '#00ff41', '#fbbf24', '#ef4444', '#8b5cf6',
      '#06b6d4', '#f97316', '#ec4899', '#10b981', '#6366f1', '#eab308'
    ]
    
    // Different particle shapes: 0=square, 1=circle, 2=triangle
    const shape = Math.floor(Math.random() * 3)
    
    return {
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 100,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 4 + 3,
      size: Math.random() * 10 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      gravity: 0.15,
      drag: 0.98,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.1 + 0.05,
      shape: shape
    }
  }

  function start() {
    if (!canvasRef.value) return
    
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    // Create MORE particles for epic celebration (300 instead of 150)
    particles.value = []
    for (let i = 0; i < 300; i++) {
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
        p.wobble += p.wobbleSpeed
        
        // Add wobble effect
        p.x += Math.sin(p.wobble) * 0.5
        
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        
        // Draw different shapes
        if (p.shape === 0) {
          // Square
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        } else if (p.shape === 1) {
          // Circle
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Triangle
          ctx.beginPath()
          ctx.moveTo(0, -p.size / 2)
          ctx.lineTo(p.size / 2, p.size / 2)
          ctx.lineTo(-p.size / 2, p.size / 2)
          ctx.closePath()
          ctx.fill()
        }
        
        ctx.restore()
        
        // Remove particles that fall off screen
        if (p.y > canvas.height + 50) {
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
