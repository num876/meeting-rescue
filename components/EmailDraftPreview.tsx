'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface EmailDraftPreviewProps {
  initialSubject: string
  initialBody: string
  onContentChange: (subject: string, body: string) => void
}

export function EmailDraftPreview({
  initialSubject,
  initialBody,
  onContentChange,
}: EmailDraftPreviewProps) {
  const [subject, setSubject] = useState(initialSubject)
  const [body, setBody] = useState(initialBody)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${ta.scrollHeight}px`
  }, [])

  // Auto-resize on mount and whenever body changes
  useEffect(() => {
    resizeTextarea()
  }, [body, resizeTextarea])

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value)
    onContentChange(e.target.value, body)
  }

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value)
    onContentChange(subject, e.target.value)
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* ─── Header fields ─── */}
      <div className="space-y-0 px-5 pt-5 pb-4">
        {/* From */}
        <div className="flex items-center gap-3 py-2">
          <label className="text-xs font-medium text-muted uppercase tracking-wider w-16 shrink-0">
            From
          </label>
          <span className="text-sm text-secondary">me</span>
        </div>

        {/* To */}
        <div className="flex items-center gap-3 py-2 border-t border-border-subtle">
          <label className="text-xs font-medium text-muted uppercase tracking-wider w-16 shrink-0">
            To
          </label>
          <span className="text-sm text-muted italic">Add recipients…</span>
        </div>

        {/* Subject */}
        <div className="flex items-center gap-3 py-2 border-t border-border-subtle">
          <label
            htmlFor="email-subject"
            className="text-xs font-medium text-muted uppercase tracking-wider w-16 shrink-0"
          >
            Subject
          </label>
          <input
            id="email-subject"
            type="text"
            value={subject}
            onChange={handleSubjectChange}
            className="flex-1 bg-transparent text-sm font-medium text-primary
                       placeholder:text-muted
                       focus:outline-none focus:ring-0 min-h-[32px]"
            placeholder="Enter subject…"
          />
        </div>
      </div>

      {/* ─── Separator ─── */}
      <div className="h-px bg-border" />

      {/* ─── Body ─── */}
      <div className="relative px-5 pt-4 pb-8">
        <textarea
          ref={textareaRef}
          value={body}
          onChange={handleBodyChange}
          className="w-full bg-transparent text-sm text-primary font-mono leading-relaxed
                     placeholder:text-muted resize-none
                     focus:outline-none focus:ring-0
                     min-h-[200px]"
          placeholder="Compose your email…"
        />

        {/* Character count */}
        <span className="absolute bottom-3 right-5 text-[11px] text-muted tabular-nums">
          {body.length.toLocaleString()} chars
        </span>
      </div>
    </div>
  )
}
