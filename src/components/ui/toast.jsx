// src/components/ui/toast.jsx — shadcn/ui 표준 Toast + Toaster
import { useState, useCallback, createContext, useContext } from 'react'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const ToastContext = createContext(null)

const ICONS = {
  success: <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />,
  error:   <AlertCircle  size={16} className="text-destructive shrink-0" />,
  warning: <AlertTriangle size={16} className="text-amber-500 shrink-0" />,
  info:    <Info         size={16} className="text-blue-500 shrink-0" />,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback(id => {
    setToasts(p => p.map(t => t.id === id ? { ...t, removing: true } : t))
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 300)
  }, [])

  const toast = useCallback(({ title, description, variant = 'info', duration = 4000 }) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
    setToasts(p => [...p, { id, title, description, variant, removing: false }])
    if (duration > 0) setTimeout(() => dismiss(id), duration)
    return id
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

function Toaster({ toasts, onDismiss }) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 w-80 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3 rounded-lg border bg-background px-4 py-3 shadow-lg',
            'transition-all duration-300',
            t.removing ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0',
            {
              'border-emerald-200 bg-emerald-50': t.variant === 'success',
              'border-destructive/30 bg-destructive/5': t.variant === 'error',
              'border-amber-200 bg-amber-50': t.variant === 'warning',
              'border-border': t.variant === 'info',
            }
          )}
        >
          {ICONS[t.variant]}
          <div className="flex-1 min-w-0">
            {t.title && <p className="text-sm font-semibold leading-tight text-foreground">{t.title}</p>}
            {t.description && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t.description}</p>}
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}

export { Toaster }
