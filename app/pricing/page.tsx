'use client'

import { Check, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-secondary">
          Stop wasting hours writing meeting notes. Start summarizing for free.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto relative">
        
        {/* Background glow behind Pro card */}
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-accent-500/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />

        {/* Free Tier */}
        <div className="glass-card bg-surface-0/60 p-8 rounded-3xl border border-border/50 relative z-10 flex flex-col">
          <div className="mb-8">
            <div className="relative w-full h-32 mb-6 rounded-2xl overflow-hidden border border-border/50">
              <Image src="/images/free_tier.png" alt="Free Tier Illustration" fill className="object-cover opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Free</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-primary">$0</span>
              <span className="text-secondary font-medium">/month</span>
            </div>
            <p className="text-sm text-secondary mt-4">
              Perfect for individuals wanting to try out AI meeting summaries.
            </p>
          </div>

          <div className="space-y-4 mb-8 flex-1">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-success-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-success-400" />
              </div>
              <span className="text-sm text-primary">5 meetings per month</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-success-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-success-400" />
              </div>
              <span className="text-sm text-primary">Max 25MB audio file size</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-success-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-success-400" />
              </div>
              <span className="text-sm text-primary">Powered by Groq Free Tier</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-success-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-success-400" />
              </div>
              <span className="text-sm text-primary">Standard Email Drafts</span>
            </div>
          </div>

          <Link href="/signup" className="btn-secondary w-full py-3 justify-center">
            Get Started Free
          </Link>
        </div>

        {/* Pro Tier */}
        <div className="glass-card bg-surface-0 p-8 rounded-3xl border-2 border-accent-500 shadow-glow-accent relative z-10 flex flex-col overflow-hidden">
          <div className="absolute top-0 right-0 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Most Popular
          </div>
          
          <div className="mb-8 mt-2">
            <div className="relative w-full h-32 mb-6 rounded-2xl overflow-hidden border border-accent-500/30">
              <Image src="/images/pro_tier.png" alt="Pro Tier Illustration" fill className="object-cover opacity-90" />
            </div>
            <h3 className="text-xl font-bold text-accent-400 mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Pro
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-primary">$12</span>
              <span className="text-secondary font-medium">/month</span>
            </div>
            <p className="text-sm text-secondary mt-4">
              For professionals who spend all day in meetings.
            </p>
          </div>

          <div className="space-y-4 mb-8 flex-1">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-accent-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-accent-400" />
              </div>
              <span className="text-sm font-medium text-primary">Unlimited meetings</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-accent-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-accent-400" />
              </div>
              <span className="text-sm font-medium text-primary">Max 1GB audio file size</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-accent-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-accent-400" />
              </div>
              <span className="text-sm font-medium text-primary">Bring Your Own API Key (OpenAI/Anthropic)</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-accent-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-accent-400" />
              </div>
              <span className="text-sm font-medium text-primary">Custom Email Tones & Templates</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-accent-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-accent-400" />
              </div>
              <span className="text-sm font-medium text-primary">Priority Support</span>
            </div>
          </div>

          <button 
            onClick={() => {
              const btn = document.getElementById('upgrade-btn') as HTMLButtonElement;
              if (btn) {
                btn.innerHTML = '<span class="flex items-center justify-center gap-2"><svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Redirecting to Stripe...</span>';
                btn.disabled = true;
              }
              setTimeout(() => {
                alert("This is a mock Stripe Checkout!\n\nIn a real app, this would redirect you to checkout.stripe.com to complete the $12/mo subscription.");
                if (btn) {
                  btn.innerHTML = 'Upgrade to Pro';
                  btn.disabled = false;
                }
              }, 1500)
            }}
            id="upgrade-btn"
            className="btn-primary w-full py-3 justify-center text-base transition-all"
          >
            Upgrade to Pro
          </button>
        </div>

      </div>
    </div>
  )
}
