import OpenAI from 'openai'
import fs from 'fs'

export const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key_for_build',
  baseURL: 'https://api.groq.com/openai/v1'
})

// Transcription via Whisper — free tier
export async function transcribeAudio(filePath: string) {
  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: 'whisper-large-v3-turbo',
    response_format: 'verbose_json', // includes duration and language detection
    language: 'en' // omit this line if you want auto-detection instead
  })

  return transcription
}

export const EXTRACTION_SYSTEM_PROMPT = `
You are an expert meeting analyst. You will receive a raw meeting transcript, possibly imperfectly transcribed with some errors typical of automated speech-to-text. Extract the substance despite minor transcription noise.

YOUR TASK
1. Write a 2-3 sentence overall summary of what the meeting was about and what was accomplished.
2. Extract every clear DECISION that was made — something the group explicitly agreed on or resolved, not just discussed.
3. Extract every ACTION ITEM — a specific task someone needs to do. For each, identify the owner if the transcript makes it reasonably clear who's responsible. If genuinely unclear, set owner to null rather than guessing.
4. Detect likely attendee names mentioned in the transcript (best effort — transcripts often only capture first names or partial context).
5. Draft a professional, concise follow-up email summarizing all of the above, ready to send to attendees.

RULES
- Do not invent decisions or action items that weren't actually discussed. If the meeting was mostly discussion with no concrete outcomes, say so honestly rather than manufacturing false action items.
- Distinguish between things that were firmly decided versus things that were merely proposed or discussed — only firm decisions go in the decisions list.
- Keep the email draft genuinely usable — a real person should be able to copy this and send it with minimal editing.
- If the transcript is too short, garbled, or unclear to extract meaningful content, say so directly rather than fabricating structure around insufficient material.

OUTPUT FORMAT
Return valid JSON only, no markdown fences, no commentary:
{
  "overallSummary": "string",
  "attendeesDetected": ["string"],
  "decisions": [{ "summary": "string", "context": "string" }],
  "actionItems": [{ "task": "string", "owner": "string or null", "dueDate": "string or null", "confidence": "high|medium|low" }],
  "emailDraft": { "subject": "string", "body": "string" }
}
`

export async function extractMeetingContent(transcript: string) {
  // Safety check: Prevent context window overflow (limit to roughly 10,000 words / 40k chars)
  const safeTranscript = transcript.length > 40000 
    ? transcript.substring(0, 40000) + "\n\n[TRUNCATED DUE TO LENGTH LIMIT]"
    : transcript;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
      { role: 'user', content: `MEETING TRANSCRIPT:\n\n${safeTranscript}\n\nExtract the structured content now. Return valid JSON only.` }
    ],
    temperature: 0.2, // lower temperature — this is an extraction task, not creative writing
    max_tokens: 2000,
    response_format: { type: 'json_object' } // Enforce valid JSON output
  })

  const raw = completion.choices[0].message.content!
  
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    console.error('Failed to parse LLM output as JSON:', raw)
    // Return a safe fallback object to prevent UI crashes
    return {
      overallSummary: "Failed to extract summary. The AI generated invalid formatting.",
      attendeesDetected: [],
      decisions: [],
      actionItems: [],
      emailDraft: { subject: "Meeting Notes Error", body: "We encountered an error processing this transcript." }
    }
  }
}
