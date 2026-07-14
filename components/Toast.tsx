'use client'
import { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

let addToastGlobal: ((message: string, type: ToastType) => void) | null = null

export function toast(message: string, type: ToastType = 'info') {
  addToastGlobal?.(message, type)
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  useEffect(() => {
    addToastGlobal = addToast
    return () => { addToastGlobal = null }
  }, [addToast])

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-success-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-recording-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-accent-400 shrink-0" />,
  }

  const borders = {
    success: 'border-success-500/30',
    error: 'border-recording-500/30',
    info: 'border-accent-500/30',
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl bg-surface-1/95 backdrop-blur-lg border ${borders[t.type]} shadow-lg`}
          >
            {icons[t.type]}
            <p className="text-sm text-primary flex-1">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="text-muted hover:text-secondary transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
