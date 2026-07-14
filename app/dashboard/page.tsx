'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, Calendar as CalendarIcon, History } from 'lucide-react'
import Link from 'next/link'
import { MeetingHistoryCard } from '@/components/MeetingHistoryCard'


import { useMeetingStore } from '@/store/useMeetingStore'

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const meetings = useMeetingStore(state => state.meetings)
  const removeMeeting = useMeetingStore(state => state.removeMeeting)

  // Hydration fix for zustand persist (delay rendering list until mounted)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalMeetings = meetings.length
  const totalDecisions = meetings.reduce((acc, curr) => acc + curr.decisionCount, 0)
  const totalActionItems = meetings.reduce((acc, curr) => acc + curr.actionItemCount, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
            <History className="w-8 h-8 text-accent-500" />
            Meeting History
          </h1>
          <p className="text-secondary mt-1">
            Welcome back! You&apos;ve saved {Math.max(0, totalMeetings * 45)} minutes of manual note-taking.
          </p>
        </div>

        <Link href="/" className="btn-primary group">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          New Meeting
        </Link>
      </div>

      {/* Dynamic Statistics Row */}
      {mounted && totalMeetings > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10"
        >
          <div className="glass-card bg-surface-0/60 p-6 rounded-2xl border border-border/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent-500/20 transition-colors" />
            <div className="text-sm font-medium text-secondary mb-1 relative z-10">Total Meetings</div>
            <div className="text-3xl font-bold text-primary relative z-10">{totalMeetings}</div>
          </div>
          
          <div className="glass-card bg-surface-0/60 p-6 rounded-2xl border border-border/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-colors" />
            <div className="text-sm font-medium text-secondary mb-1 relative z-10">Action Items Tracked</div>
            <div className="text-3xl font-bold text-primary relative z-10">{totalActionItems}</div>
          </div>

          <div className="glass-card bg-surface-0/60 p-6 rounded-2xl border border-border/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-success-500/20 transition-colors" />
            <div className="text-sm font-medium text-secondary mb-1 relative z-10">Key Decisions</div>
            <div className="text-3xl font-bold text-primary relative z-10">{totalDecisions}</div>
          </div>
        </motion.div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted group-focus-within:text-accent-500 transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-1 border border-border rounded-xl py-2.5 pl-10 pr-4 text-primary placeholder-muted focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all hover:bg-surface-2"
            placeholder="Search meetings by title, topic, or person..."
          />
        </div>
        
        <div className="flex gap-2">
          <button className="btn-secondary bg-surface-2 text-primary border-accent-500/30 hover:border-accent-500">
            <Filter className="w-4 h-4 text-accent-400" />
            <span className="hidden sm:inline">All</span>
          </button>
          <button className="btn-secondary hover:text-primary transition-colors">
            <CalendarIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Date</span>
          </button>
        </div>
      </div>

      {/* Grid of Meetings */}
      {mounted && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1, type: "spring", stiffness: 100 }}
            >
              <MeetingHistoryCard item={item} onDelete={removeMeeting} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State (Hidden if we have items) */}
      {mounted && filteredMeetings.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-32 text-center relative"
        >
          {/* Animated Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-3000" />
          
          <div className="w-20 h-20 rounded-3xl bg-surface-1 border border-border flex items-center justify-center mb-6 relative z-10 shadow-lg shadow-black/20 animate-[bounce_3s_ease-in-out_infinite]">
            <History className="w-10 h-10 text-accent-500" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-3 relative z-10">No meetings yet</h2>
          <p className="text-secondary mb-8 max-w-sm relative z-10 text-lg">
            Upload your first recording to magically extract decisions, summaries, and action items.
          </p>
          <Link href="/" className="btn-primary relative z-10 hover:scale-105 transition-transform duration-300 shadow-glow-accent">
            Upload Recording
          </Link>
        </motion.div>
      )}

    </div>
  )
}
