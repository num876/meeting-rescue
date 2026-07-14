'use client'

import { useEffect, useRef } from 'react'

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Setup canvas dimensions
    let width = window.innerWidth
    let height = window.innerHeight
    
    const setDimensions = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    
    setDimensions()
    window.addEventListener('resize', setDimensions)

    // Particle class
    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        // Very slow, ambient movement
        this.vx = (Math.random() - 0.5) * 0.3
        this.vy = (Math.random() - 0.5) * 0.3
        this.radius = Math.random() * 1.5 + 0.5
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        // Wrap around edges
        if (this.x < 0) this.x = width
        if (this.x > width) this.x = 0
        if (this.y < 0) this.y = height
        if (this.y > height) this.y = 0
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        // Cyan / Electric Blue color for particles
        ctx.fillStyle = 'rgba(6, 182, 212, 0.4)' 
        ctx.fill()
      }
    }

    // Initialize particles (density based on screen size)
    const particleCount = Math.min(Math.floor((width * height) / 12000), 100)
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    let animationFrameId: number
    const maxDistance = 150

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()

        // Draw connecting lines
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            // Opacity scales with distance (closer = more opaque)
            const opacity = (1 - distance / maxDistance) * 0.2
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', setDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] bg-[#09090b]"
      style={{ opacity: 0.8 }}
    />
  )
}
