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
    <span className="relative inline-flex justify-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={index}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -15, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="inline-block text-gradient whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
