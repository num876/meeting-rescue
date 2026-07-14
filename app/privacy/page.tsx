import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">Privacy Policy</h1>
        <p className="text-secondary">Last updated: October 14, 2023</p>
      </div>

      <div className="prose prose-invert prose-blue max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">1. Introduction</h2>
          <p className="text-secondary leading-relaxed">
            At MeetingRescue, we take your privacy extremely seriously. We understand that meetings often contain highly sensitive business information, personally identifiable information, and confidential discussions. 
          </p>
          <p className="text-secondary leading-relaxed mt-4">
            This Privacy Policy explains how we collect, use, and protect your information when you use our service. The short version: <strong>We process your audio ephemerally, we do not store your recordings, and we do not use your data to train AI models.</strong>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">2. How We Handle Your Audio</h2>
          <div className="glass-card bg-surface-0/60 p-6 rounded-2xl border-l-4 border-l-accent-500 mb-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Ephemeral Processing Guarantee</h3>
            <p className="text-sm text-secondary">
              When you upload an audio file to MeetingRescue, it is held in volatile memory (RAM) strictly for the duration of the transcription process. Once the transcription is complete, the audio file is immediately permanently deleted from our servers.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">3. Data Sent to Third-Party AI Providers</h2>
          <p className="text-secondary leading-relaxed mb-4">
            To provide lightning-fast transcriptions and high-quality summaries, we utilize third-party APIs (such as Groq and OpenAI). 
          </p>
          <ul className="list-disc pl-5 space-y-2 text-secondary">
            <li>We have Zero Data Retention (ZDR) agreements in place with our AI providers.</li>
            <li>Your transcripts and summaries are <strong>never</strong> used to train their foundational models.</li>
            <li>Data is transmitted securely using TLS 1.3 encryption.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">4. Meeting History Storage</h2>
          <p className="text-secondary leading-relaxed">
            By default, your generated text summaries, decisions, and action items are saved to your account so you can access them in your Dashboard. You have full control over this data. You can delete individual meeting records or wipe your entire account from the <Link href="/settings" className="text-accent-400 hover:underline">Settings</Link> page at any time. When you click delete, the data is hard-deleted from our databases immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">5. Contact Us</h2>
          <p className="text-secondary leading-relaxed">
            If you have any questions about this Privacy Policy or how we handle your data, please contact our Data Protection Officer at <strong>privacy@meetingrescue.app</strong>.
          </p>
        </section>
      </div>
    </div>
  )
}
