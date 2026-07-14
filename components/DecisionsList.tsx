'use client'

import { useState } from 'react'
import { Inbox, Copy, CheckCircle2 } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import type { Decision } from '@/types/meeting'
import { useAudio } from '@/hooks/useAudio'

interface DecisionsListProps {
  decisions: Decision[]
}

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const { playSuccess } = useAudio()
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    playSuccess()
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button 
      onClick={handleCopy}
      className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-surface-3 transition-colors absolute top-3 right-3 opacity-0 group-hover:opacity-100 focus:opacity-100"
      title="Copy Decision"
    >
      {copied ? <CheckCircle2 className="w-4 h-4 text-success-500" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}

export function DecisionsList({ decisions }: DecisionsListProps) {
  if (!decisions || decisions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center">
          <Inbox className="w-6 h-6 text-muted" />
        </div>
        <p className="text-muted text-sm text-center">
          No firm decisions were extracted from this meeting.
        </p>
      </div>
    )
  }

  return (
    <motion.ul
      className="space-y-3"
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      {decisions.map((decision, i) => (
        <motion.li
          key={decision.id}
          variants={itemVariants}
          className="group relative border-l-2 border-success-500 bg-surface-1 rounded-r-lg
                     px-4 py-4 pr-10 transition-colors duration-200
                     hover:bg-surface-2"
        >
          <CopyButton text={`${decision.summary}\n${decision.context || ''}`} />
          <div className="flex items-start gap-3">
            <span className="shrink-0 mt-0.5 text-xs font-semibold uppercase tracking-wider text-success-400">
              Decision {i + 1}
            </span>
          </div>
          <p className="font-medium text-primary mt-1.5 leading-snug">
            {decision.summary}
          </p>
          {decision.context && (
            <p className="text-sm text-secondary mt-1.5 leading-relaxed">
              {decision.context}
            </p>
          )}
        </motion.li>
      ))}
    </motion.ul>
  )
}
