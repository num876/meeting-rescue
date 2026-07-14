import { z } from 'zod'

export const extractionSchema = z.object({
  overallSummary: z.string().describe("2-3 sentence overall summary of what the meeting was about and what was accomplished"),
  attendeesDetected: z.array(z.string()).describe("Names of people mentioned as attending"),
  decisions: z.array(z.object({
    summary: z.string().describe("What was decided"),
    context: z.string().describe("Brief context of what led to this decision")
  })),
  actionItems: z.array(z.object({
    task: z.string().describe("A specific task someone needs to do"),
    owner: z.string().nullable().describe("The owner of the task, or null if unclear"),
    dueDate: z.string().nullable().describe("When the task is due, or null"),
    confidence: z.enum(['high', 'medium', 'low']).describe("How clearly this was stated vs inferred")
  })),
  emailDraft: z.object({
    subject: z.string().describe("A professional email subject line"),
    body: z.string().describe("A professional, concise follow-up email summarizing all of the above, ready to send")
  })
})
