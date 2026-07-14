'use client'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Check, CheckCircle2, MessageSquare } from 'lucide-react'
import { useState, useRef } from 'react'

export function AppPreviewCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values for mouse tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for smooth return and movement
  const springConfig = { damping: 25, stiffness: 300 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig)
  
  // Glare effect positioning
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [100, -100]), springConfig)
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [100, -100]), springConfig)
  const glareOpacity = useSpring(useTransform(mouseY, [-0.5, 0.5], [0.1, 0.4]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    window.requestAnimationFrame(() => {
      const rect = cardRef.current!.getBoundingClientRect()
      
      // Calculate relative mouse position (-0.5 to 0.5)
      const relativeX = (e.clientX - rect.left) / rect.width - 0.5
      const relativeY = (e.clientY - rect.top) / rect.height - 0.5
      
      mouseX.set(relativeX)
      mouseY.set(relativeY)
    })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    window.requestAnimationFrame(() => {
      mouseX.set(0)
      mouseY.set(0)
    })
  }

  return (
    <motion.div
      className="relative w-full max-w-sm mx-auto perspective-1000"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Background glow for the card (Hardware Accelerated Shadow) */}
      <div 
        className="absolute inset-0 rounded-[2rem]"
        style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', transform: 'scale(1.2)' }}
      />
      
      {/* The main card wrapper for 3D tilt */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full will-change-transform"
      >
        <motion.div 
          className="relative bg-noise border border-border/50 rounded-3xl p-6 shadow-2xl bg-surface-0 overflow-hidden"
          // Keep the subtle floating animation if not hovered
          animate={{ y: isHovered ? 0 : [0, -10, 0] }}
          transition={{ repeat: isHovered ? 0 : Infinity, duration: 6, ease: 'easeInOut' }}
        >
          {/* Dynamic Glare Effect */}
          <motion.div 
            className="absolute inset-0 pointer-events-none rounded-3xl will-change-transform"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
              opacity: isHovered ? glareOpacity : 0,
              x: glareX,
              y: glareY,
              scale: 2,
            }}
          />

          {/* Fake Mac window controls */}
          <div className="flex gap-2 mb-6 relative z-10" style={{ transform: 'translateZ(20px)' }}>
            <div className="w-3 h-3 rounded-full bg-recording-500/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />
            <div className="w-3 h-3 rounded-full bg-action-500/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />
            <div className="w-3 h-3 rounded-full bg-success-500/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />
          </div>

          {/* Content Section: Decisions */}
          <div className="space-y-4 relative z-10" style={{ transform: 'translateZ(10px)' }}>
            <div className="h-4 w-24 bg-surface-2 rounded-md animate-pulse" />
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-surface-1/50 border border-border-subtle"
            >
              <div className="w-6 h-6 rounded-full bg-success-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-success-400" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-3.5 w-full bg-surface-2 rounded" />
                <div className="h-3.5 w-4/5 bg-surface-2 rounded" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-surface-1/50 border border-border-subtle"
            >
               <div className="w-6 h-6 rounded-full bg-success-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-success-400" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-3.5 w-11/12 bg-surface-2 rounded" />
                <div className="h-3.5 w-3/5 bg-surface-2 rounded" />
              </div>
            </motion.div>
          </div>

          {/* Content Section: Action Items */}
          <div className="mt-6 space-y-4 relative z-10" style={{ transform: 'translateZ(15px)' }}>
            <div className="h-4 w-32 bg-surface-2 rounded-md animate-pulse" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-accent-500/10 border border-accent-500/20"
            >
              <div className="w-8 h-8 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center text-xs font-bold">
                AK
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-3/4 bg-surface-2 rounded" />
                <div className="h-2.5 w-1/2 bg-surface-2 rounded opacity-50" />
              </div>
            </motion.div>
          </div>
          
          {/* Shimmer overlay effect */}
          <motion.div 
            className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-45deg]"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear', repeatDelay: 2 }}
          />
        </motion.div>
      </motion.div>
      
      {/* Floating accent elements (Outside the tilt container so they float independently) */}
      <motion.div 
        className="absolute -bottom-6 -right-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <motion.div
          className="glass-card bg-noise p-3 rounded-2xl flex items-center gap-2 shadow-xl bg-surface-0/80 backdrop-blur-md"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        >
          <CheckCircle2 className="w-5 h-5 text-success-400" />
          <span className="text-xs font-medium text-primary">Email Drafted</span>
        </motion.div>
      </motion.div>

      <motion.div 
        className="absolute -top-6 -left-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <motion.div
          className="glass-card bg-noise p-3 rounded-2xl flex items-center gap-2 shadow-xl bg-surface-0/80 backdrop-blur-md"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          <MessageSquare className="w-5 h-5 text-accent-400" />
          <span className="text-xs font-medium text-primary">Summary Ready</span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
