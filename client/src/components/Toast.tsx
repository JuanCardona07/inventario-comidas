import { AlertCircle, CheckCircle, X, XCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export type ToastType = 'success' | 'error' | 'warning'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const timerRef = useRef<number | null>(null)
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running) return
    timerRef.current = window.setTimeout(() => {
      onClose()
    }, duration)
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [duration, onClose, running])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const iconProps = 'w-5 h-5 flex-shrink-0'
  const icon =
    type === 'success' ? (
      <CheckCircle className={`${iconProps}`} />
    ) : type === 'error' ? (
      <XCircle className={`${iconProps}`} />
    ) : (
      <AlertCircle className={`${iconProps}`} />
    )

  const palette =
    type === 'success'
      ? {
          wrap: 'bg-green-50 border-green-500 text-green-800',
          chip: 'bg-green-100 text-green-700 ring-green-200',
          glow: 'shadow-green-100',
        }
      : type === 'error'
      ? {
          wrap: 'bg-red-50 border-red-500 text-red-800',
          chip: 'bg-red-100 text-red-700 ring-red-200',
          glow: 'shadow-red-100',
        }
      : {
          wrap: 'bg-yellow-50 border-yellow-500 text-yellow-800',
          chip: 'bg-yellow-100 text-yellow-700 ring-yellow-200',
          glow: 'shadow-yellow-100',
        }

  return (
    <div
      onMouseEnter={() => setRunning(false)}
      onMouseLeave={() => setRunning(true)}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter') onClose()
      }}
      tabIndex={0}
      role="status"
      aria-live="polite"
      className={`group relative flex items-center gap-3 p-3 rounded-xl border-l-4 ${palette.wrap} animate-slide-in focus:outline-none shadow-md ${palette.glow}`}
      style={{ minWidth: 0, maxWidth: 440 }}
    >
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ring-1 ${palette.chip}`}>
        {icon}
      </div>
      <p className="flex-1 text-sm font-medium leading-5 truncate">{message}</p>
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="flex-shrink-0 p-1 rounded-md hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black/10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
