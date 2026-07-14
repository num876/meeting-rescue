'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Mail, ArrowUpRight } from 'lucide-react'

interface ExportButtonsProps {
  emailSubject: string
  emailBody: string
}

export function ExportButtons({ emailSubject, emailBody }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `Subject: ${emailSubject}\n\n${emailBody}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleMailto = () => {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
    window.location.href = mailtoLink
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      {/* ─── Copy Button ─── */}
      <button
        onClick={handleCopy}
        className="btn-secondary w-full sm:w-auto min-h-[44px] active:scale-[0.97]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              className="inline-flex items-center gap-2"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Check className="w-4 h-4 text-success-400" />
              Copied!
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              className="inline-flex items-center gap-2"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Copy className="w-4 h-4 text-secondary" />
              Copy
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* ─── Open in Email Button ─── */}
      <motion.button
        onClick={handleMailto}
        className="btn-primary w-full sm:w-auto min-h-[44px] active:scale-[0.97] group"
        whileHover="hover"
      >
        <Mail className="w-4 h-4" />
        Open in Email
        <motion.span
          className="inline-block"
          variants={{
            hover: { x: 1, y: -1 },
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </motion.span>
      </motion.button>
    </div>
  )
}
