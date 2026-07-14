'use client'
import { useState, useRef, useEffect } from 'react'
import { Mic } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAudioRecorder } from './useAudioRecorder'

interface RecordButtonProps {
  onRecordingComplete: (blob: Blob) => void
}

export function RecordButton({ onRecordingComplete }: RecordButtonProps) {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isRecording) {
      setElapsed(0)
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRecording])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const handleToggle = async () => {
    if (isRecording) {
      const blob = await stopRecording()
      onRecordingComplete(blob)
    } else {
      await startRecording()
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleToggle}
        className={`relative flex items-center justify-center gap-3 min-h-[56px] px-8 py-4 rounded-full font-semibold text-base transition-all active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          isRecording
            ? 'bg-recording-500/10 text-recording-400 border-2 border-recording-500/50 shadow-glow-recording focus-visible:ring-recording-500'
            : 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg hover:shadow-glow-accent focus-visible:ring-accent-500'
        }`}
      >
        {isRecording ? (
          <>
            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-recording-500/30"
              animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />

            {/* Waveform bars */}
            <div className="flex items-center gap-[3px] h-5">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-[3px] rounded-full bg-recording-400"
                  animate={{
                    height: ['8px', `${12 + Math.random() * 8}px`, '8px'],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6 + i * 0.1,
                    ease: 'easeInOut',
                    delay: i * 0.08,
                  }}
                />
              ))}
            </div>
            <span>Stop Recording</span>
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            <span>Record Now</span>
          </>
        )}
      </button>

      {/* Elapsed timer */}
      {isRecording && (
        <motion.span
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-sm text-recording-400 tabular-nums"
        >
          {formatTime(elapsed)}
        </motion.span>
      )}
    </div>
  )
}
