import { useState } from 'react'

// Toast Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = Date.now() + Math.random()
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast,
      isExiting: false,
    }

    setToasts(prev => [...prev, newToast])

    // Auto remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }

  const removeToast = (id) => {
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, isExiting: true } : toast
      )
    )

    // Actually remove from array after animation
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 300)
  }

  const success = (title, message = '', duration = 4000) => {
    return addToast({ type: 'success', title, message, duration })
  }

  const error = (title, message = '', duration = 6000) => {
    return addToast({ type: 'error', title, message, duration })
  }

  const warning = (title, message = '', duration = 5000) => {
    return addToast({ type: 'warning', title, message, duration })
  }

  const info = (title, message = '', duration = 4000) => {
    return addToast({ type: 'info', title, message, duration })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}
