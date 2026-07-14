import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <span className="text-xl font-bold tracking-tight text-primary">
                Meeting<span className="text-accent-400">Rescue</span>
              </span>
            </Link>
            <p className="text-secondary text-sm max-w-xs">
              Turn messy meetings into clean summaries, firm decisions, and assigned action items — instantly and securely.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-primary mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-secondary">
              <li><Link href="/pricing" className="hover:text-accent-400 transition-colors">Pricing</Link></li>
              <li><Link href="/login" className="hover:text-accent-400 transition-colors">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-accent-400 transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-primary mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-secondary">
              <li><Link href="/privacy" className="hover:text-accent-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-accent-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/50 text-sm text-muted flex flex-col sm:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} MeetingRescue. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
