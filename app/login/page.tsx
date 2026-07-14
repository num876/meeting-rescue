'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'

import { useRouter } from 'next/navigation'
import { auth, googleProvider, db } from '@/lib/firebase'
import { signInWithEmailAndPassword, signInWithPopup, AuthProvider } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Redirect already-logged-in users away from the login page
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace('/dashboard')
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleOAuthLogin = async (provider: AuthProvider) => {
    setError('')
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, provider)
      // Ensure they exist in Firestore (merge: true updates/creates without overwriting)
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        name: result.user.displayName,
        lastLogin: new Date().toISOString()
      }, { merge: true })

      router.push('/dashboard')
    } catch (err: unknown) {
      console.error(err)
      const error = err as Error
      if (error.message.includes('auth/popup-closed-by-user')) {
        return // Ignore this specific error silently
      }
      setError(error.message || 'Failed to sign in with provider')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch (err: unknown) {
      console.error(err)
      const error = err as Error
      setError(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs (Reused from landing page aesthetic) */}
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
            <h1 className="text-2xl font-bold tracking-tight text-primary mb-2 text-center">Welcome back</h1>
            <p className="text-sm text-secondary text-center mb-8">
              Sign in to view your meeting history.
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-recording-500/10 border border-recording-500/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-recording-400 shrink-0 mt-0.5" />
                <p className="text-sm text-recording-400">{error}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
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

              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-medium text-primary">Password</label>
                  <Link href="/forgot-password" className="text-xs text-accent-400 hover:text-accent-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-1 border border-border rounded-xl py-2.5 pl-10 pr-4 text-primary placeholder-muted focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary mt-6 py-3 justify-between group disabled:opacity-50">
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted font-medium uppercase tracking-wider">Or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="mt-6">
              <button onClick={() => handleOAuthLogin(googleProvider)} disabled={loading} className="btn-secondary w-full py-2.5 hover:bg-surface-2 transition-colors disabled:opacity-50 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        </div>

          <p className="text-sm text-secondary text-center mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>
      </motion.div>
    </div>
  )
}
