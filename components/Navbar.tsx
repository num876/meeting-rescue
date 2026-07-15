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
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-16 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group min-h-10">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden flex items-center justify-center bg-background ring-1 ring-border/50 group-hover:ring-accent-500/50 transition-all shadow-glow-accent group-hover:shadow-[0_0_25px_#3b82f640] flex-shrink-0">
            <Image 
              src="/logo.png" 
              alt="MeetingRescue Logo" 
              width={32} 
              height={32}
              className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-primary whitespace-nowrap">
            Meeting<span className="text-accent-400">Rescue</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-1">
          <Link
            href="/"
            className={`btn-ghost text-sm touch-target ${pathname === '/' ? 'text-primary bg-surface-2' : ''}`}
          >
            New Meeting
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`btn-ghost text-sm touch-target ${pathname === '/dashboard' ? 'text-primary bg-surface-2' : ''}`}
              >
                Dashboard
              </Link>
              <div className="h-4 w-px bg-border mx-2" />
              <Link href="/settings" className="flex items-center gap-2 btn-ghost text-sm py-2 px-3 touch-target">
                <div className="w-6 h-6 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm ml-2 touch-target">Sign In</Link>
              <Link href="/signup" className="btn-primary py-2 px-4 ml-2 touch-target">Sign Up Free</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden btn-ghost p-2 touch-target"
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
              className="fixed top-0 right-0 bottom-0 w-72 bg-surface-0/95 backdrop-blur-xl border-l border-border z-50 sm:hidden pt-20 px-4 shadow-2xl flex flex-col"
            >
              <div className="flex flex-col gap-2">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors touch-target ${pathname === '/' ? 'text-primary bg-surface-2' : 'text-secondary hover:text-primary hover:bg-surface-2'}`}
                >
                  New Meeting
                </Link>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className={`py-3 px-4 rounded-lg font-medium transition-colors touch-target ${pathname === '/dashboard' ? 'text-primary bg-surface-2' : 'text-secondary hover:text-primary hover:bg-surface-2'}`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMobileOpen(false)}
                      className={`py-3 px-4 rounded-lg font-medium transition-colors touch-target ${pathname === '/settings' ? 'text-primary bg-surface-2' : 'text-secondary hover:text-primary hover:bg-surface-2'}`}
                    >
                      Settings
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/pricing"
                      onClick={() => setMobileOpen(false)}
                      className={`py-3 px-4 rounded-lg font-medium transition-colors touch-target ${pathname === '/pricing' ? 'text-primary bg-surface-2' : 'text-secondary hover:text-primary hover:bg-surface-2'}`}
                    >
                      Pricing
                    </Link>
                    <div className="pt-4 mt-6 border-t border-border/50 flex flex-col gap-2">
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="btn-secondary justify-center w-full touch-target"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMobileOpen(false)}
                        className="btn-primary justify-center w-full touch-target shadow-glow-accent"
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
