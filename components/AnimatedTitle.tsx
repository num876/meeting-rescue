'use client'
import { motion, Variants } from 'framer-motion'

interface AnimatedTitleProps {
  text: string
  className?: string
  delay?: number
}

export function AnimatedTitle({ text, className = "", delay = 0 }: AnimatedTitleProps) {
  // Split the text into an array of words
  const words = text.split(" ")

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay * i },
    }),
  }

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  }

  return (
    <motion.span
      style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", gap: "0.25em" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, index) => (
        <span key={index} style={{ display: "inline-flex" }}>
          {word.split("").map((char, charIndex) => (
            <motion.span variants={child} key={charIndex} style={{ display: "inline" }}>
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  )
}
