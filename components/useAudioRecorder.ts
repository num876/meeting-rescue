'use client'
import { useState, useRef } from 'react'

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.start(200) // capture chunks every 200ms
      mediaRecorderRef.current = recorder
      setIsRecording(true)
    } catch (err) {
      console.error('Error accessing microphone:', err)
      alert('Could not access the microphone. Please check your permissions.')
    }
  }

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) return
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        resolve(blob)
        setIsRecording(false)
        mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop())
      }
      mediaRecorderRef.current.stop()
    })
  }

  return { isRecording, startRecording, stopRecording }
}
