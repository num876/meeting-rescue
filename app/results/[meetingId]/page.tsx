'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, Variants } from 'framer-motion'
import { Users, Clock, FileText, ChevronDown } from 'lucide-react'
import { DecisionsList } from '@/components/DecisionsList'
import { ActionItemsList } from '@/components/ActionItemsList'
import { EmailDraftPreview } from '@/components/EmailDraftPreview'
import { ExportButtons } from '@/components/ExportButtons'
import type { MeetingSummary } from '@/types/meeting'

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<MeetingSummary | null>(null)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [showTranscript, setShowTranscript] = useState(false)

  useEffect(() => {
    const meetingId = params.meetingId
    if (meetingId) {
      const stored = sessionStorage.getItem(`meeting_${meetingId}`)
      if (stored) {
        const parsed: MeetingSummary = JSON.parse(stored)
        setData(parsed)
        setEmailSubject(parsed.emailDraft?.subject || 'Meeting Summary')
        setEmailBody(parsed.emailDraft?.body || '')
      } else {
        router.push('/')
      }
    }
  }, [params.meetingId, router])

  if (!data) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        {/* Skeleton loading */}
        <div className="w-full max-w-3xl space-y-6 animate-pulse">
          <div className="h-10 bg-surface-2 rounded-xl w-2/3" />
          <div className="h-4 bg-surface-1 rounded-lg w-1/3" />
          <div className="h-32 bg-surface-1 rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-28 bg-surface-1 rounded-xl" />
            <div className="h-28 bg-surface-1 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  const wordCount = data.fullTranscript?.split(/\s+/).length || 0

  return (
    <main className="min-h-[calc(100vh-4rem)] relative overflow-hidden pb-20">
      {/* Background orbs */}
      <div className="glow-orb glow-orb-blue w-[400px] h-[400px] -top-32 right-0 opacity-25" />
      <div className="glow-orb glow-orb-purple w-[300px] h-[300px] bottom-1/4 -left-20 opacity-20" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10"
      >
        {/* ── Header ────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary leading-tight">
                {data.title || 'Meeting Summary'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-secondary">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(data.createdAt).toLocaleDateString(undefined, {
                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  {wordCount.toLocaleString()} words
                </span>
              </div>
            </div>
            <button onClick={() => router.push('/')} className="btn-secondary text-xs shrink-0">
              New Meeting
            </button>
          </div>

          {/* Attendees */}
          {data.attendeesDetected && data.attendeesDetected.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Users className="w-4 h-4 text-secondary" />
              {data.attendeesDetected.map((name, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-2 border border-border-subtle text-xs font-medium text-primary"
                >
                  <span className="w-5 h-5 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center text-[10px] font-bold uppercase">
                    {name.charAt(0)}
                  </span>
                  {name}
                </span>
              ))}
            </div>
          )}

          {/* Audio Player */}
          {data.audioUrl && (
            <motion.div variants={fadeUp} className="w-full pt-4">
              <audio controls className="w-full h-12 rounded-lg bg-surface-1 outline-none [&::-webkit-media-controls-panel]:bg-surface-1 [&::-webkit-media-controls-current-time-display]:text-primary [&::-webkit-media-controls-time-remaining-display]:text-primary">
                <source src={data.audioUrl} />
                Your browser does not support the audio element.
              </audio>
            </motion.div>
          )}
        </motion.div>

        {/* ── Summary ───────────────────────────────────────── */}
        <motion.section variants={fadeUp} className="space-y-3">
          <h2 className="section-header">Summary</h2>
          <div className="glass-card p-5 sm:p-6 border-l-2 border-l-accent-500">
            <p className="text-primary leading-relaxed text-[15px]">{data.overallSummary}</p>
          </div>
        </motion.section>

        {/* ── Decisions ─────────────────────────────────────── */}
        <motion.section variants={fadeUp} className="space-y-3">
          <h2 className="section-header">
            Decisions
            {data.decisions?.length > 0 && (
              <span className="ml-2 text-muted font-normal">({data.decisions.length})</span>
            )}
          </h2>
          <DecisionsList decisions={data.decisions} />
        </motion.section>

        {/* ── Action Items ──────────────────────────────────── */}
        <motion.section variants={fadeUp} className="space-y-3">
          <h2 className="section-header">
            Action Items
            {data.actionItems?.length > 0 && (
              <span className="ml-2 text-muted font-normal">({data.actionItems.length})</span>
            )}
          </h2>
          <ActionItemsList actionItems={data.actionItems} />
        </motion.section>

        {/* ── Email Draft ───────────────────────────────────── */}
        <motion.section variants={fadeUp} className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="section-header">Email Draft</h2>
            <ExportButtons emailSubject={emailSubject} emailBody={emailBody} />
          </div>
          <EmailDraftPreview
            initialSubject={data.emailDraft?.subject || 'Meeting Summary'}
            initialBody={data.emailDraft?.body || ''}
            onContentChange={(s, b) => {
              setEmailSubject(s)
              setEmailBody(b)
            }}
          />
        </motion.section>

        {/* ── Transcript ────────────────────────────────────── */}
        <motion.section variants={fadeUp} className="border-t border-border pt-6">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full flex items-center justify-center gap-2 py-4 text-secondary hover:text-primary transition-colors min-h-[48px] rounded-xl hover:bg-surface-1"
          >
            <span className="text-sm font-medium">
              {showTranscript ? 'Hide' : 'View'} Full Transcript
            </span>
            <motion.div animate={{ rotate: showTranscript ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>

          {showTranscript && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 overflow-hidden"
            >
              <div className="glass-card p-5 sm:p-6 max-h-96 overflow-y-auto">
                <pre className="font-mono text-sm text-primary/90 whitespace-pre-wrap leading-relaxed">
                  {data.fullTranscript}
                </pre>
              </div>
            </motion.div>
          )}
        </motion.section>
      </motion.div>
    </main>
  )
}
