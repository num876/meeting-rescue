'use client'

import { useState, useRef } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

export function useAudioCompressor() {
  const [isCompressing, setIsCompressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const ffmpegRef = useRef(new FFmpeg())
  const loadedRef = useRef(false)

  const loadFFmpeg = async () => {
    if (loadedRef.current) return
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    const ffmpeg = ffmpegRef.current
    
    ffmpeg.on('progress', ({ progress }) => {
      setProgress(Math.round(progress * 100))
    })

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
    
    loadedRef.current = true
  }

  const compressAudio = async (file: File | Blob): Promise<Blob> => {
    setIsCompressing(true)
    setProgress(0)
    try {
      await loadFFmpeg()
      const ffmpeg = ffmpegRef.current

      // Write file to ffmpeg FS
      const inputName = 'input_audio'
      const outputName = 'output.mp3'
      
      await ffmpeg.writeFile(inputName, await fetchFile(file))

      // Convert to 16kHz mono mp3 (highly compressed, perfect for voice AI)
      // -ar 16000 : audio sample rate 16kHz
      // -ac 1     : 1 channel (mono)
      // -b:a 32k  : 32 kbps bitrate
      await ffmpeg.exec(['-i', inputName, '-ar', '16000', '-ac', '1', '-b:a', '32k', outputName])

      const data = await ffmpeg.readFile(outputName)
      
      // Clean up FS
      await ffmpeg.deleteFile(inputName)
      await ffmpeg.deleteFile(outputName)

      setIsCompressing(false)
      
      // Return new highly compressed blob
      return new Blob([(data as Uint8Array).buffer], { type: 'audio/mp3' })
    } catch (error) {
      setIsCompressing(false)
      console.error("FFmpeg Compression error:", error)
      throw new Error("Failed to compress audio file")
    }
  }

  return { compressAudio, isCompressing, progress }
}
