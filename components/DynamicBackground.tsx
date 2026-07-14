'use client'
import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function DynamicBackground() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Use springs for smooth lag
  const spotlightX = useSpring(mouseX, { stiffness: 40, damping: 20 })
  const spotlightY = useSpring(mouseY, { stiffness: 40, damping: 20 })

  useEffect(() => {
    let ticking = false
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          mouseX.set(e.clientX)
          mouseY.set(e.clientY)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  // Sparkles logic
  const [sparkles, setSparkles] = useState<{ id: number, x: number, y: number, delay: number }[]>([])
  
  useEffect(() => {
    // Generate some random sparkles on mount
    const newSparkles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }))
    setSparkles(newSparkles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-background">
      
      {/* 1. Moving Grid (Hardware Accelerated) */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 animate-grid-flow will-change-transform" />

      {/* 2. Interactive Spotlight (Hardware Accelerated Transform) */}
      <motion.div
        className="absolute w-[1600px] h-[1600px] rounded-full pointer-events-none z-10 will-change-transform"
        style={{ 
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 50%)',
          x: spotlightX,
          y: spotlightY,
          left: -800,
          top: -800,
        }}
      />

      {/* 3. Deep Aurora / Orbs layer (Hardware Accelerated) */}
      <div className="absolute inset-0 opacity-60">
        <motion.div 
          className="absolute w-[800px] h-[800px] rounded-full will-change-transform"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ 
            top: '-20%', left: '-10%',
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.4) 0%, transparent 60%)' 
          }}
        />
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full will-change-transform"
          animate={{
            x: [0, -100, 50, 0],
            y: [0, 100, -50, 0],
            scale: [1, 1.1, 1.3, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ 
            top: '40%', right: '-10%',
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 60%)'
          }}
        />
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full will-change-transform"
          animate={{
            x: [0, 150, -150, 0],
            y: [0, 150, -150, 0],
            scale: [1, 1.5, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ 
            bottom: '-20%', left: '20%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 60%)'
          }}
        />
      </div>

      {/* 4. Twinkling Sparkles/Stars (Pure CSS) */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute w-1 h-1 bg-white rounded-full animate-twinkle will-change-transform opacity-0"
          style={{ 
            left: `${sparkle.x}%`, 
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}s`,
            //@ts-expect-error - Custom CSS properties are not typed by default in React
            '--twinkle-duration': `${3 + Math.random() * 2}s`
          }}
        />
      ))}
      
    </div>
  )
}
