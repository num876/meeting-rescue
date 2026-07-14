'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface RotatingTextProps {
  words: string[]
  interval?: number
}

export function RotatingText({ words, interval = 3000 }: RotatingTextProps) {
  const [index, setIndex] = useState(0)

  // Find the longest word to act as an invisible strut to naturally size the container
  const longestWord = useMemo(() => {
    return words.reduce((a, b) => (a.length > b.length ? a : b), '')
  }, [words])

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, interval)
    return () => clearInterval(timer)
  }, [words, interval])

  return (
    <span className="relative inline-block text-left">
      {/* Invisible strut sets the width/height exactly to the longest word */}
      <span className="opacity-0 pointer-events-none inline-block">
        {longestWord}
      </span>
      
      {/* The actively animating words */}
      <AnimatePresence mode="popLayout">
        <motion.span
          key={index}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-0 text-gradient"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
