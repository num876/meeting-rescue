import { streamObject } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { extractionSchema } from '@/lib/schema'

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
  baseURL: 'https://api.groq.com/openai/v1',
})

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json() as { transcript: string }

    if (!transcript || transcript.trim().length < 50) {
      return Response.json(
        { error: 'Transcript too short to extract meaningful content' },
        { status: 400 }
      )
    }

    const safeTranscript = transcript.length > 40000 
      ? transcript.substring(0, 40000) + "\n\n[TRUNCATED DUE TO LENGTH LIMIT]"
      : transcript;

    const result = await streamObject({
      model: groq('llama-3.3-70b-versatile'),
      schema: extractionSchema,
      prompt: `You are an expert meeting analyst. You will receive a raw meeting transcript, possibly imperfectly transcribed with some errors typical of automated speech-to-text. Extract the substance despite minor transcription noise.\n\nMEETING TRANSCRIPT:\n\n${safeTranscript}`,
      temperature: 0.2
    })

    return result.toTextStreamResponse()
  } catch (error: unknown) {
    const err = error as { status?: number };
    console.error('Extraction error:', error)
    if (err?.status === 429) {
      return Response.json({ error: 'Daily extraction limit reached. Resets at midnight UTC.' }, { status: 429 })
    }
    return Response.json({ error: 'Extraction failed' }, { status: 500 })
  }
}
