import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(null)

const colors = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  warning: 'bg-accent',
  default: 'bg-gray-800',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, type = 'default') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[500] flex flex-col gap-2 items-center">
        {toasts.map(t => (
          <div key={t.id} className={`${colors[t.type]} text-white text-sm font-medium px-5 py-3 rounded-lg shadow-lg whitespace-nowrap`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
