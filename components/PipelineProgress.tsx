'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  Sparkles,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import type { PipelineStage, MeetingSummary } from '@/types/meeting'

/* ------------------------------------------------------------------ */
/*  Types & config                                                     */
/* ------------------------------------------------------------------ */

interface PipelineProgressProps {
  stage: PipelineStage
  durationStr: string
  errorMsg?: string
  onRetry?: () => void
  partialSummary?: Partial<MeetingSummary>
}

const STAGES = [
  {
    id: 'transcribing' as const,
    label: 'Transcribing audio',
    subtitle: 'Converting speech to text',
    Icon: Mic,
  },
  {
    id: 'extracting' as const,
    label: 'Extracting insights',
    subtitle: 'Decisions & action items',
    Icon: Sparkles,
  },
  {
    id: 'drafting' as const,
    label: 'Drafting email',
    subtitle: 'Building your summary',
    Icon: Mail,
  },
] as const

/* Map each PipelineStage to its ordered index (for comparison) */
const stageOrder: Record<string, number> = {
  idle: -1,
  transcribing: 0,
  extracting: 1,
  drafting: 2,
  complete: 3,
  error: -1,
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PipelineProgress({
  stage,
  durationStr,
  errorMsg,
  onRetry,
  partialSummary,
}: PipelineProgressProps) {
  if (stage === 'idle') return null

  const currentIndex = stageOrder[stage] ?? -1

  return (
    <AnimatePresence>
      {/* ── Full-screen overlay ──────────────────────────────── */}
      <motion.div
        key="pipeline-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 sm:p-0"
      >
        {/* ── Glass card container ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card w-full max-w-md mx-4 p-6 sm:p-8 rounded-2xl"
        >
          {/* ── Header ─────────────────────────────────────── */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-semibold text-primary">
              Processing your meeting
            </h2>
            <p className="text-xs text-secondary mt-0.5 sm:mt-1">
              This usually takes under 30 seconds
            </p>
          </div>

          {/* ── Stage list ─────────────────────────────────── */}
          <div className="flex flex-col items-stretch space-y-1">
            {STAGES.map((s, idx) => {
              const isComplete = currentIndex > idx
              const isActive = currentIndex === idx
              const isIdle = !isComplete && !isActive

              return (
                <div key={s.id}>
                  {/* ── Stage row ─────────────────────────── */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Icon container */}
                    <div className="relative flex-shrink-0">
                      <motion.div
                        layout
                        className={`
                          flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl
                          transition-colors duration-500
                          ${
                            isComplete
                              ? 'bg-success-500/15 border border-success-500/40'
                              : isActive
                                ? 'bg-accent-500/15 border border-accent-500/40 animate-pulse-glow'
                                : 'bg-surface-2 border border-border'
                          }
                        `}
                      >
                        {/* Completed — scale-in check */}
                        {isComplete ? (
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                              type: 'spring',
                              stiffness: 400,
                              damping: 18,
                            }}
                          >
                            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-success-400" />
                          </motion.div>
                        ) : (
                          <s.Icon
                            className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-500 ${
                              isActive ? 'text-accent-400' : 'text-muted'
                            }`}
                          />
                        )}
                      </motion.div>

                      {/* Spinning activity indicator (active only) */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-accent-500 shadow-glow-accent"
                          >
                            <Loader2 className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-spin" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Labels */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs sm:text-sm font-semibold transition-colors duration-500 ${
                          isIdle ? 'text-muted' : 'text-primary'
                        }`}
                      >
                        {s.label}
                      </p>
                      <p className="text-xs text-secondary truncate">
                        {s.subtitle}
                      </p>
                    </div>

                    {/* Elapsed time (shown when complete) */}
                    {isComplete && (
                      <motion.span
                        initial={{ opacity: 0, x: 6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-xs font-mono text-muted flex-shrink-0"
                      >
                        {durationStr}
                      </motion.span>
                    )}
                  </div>

                  {/* ── Live Streaming Preview ──────────────── */}
                  <AnimatePresence>
                    {s.id === 'extracting' && isActive && partialSummary && (partialSummary.overallSummary || partialSummary.decisions?.length || partialSummary.actionItems?.length) ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-[72px] mt-3 mb-2"
                      >
                        <div className="text-xs text-primary/80 bg-surface-1/50 border border-border-subtle p-3 rounded-lg font-mono overflow-hidden">
                          {partialSummary.overallSummary && (
                            <div className="mb-2 line-clamp-2">
                              <span className="text-accent-400">Summary: </span>
                              {partialSummary.overallSummary}
                              <span className="animate-pulse">_</span>
                            </div>
                          )}
                          <div className="flex gap-4">
                            {partialSummary.decisions && partialSummary.decisions.length > 0 && (
                              <div>
                                <span className="text-success-400">Decisions: </span>
                                {partialSummary.decisions.length}
                              </div>
                            )}
                            {partialSummary.actionItems && partialSummary.actionItems.length > 0 && (
                              <div>
                                <span className="text-action-400">Tasks: </span>
                                {partialSummary.actionItems.length}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {/* ── Connecting line (between stages) ──── */}
                  {idx < STAGES.length - 1 && (
                    <div className="flex items-stretch ml-7 py-0.5">
                      <motion.div
                        className="w-0.5 h-8 rounded-full"
                        initial={false}
                        animate={{
                          backgroundColor:
                            currentIndex > idx
                              ? 'var(--success-500)'
                              : 'var(--border)',
                        }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* ── Completion badge ────────────────────────────── */}
          <AnimatePresence>
            {stage === 'complete' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mt-6 sm:mt-8 flex items-center justify-center gap-2 text-success-400"
              >
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold">
                  Processing complete
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Error card ──────────────────────────────────── */}
          <AnimatePresence>
            {stage === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.35 }}
                className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl bg-recording-500/10 border border-recording-500/40 flex items-start gap-3"
              >
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-recording-500 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-recording-400">
                    Something went wrong
                  </p>
                  <p className="text-xs text-recording-400/80 mt-1 break-words">
                    {errorMsg || 'An error occurred during processing.'}
                  </p>
                  {onRetry && (
                    <button onClick={onRetry} className="btn-secondary mt-3 text-xs py-2 px-3 touch-target">
                      Try Again
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
