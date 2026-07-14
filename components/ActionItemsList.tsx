'use client'

import { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { Calendar, AlertTriangle, Copy, CheckCircle2 } from 'lucide-react'
import type { ActionItem } from '@/types/meeting'
import { useAudio } from '@/hooks/useAudio'

interface ActionItemsListProps {
  actionItems: ActionItem[]
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

const confidenceColors: Record<ActionItem['confidence'], string> = {
  high: 'bg-success-400',
  medium: 'bg-action-400',
  low: 'bg-recording-400',
}

const confidenceLabels: Record<ActionItem['confidence'], string> = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
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
      title="Copy Action Item"
    >
      {copied ? <CheckCircle2 className="w-4 h-4 text-success-500" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}

export function ActionItemsList({ actionItems }: ActionItemsListProps) {
  if (!actionItems || actionItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center">
          <Calendar className="w-6 h-6 text-muted" />
        </div>
        <p className="text-muted text-sm text-center">
          No action items were extracted from this meeting.
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
      {actionItems.map((item) => {
        const hasOwner = !!item.owner

        return (
          <motion.li
            key={item.id}
            variants={itemVariants}
            className="group relative bg-surface-1 rounded-lg border border-border-subtle
                       px-4 py-4 pr-10 transition-colors duration-200
                       hover:bg-surface-2 hover:border-border"
          >
            <CopyButton text={item.task} />
            
            {/* Task description */}
            <p className="font-medium text-primary leading-snug">
              {item.task}
            </p>

            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {/* Owner pill */}
              {hasOwner ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-accent-500/20 px-2.5 py-1 text-xs font-medium text-accent-400">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full
                               bg-accent-500/30 text-[10px] font-bold uppercase text-accent-400"
                  >
                    {item.owner!.charAt(0)}
                  </span>
                  {item.owner}
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-dashed
                             border-action-500/50 bg-transparent px-2.5 py-1 text-xs font-medium
                             text-action-400 animate-pulse-glow"
                >
                  <AlertTriangle className="w-3 h-3" />
                  Unclear owner
                </span>
              )}

              {/* Due date */}
              {item.dueDate && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs text-secondary">
                  <Calendar className="w-3 h-3" />
                  {item.dueDate}
                </span>
              )}

              {/* Confidence dot */}
              <span
                className="inline-flex items-center gap-1.5 text-[11px] text-muted ml-auto"
                title={confidenceLabels[item.confidence]}
              >
                <span
                  className={`h-2 w-2 rounded-full ${confidenceColors[item.confidence]}`}
                />
                {item.confidence}
              </span>
            </div>
          </motion.li>
        )
      })}
    </motion.ul>
  )
}
