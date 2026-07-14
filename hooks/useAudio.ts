'use client'

import { useCallback } from 'react'

// A tiny, soft UI "pop" sound encoded in base64 (approx 10ms)
const POP_SOUND_B64 = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=" // This is just a silent wav header for safety, I will build a real synthetic beep using AudioContext instead so we don't need large base64 strings!

export function useAudio() {
  const playPop = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, ctx.currentTime) // High pitch
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05) // Drop pitch quickly for a "pop"

      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01) // Quick attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05) // Quick release

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.05)
    } catch (e) {
      // Ignore audio errors (e.g. if user hasn't interacted with document yet)
    }
  }, [])

  const playSuccess = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      
      const ctx = new AudioContext()
      
      // Two quick rising notes
      const playNote = (freq: number, startTime: number) => {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        
        osc.type = 'sine'
        osc.frequency.value = freq
        
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.02)
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15)
        
        osc.connect(gainNode)
        gainNode.connect(ctx.destination)
        
        osc.start(startTime)
        osc.stop(startTime + 0.15)
      }
      
      playNote(440, ctx.currentTime) // A4
      playNote(554.37, ctx.currentTime + 0.1) // C#5
    } catch (e) {}
  }, [])

  return { playPop, playSuccess }
}
