
export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">Terms of Service</h1>
        <p className="text-secondary">Last updated: October 14, 2023</p>
      </div>

      <div className="prose prose-invert prose-blue max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">1. Acceptance of Terms</h2>
          <p className="text-secondary leading-relaxed">
            By accessing or using MeetingRescue (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">2. Description of Service</h2>
          <p className="text-secondary leading-relaxed">
            MeetingRescue provides AI-powered transcription, summarization, and action item extraction from user-provided audio files. We use advanced language models to process this data. The accuracy of transcriptions and summaries may vary depending on audio quality, accents, and background noise.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">3. User Responsibilities & Consent</h2>
          <div className="glass-card bg-surface-0/60 p-6 rounded-2xl border-l-4 border-l-recording-500 mb-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Important Legal Notice Regarding Recording</h3>
            <p className="text-sm text-secondary">
              Many jurisdictions require the consent of all parties present before a conversation can be recorded. <strong>You are solely responsible for obtaining all necessary consents and authorizations</strong> from participants before recording them and uploading those recordings to MeetingRescue.
            </p>
          </div>
          <p className="text-secondary leading-relaxed">
            You agree not to upload any audio recordings that contain classified government information, illegal content, or recordings made in violation of applicable wiretapping or privacy laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">4. Intellectual Property</h2>
          <p className="text-secondary leading-relaxed">
            You retain all ownership rights to the audio recordings you upload and the text summaries generated from them. MeetingRescue claims no ownership over your data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">5. Limitation of Liability</h2>
          <p className="text-secondary leading-relaxed">
            In no event shall MeetingRescue, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </section>
      </div>
    </div>
  )
}
