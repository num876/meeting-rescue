'use client'

import { useState, useRef } from 'react'

export function useAudioCompressor() {
  const [isCompressing, setIsCompressing] = useState(false)
  const [progress, setProgress] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ffmpegRef = useRef<any>(null)
  const loadedRef = useRef(false)

  const loadFFmpeg = async () => {
    if (loadedRef.current) return

    // Dynamically import FFmpeg only in the browser
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    const { toBlobURL } = await import('@ffmpeg/util')

    if (!ffmpegRef.current) {
      ffmpegRef.current = new FFmpeg()
    }

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    const ffmpeg = ffmpegRef.current

    ffmpeg.on('progress', ({ progress }: { progress: number }) => {
      setProgress(Math.round(progress * 100))
    })

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })

    loadedRef.current = true
  }

  const compressAudio = async (file: File | Blob): Promise<Blob> => {
    // Guard: only run in the browser
    if (typeof window === 'undefined') {
      return file instanceof Blob ? file : new Blob([file])
    }

    setIsCompressing(true)
    setProgress(0)
    try {
      await loadFFmpeg()
      const { fetchFile } = await import('@ffmpeg/util')
      const ffmpeg = ffmpegRef.current

      const inputName = 'input_audio'
      const outputName = 'output.mp3'

      await ffmpeg.writeFile(inputName, await fetchFile(file))
      await ffmpeg.exec(['-i', inputName, '-ar', '16000', '-ac', '1', '-b:a', '32k', outputName])

      const data = await ffmpeg.readFile(outputName)

      await ffmpeg.deleteFile(inputName)
      await ffmpeg.deleteFile(outputName)

      setIsCompressing(false)
      return new Blob([(data as Uint8Array).buffer], { type: 'audio/mp3' })
    } catch (error) {
      setIsCompressing(false)
      console.error('FFmpeg Compression error:', error)
      // Fall back to returning the original file uncompressed
      return file instanceof Blob ? file : new Blob([file])
    }
  }

  return { compressAudio, isCompressing, progress }
}
