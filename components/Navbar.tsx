'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

import { useAuthStore } from '@/store/useAuthStore'

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const user = useAuthStore(state => state.user)
  const initAuth = useAuthStore(state => state.init)

  React.useEffect(() => {
    initAuth()
  }, [initAuth])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-background ring-1 ring-border/50 group-hover:ring-accent-500/50 transition-all shadow-glow-accent group-hover:shadow-[0_0_25px_#3b82f640]">
            <Image 
              src="/logo.png" 
              alt="MeetingRescue Logo" 
              width={32} 
              height={32}
              className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-primary">
            Meeting<span className="text-accent-400">Rescue</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-1">
          <Link
            href="/"
            className={`btn-ghost text-sm ${pathname === '/' ? 'text-primary bg-surface-2' : ''}`}
          >
            New Meeting
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`btn-ghost text-sm ${pathname === '/dashboard' ? 'text-primary bg-surface-2' : ''}`}
              >
                Dashboard
              </Link>
              <div className="h-4 w-px bg-border mx-2" />
              <Link href="/settings" className="flex items-center gap-2 btn-ghost text-sm py-1.5 px-3">
                <div className="w-6 h-6 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center text-xs font-bold">
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm ml-2">Sign In</Link>
              <Link href="/signup" className="btn-primary py-1.5 px-4 ml-2">Sign Up Free</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden btn-ghost p-2"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 sm:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-surface-0/95 backdrop-blur-xl border-l border-border z-50 sm:hidden pt-20 px-6 shadow-2xl flex flex-col"
            >
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className={`text-lg font-medium transition-colors ${pathname === '/' ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                >
                  New Meeting
                </Link>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className={`text-lg font-medium transition-colors ${pathname === '/dashboard' ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMobileOpen(false)}
                      className={`text-lg font-medium transition-colors ${pathname === '/settings' ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                    >
                      Settings
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/pricing"
                      onClick={() => setMobileOpen(false)}
                      className={`text-lg font-medium transition-colors ${pathname === '/pricing' ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                    >
                      Pricing
                    </Link>
                    <div className="pt-6 mt-6 border-t border-border/50 flex flex-col gap-3">
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="btn-ghost justify-center text-secondary hover:text-primary"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMobileOpen(false)}
                        className="btn-primary justify-center shadow-glow-accent"
                      >
                        Sign Up Free
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
