export interface TranscriptionResult {
  fullText: string
  durationSeconds: number
  language: string
}

export interface ActionItem {
  id: string
  task: string
  owner: string | null           // null if unclear from transcript — flagged for user to fill in
  dueDate: string | null
  confidence: 'high' | 'medium' | 'low'  // how clearly this was stated vs inferred
}

export interface Decision {
  id: string
  summary: string
  context: string                // brief context of what led to this decision
}

export interface MeetingSummary {
  id: string
  title: string
  meetingDate: string
  attendeesDetected: string[]    // names mentioned in the transcript, best-effort extraction
  overallSummary: string          // 2-3 sentence high-level summary
  decisions: Decision[]
  actionItems: ActionItem[]
  emailDraft: {
    subject: string
    body: string
  }
  fullTranscript: string
  audioUrl?: string
  createdAt: string
}

export type PipelineStage = 'idle' | 'preparing' | 'transcribing' | 'extracting' | 'drafting' | 'complete' | 'error'
