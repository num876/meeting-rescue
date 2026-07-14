import { transcribeAudio } from '@/lib/groq'
import { writeFile, unlink } from 'fs/promises'
import path from 'path'
import os from 'os'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return Response.json({ error: 'No audio file provided' }, { status: 400 })
    }

    // Free tier limitation check (e.g. naive client side check, but good to enforce on server too)
    if (audioFile.size > 25 * 1024 * 1024) {
      return Response.json({ error: 'File size exceeds 25MB limit. Please compress or split the audio.' }, { status: 400 })
    }

    // Groq's Whisper API needs a file, so write the upload to a temp path first
    const buffer = Buffer.from(await audioFile.arrayBuffer())
    const tempPath = path.join(os.tmpdir(), `meeting-${Date.now()}.webm`)
    await writeFile(tempPath, buffer)

    let result;
    try {
      result = await transcribeAudio(tempPath)
    } finally {
      // Ensure the temp file is ALWAYS deleted to prevent disk leaks
      await unlink(tempPath).catch(err => console.error('Failed to delete temp file:', err))
    }

    const resAny = result as { duration?: number; language?: string };
    return Response.json({
      fullText: result.text,
      durationSeconds: resAny.duration || 0,
      language: resAny.language || 'en'
    })
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err?.status === 429) {
      return Response.json(
        { error: 'Daily transcription limit reached. Resets at midnight UTC.' },
        { status: 429 }
      )
    }
    console.error('Transcription error:', error)
    return Response.json({ error: 'Transcription failed' }, { status: 500 })
  }
}
