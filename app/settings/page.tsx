'use client'

import { useState, useEffect } from 'react'
import { User, Settings, CreditCard, Shield, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  // Hydration safety
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 min-h-[calc(100vh-64px)]">
      <div className="mb-10 relative rounded-3xl overflow-hidden bg-surface-1 border border-border/50 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Account Settings</h1>
          <p className="text-secondary mt-1">Manage your profile, billing, and preferences.</p>
        </div>
        <div className="relative w-48 h-32 rounded-2xl overflow-hidden border border-accent-500/20 hidden md:block z-10 shadow-glow-accent">
          <Image src="/images/settings_header.png" alt="Settings Tech Illustration" fill className="object-cover opacity-90" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-accent-500/10 text-accent-400' : 'text-secondary hover:text-primary hover:bg-surface-1'}`}
          >
            <User className="w-4 h-4" /> Profile
          </button>
          <button 
            onClick={() => setActiveTab('preferences')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'preferences' ? 'bg-accent-500/10 text-accent-400' : 'text-secondary hover:text-primary hover:bg-surface-1'}`}
          >
            <Settings className="w-4 h-4" /> Preferences
          </button>
          <button 
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'billing' ? 'bg-accent-500/10 text-accent-400' : 'text-secondary hover:text-primary hover:bg-surface-1'}`}
          >
            <CreditCard className="w-4 h-4" /> Billing
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-accent-500/10 text-accent-400' : 'text-secondary hover:text-primary hover:bg-surface-1'}`}
          >
            <Shield className="w-4 h-4" /> Security
          </button>

          <div className="pt-6 pb-2">
            <div className="h-px w-full bg-border" />
          </div>

          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-recording-400 hover:bg-recording-500/10 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 max-w-2xl">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-fade-in">
              <div className="glass-card bg-surface-0/60 p-6 rounded-2xl border border-border/50 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1">Personal Information</h3>
                  <p className="text-sm text-secondary">Update your name and email address.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-primary">Full Name</label>
                    <input type="text" defaultValue={user?.displayName || ''} className="w-full bg-surface-1 border border-border rounded-xl py-2.5 px-4 text-primary focus:outline-none focus:border-accent-500 transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-primary">Email Address</label>
                    <input type="email" defaultValue={user?.email || ''} className="w-full bg-surface-1 border border-border rounded-xl py-2.5 px-4 text-primary focus:outline-none focus:border-accent-500 transition-colors" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>

              <div className="glass-card bg-surface-0/60 p-6 rounded-2xl border border-recording-500/20 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-recording-400 mb-1">Danger Zone</h3>
                  <p className="text-sm text-secondary">Permanently delete your account and all meeting history.</p>
                </div>
                <button className="btn-danger">Delete Account</button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-8 animate-fade-in">
              <div className="glass-card bg-surface-0/60 p-6 rounded-2xl border border-border/50 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1">AI Output Preferences</h3>
                  <p className="text-sm text-secondary">Customize how MeetingRescue drafts your emails and summaries.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-primary">Default Email Tone</label>
                    <select className="w-full bg-surface-1 border border-border rounded-xl py-2.5 px-4 text-primary focus:outline-none focus:border-accent-500 transition-colors appearance-none">
                      <option>Professional & Concise</option>
                      <option>Friendly & Casual</option>
                      <option>Direct & Action-Oriented</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button className="btn-primary">Save Preferences</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-8 animate-fade-in">
              <div className="glass-card bg-surface-0/60 p-6 rounded-2xl border border-border/50 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1">Current Plan</h3>
                  <p className="text-sm text-secondary">You are currently on the Free Tier.</p>
                </div>

                <div className="bg-surface-1 border border-border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-primary">Free Plan</div>
                    <div className="text-sm text-secondary">5 meetings / month (25MB limit)</div>
                  </div>
                  <button className="btn-primary" onClick={() => window.location.href = '/pricing'}>
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-fade-in">
              <div className="glass-card bg-surface-0/60 p-6 rounded-2xl border border-border/50 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1">Password</h3>
                  <p className="text-sm text-secondary">Update your password to keep your account secure.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-primary">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-surface-1 border border-border rounded-xl py-2.5 px-4 text-primary focus:outline-none focus:border-accent-500 transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-primary">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-surface-1 border border-border rounded-xl py-2.5 px-4 text-primary focus:outline-none focus:border-accent-500 transition-colors" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button className="btn-primary">Update Password</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
