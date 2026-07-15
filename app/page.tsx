'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadZone } from '@/components/UploadZone'
import { PipelineProgress } from '@/components/PipelineProgress'
import { RotatingText } from '@/components/RotatingText'
import { AppPreviewCard } from '@/components/AppPreviewCard'
import { AnimatedTitle } from '@/components/AnimatedTitle'
import { Sparkles } from 'lucide-react'
import type { PipelineStage, MeetingSummary, Decision, ActionItem } from '@/types/meeting'
import type { SavedMeeting } from '@/store/useMeetingStore'
import { auth, storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useMeetingStore } from '@/store/useMeetingStore'

import { experimental_useObject as useObject } from '@ai-sdk/react'
import { extractionSchema } from '@/lib/schema'
import { useAudioCompressor } from '@/hooks/useAudioCompressor'

export default function Home() {
  const router = useRouter()
  const [stage, setStage] = useState<PipelineStage>('idle')
  const [durationStr, setDurationStr] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  
  const { compressAudio } = useAudioCompressor()
  
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | undefined>()

  const { submit, object } = useObject({
    api: '/api/extract',
    schema: extractionSchema,
    onFinish: async (event) => {
      if (!event.object) {
        setStage('error')
        setErrorMsg('Failed to generate summary')
        return
      }

      try {
        setStage('drafting')
        const data = event.object
        const meetingId = Date.now().toString()
        const summary: MeetingSummary = {
          id: meetingId,
          title: data.emailDraft?.subject || 'Meeting Summary',
          meetingDate: new Date().toISOString(),
          fullTranscript: currentTranscript,
          audioUrl: currentAudioUrl,
          // ensure arrays default correctly if partial
          overallSummary: data.overallSummary || '',
          attendeesDetected: data.attendeesDetected || [],
          decisions: (data.decisions || []).map((d, i) => ({
            id: `dec-${i}`,
            summary: d.summary || '',
            context: d.context || ''
          })),
          actionItems: (data.actionItems || []).map((a, i) => ({
            id: `act-${i}`,
            task: a.task || '',
            owner: a.owner || null,
            dueDate: a.dueDate || null,
            confidence: (a.confidence as 'high' | 'medium' | 'low') || 'medium'
          })),
          emailDraft: {
            subject: data.emailDraft?.subject || '',
            body: data.emailDraft?.body || ''
          },
          createdAt: new Date().toISOString()
        }

        const user = auth.currentUser
        // Always save to sessionStorage for the Results page to read
        sessionStorage.setItem(`meeting_${meetingId}`, JSON.stringify(summary))

        if (user) {
          const savedMeeting = {
            id: meetingId,
            title: summary.title,
            date: summary.meetingDate,
            durationStr: durationStr,
            decisionCount: summary.decisions.length,
            actionItemCount: summary.actionItems.length,
            summary: summary.overallSummary,
            decisions: summary.decisions,
            actionItems: summary.actionItems
          }
          await useMeetingStore.getState().addMeeting(savedMeeting, user.uid)
        }

        setTimeout(() => {
          setStage('complete')
          router.push(`/results/${meetingId}`)
        }, 800)
      } catch (error: unknown) {
        const err = error as Error
        setStage('error')
        setErrorMsg(err.message || 'Error saving meeting')
      }
    },
    onError: (error) => {
      setStage('error')
      setErrorMsg(error.message || 'Stream failed')
    }
  })

  const handleProcessTranscript = async (transcript: string, audioUrl?: string) => {
    setStage('extracting')
    setCurrentTranscript(transcript)
    setCurrentAudioUrl(audioUrl)
    submit({ transcript })
  }

  const handleProcessAudio = async (originalFile: Blob) => {
    try {
      setStage('transcribing') // Technically we compress first, but we can reuse this stage or add a 'compressing' stage.
      setErrorMsg('')

      const startTime = Date.now()
      
      // 1. Compress audio client-side using FFmpeg
      let fileToUpload = originalFile
      try {
        fileToUpload = await compressAudio(originalFile)
      } catch (err) {
        console.warn("Compression failed, falling back to original file", err)
      }

      const formData = new FormData()
      formData.append('audio', fileToUpload, 'recording.mp3')

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      })

      // Upload to Firebase Storage in parallel if logged in
      let audioUrlPromise: Promise<string | undefined> = Promise.resolve(undefined)
      const user = auth.currentUser
      if (user) {
        const audioRef = ref(storage, `audio/${user.uid}/${Date.now()}_recording.mp3`)
        audioUrlPromise = uploadBytes(audioRef, fileToUpload).then(() => getDownloadURL(audioRef)).catch(err => {
          console.error("Audio upload failed:", err)
          return undefined
        })
      }

      const [data, uploadedAudioUrl] = await Promise.all([res.json(), audioUrlPromise])

      if (!res.ok) {
        throw new Error(data.error || 'Failed to transcribe audio')
      }

      const elapsedStr = `${((Date.now() - startTime) / 1000).toFixed(1)}s`
      setDurationStr(elapsedStr)

      await handleProcessTranscript(data.fullText, uploadedAudioUrl)

    } catch (error: unknown) {
      const err = error as Error
      setStage('error')
      setErrorMsg(err.message)
    }
  }

  const handleRetry = () => {
    setStage('idle')
    setErrorMsg('')
    setDurationStr('')
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-28">
        
        {/* Split Layout Hero */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-8 items-center mb-12 sm:mb-20 lg:mb-24 animate-fade-in">
          
          {/* Left side: Text Content */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-xs sm:text-sm font-medium animate-slide-up">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Powered by Groq & Llama 3.3</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight sm:leading-tight lg:leading-[1.1] break-words">
              <AnimatedTitle text="Never lose a" delay={0.1} /><br />
              <div className="py-0.5 sm:py-1">
                <RotatingText words={['decision', 'deadline', 'insight', 'action item']} />
              </div>
              <AnimatedTitle text="again." delay={0.5} />
            </h1>
            
            <p className="text-secondary text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed animate-slide-up" style={{ animationDelay: '800ms' }}>
              Upload a recording or paste a transcript. Get a clean summary, firm decisions, action items with owners, and a send-ready follow-up email — in under 30 seconds.
            </p>
          </div>

          {/* Right side: App Preview Card (hidden on small screens to save space) */}
          <div className="hidden lg:block relative perspective-1000">
            <AppPreviewCard />
          </div>
        </div>

        {/* Main Content (Upload / Paste Zone) */}
        {stage === 'idle' || stage === 'error' ? (
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <UploadZone
              onFileDrop={handleProcessAudio}
              onTranscriptPaste={handleProcessTranscript}
              onRecordingComplete={handleProcessAudio}
            />
          </div>
        ) : null}
      </div>

      {/* Pipeline Takeover */}
      <PipelineProgress
        stage={stage}
        durationStr={durationStr}
        errorMsg={errorMsg}
        onRetry={handleRetry}
        partialSummary={object as Partial<MeetingSummary>}
      />
    </main>
  )
}
