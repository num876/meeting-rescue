'use client'
import { useState, useRef } from 'react'
import { UploadCloud, FileText, ChevronDown, FileAudio, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { RecordButton } from './RecordButton'
import { toast } from './Toast'
import { useAudio } from '@/hooks/useAudio'

interface UploadZoneProps {
  onFileDrop: (file: File) => void
  onTranscriptPaste: (text: string) => void
  onRecordingComplete: (blob: Blob) => void
}

export function UploadZone({ onFileDrop, onTranscriptPaste, onRecordingComplete }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [pasteMode, setPasteMode] = useState(false)
  const [transcriptText, setTranscriptText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { playPop } = useAudio()

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|webm|m4a|ogg|flac)$/i))) {
      setSelectedFile(file)
      playPop()
    } else {
      toast('Please drop an audio file (MP3, WAV, WebM, M4A).', 'error')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      playPop()
    }
  }

  const handleProcessFile = () => {
    if (selectedFile) {
      if (selectedFile.size > 25 * 1024 * 1024) {
        toast('File exceeds 25MB limit. Please compress or split the audio.', 'error')
        return
      }
      onFileDrop(selectedFile)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      {/* Upload / Record Card */}
      <div
        className={`relative p-5 sm:p-10 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 glass-card bg-surface/50 overflow-hidden ${
          isDragging 
            ? 'border-accent-500 bg-accent-500/5' 
            : 'border-border/50 hover:border-accent-500/30 hover:bg-surface'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="audio/*,.mp3,.wav,.webm,.m4a,.ogg,.flac"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center gap-3 sm:gap-5">
          {/* Animated upload icon */}
          <motion.div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center flex-shrink-0"
            animate={isDragging ? { scale: [1, 1.1, 1], borderColor: 'var(--accent-500)' } : {}}
            transition={{ repeat: isDragging ? Infinity : 0, duration: 1.5 }}
          >
            <UploadCloud className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${isDragging ? 'text-accent-400' : 'text-secondary'}`} />
          </motion.div>

          <div className="text-center">
            <h3 className="text-base sm:text-lg font-semibold text-primary mb-1">
              {isDragging ? 'Drop your file here' : 'Upload a meeting recording'}
            </h3>
            <p className="text-xs sm:text-sm text-secondary">
              MP3, WebM, WAV, or M4A — max 25MB
            </p>
          </div>

          {/* Selected file preview */}
          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-surface-2 border border-border"
              >
                <FileAudio className="w-4 h-4 sm:w-5 sm:h-5 text-accent-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-primary truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted">{formatSize(selectedFile.size)}</p>
                </div>
                <button onClick={clearFile} className="btn-ghost p-1.5 rounded-lg flex-shrink-0 touch-target">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          {selectedFile ? (
            <button onClick={handleProcessFile} className="btn-primary btn-touch w-full sm:w-auto">
              Process Recording
            </button>
          ) : (
            <>
              <div className="w-full max-w-xs flex items-center gap-3 my-0 sm:my-1">
                <div className="h-px bg-border flex-1" />
                <span className="text-xs text-muted font-medium uppercase tracking-widest">or</span>
                <div className="h-px bg-border flex-1" />
              </div>

              <RecordButton onRecordingComplete={onRecordingComplete} />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary btn-touch w-full sm:w-auto"
              >
                Browse Files
              </button>
            </>
          )}
        </div>
      </div>

      {/* Paste Transcript Accordion */}
      <div className="glass-card overflow-hidden">
        <button
          onClick={() => {
            setPasteMode(!pasteMode)
            playPop()
          }}
          className="w-full flex items-center justify-between p-3 sm:p-4 lg:p-5 text-left hover:bg-surface-1 transition-colors min-h-[44px] sm:min-h-[52px] touch-target"
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-secondary flex-shrink-0" />
            <span className="font-medium text-primary text-xs sm:text-sm lg:text-base">Paste a transcript instead</span>
          </div>
          <motion.div animate={{ rotate: pasteMode ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
          </motion.div>
        </button>

        <AnimatePresence>
          {pasteMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="p-4 sm:p-5 lg:p-6 border-t border-border bg-surface-0/50 space-y-3">
                <textarea
                  value={transcriptText}
                  onChange={(e) => setTranscriptText(e.target.value)}
                  placeholder="Paste your meeting transcript here (from Zoom, Teams, Google Meet, etc.)..."
                  className="w-full h-40 sm:h-48 bg-background border border-border rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/20 resize-none font-mono transition-all"
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                  <p className="text-xs text-muted">
                    {transcriptText.length > 0
                      ? `${transcriptText.trim().length} characters`
                      : 'Minimum 50 characters required'}
                  </p>
                  <button
                    onClick={() => onTranscriptPaste(transcriptText)}
                    disabled={transcriptText.trim().length < 50}
                    className="btn-primary btn-touch w-full sm:w-auto"
                  >
                    Process Transcript
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
