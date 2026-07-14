'use client'

import { Calendar, Clock, FileText, Download, Trash2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export type MeetingHistoryItem = {
  id: string
  title: string
  date: string
  durationStr: string
  decisionCount: number
  actionItemCount: number
}

export function MeetingHistoryCard({ item, onDelete }: { item: MeetingHistoryItem; onDelete?: (id: string) => void }) {
  return (
    <div className="glass-card bg-surface-0/60 p-5 rounded-2xl border border-border/50 hover:border-accent-500 hover:-translate-y-1 hover:shadow-glow-accent transition-all duration-300 group relative cursor-pointer overflow-hidden">
      
      {/* Subtle animated background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-500/0 via-transparent to-purple-500/0 group-hover:from-accent-500/5 group-hover:to-purple-500/10 transition-colors duration-500 pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1">
          <Link href={`/results/${item.id}`} className="hover:text-accent-400 transition-colors">
            <h3 className="font-semibold text-lg text-primary">{item.title}</h3>
          </Link>
          <div className="flex items-center gap-4 text-xs text-muted font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {item.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {item.durationStr}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="btn-ghost p-2 hover:bg-surface-2 text-secondary hover:text-primary rounded-lg" title="Export">
            <Download className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete?.(item.id)}
            className="btn-ghost p-2 hover:bg-recording-500/20 text-secondary hover:text-recording-400 rounded-lg transition-colors" 
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-border-subtle text-xs font-medium text-secondary">
          <FileText className="w-3.5 h-3.5 text-accent-400" />
          {item.decisionCount} Decisions
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-border-subtle text-xs font-medium text-secondary">
          <div className="w-2 h-2 rounded-full bg-action-400" />
          {item.actionItemCount} Actions
        </div>
      </div>
      
      <Link 
        href={`/results/${item.id}`} 
        className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-accent-500/20 hover:scale-110"
      >
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
