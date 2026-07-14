'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'

import { auth } from '@/lib/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)
    
    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess(true)
    } catch (err: unknown) {
      console.error(err)
      const error = err as Error
      setError(error.message || 'Failed to send password reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-glow-accent">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </Link>
        </div>

        <div className="glass-card bg-surface-0/80 p-8 rounded-3xl border border-border/50 shadow-2xl relative overflow-hidden">
          {/* Subtle noise overlay */}
          <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
          
          <div className="relative z-10">
            <h1 className="text-2xl font-bold tracking-tight text-primary mb-2 text-center">Reset Password</h1>
            <p className="text-sm text-secondary text-center mb-8">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-recording-500/10 border border-recording-500/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-recording-400 shrink-0 mt-0.5" />
                <p className="text-sm text-recording-400">{error}</p>
              </div>
            )}

            {success ? (
              <div className="text-center py-4">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-success-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-success-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-primary mb-2">Check your email</h3>
                <p className="text-sm text-secondary mb-6">
                  We sent a password reset link to <span className="text-primary font-medium">{email}</span>
                </p>
                <Link href="/login" className="btn-primary w-full py-3 justify-center">
                  Return to Login
                </Link>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleReset}>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-primary ml-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-muted" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-1 border border-border rounded-xl py-2.5 pl-10 pr-4 text-primary placeholder-muted focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading || !email} className="w-full btn-primary mt-6 py-3 justify-between group disabled:opacity-50">
                  <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-sm text-secondary text-center mt-8">
          Remember your password?{' '}
          <Link href="/login" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
