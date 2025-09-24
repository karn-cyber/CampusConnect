import React from 'react'
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

const Toast = ({ toasts, removeToast }) => {
  if (!toasts || toasts.length === 0) return null

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />
      case 'error':
        return <XCircle size={20} />
      case 'warning':
        return <AlertCircle size={20} />
      case 'info':
      default:
        return <Info size={20} />
    }
  }

  const getTypeClass = (type) => {
    switch (type) {
      case 'success':
        return 'toast-success'
      case 'error':
        return 'toast-error'
      case 'warning':
        return 'toast-warning'
      case 'info':
      default:
        return 'toast-info'
    }
  }

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${getTypeClass(toast.type)} ${toast.isExiting ? 'toast-exit' : 'toast-enter'}`}
        >
          <div className="toast-icon">
            {getIcon(toast.type)}
          </div>
          <div className="toast-content">
            <div className="toast-title">{toast.title}</div>
            {toast.message && (
              <div className="toast-message">{toast.message}</div>
            )}
          </div>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      ))}

      <style>{`
        .toast-container {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-width: 400px;
          pointer-events: none;
        }

        .toast {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          background: white;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border-left: 4px solid;
          pointer-events: auto;
          transform: translateX(100%);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          opacity: 0;
          max-width: 100%;
          word-wrap: break-word;
        }

        .toast-enter {
          transform: translateX(0);
          opacity: 1;
        }

        .toast-exit {
          transform: translateX(100%);
          opacity: 0;
        }

        .toast-success {
          border-left-color: #10b981;
          background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
        }

        .toast-success .toast-icon {
          color: #10b981;
        }

        .toast-error {
          border-left-color: #ef4444;
          background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
        }

        .toast-error .toast-icon {
          color: #ef4444;
        }

        .toast-warning {
          border-left-color: #f59e0b;
          background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
        }

        .toast-warning .toast-icon {
          color: #f59e0b;
        }

        .toast-info {
          border-left-color: #3b82f6;
          background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
        }

        .toast-info .toast-icon {
          color: #3b82f6;
        }

        .toast-icon {
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .toast-content {
          flex: 1;
          min-width: 0;
        }

        .toast-title {
          font-weight: 600;
          font-size: 0.9rem;
          color: #1f2937;
          margin-bottom: 0.25rem;
          line-height: 1.4;
        }

        .toast-message {
          font-size: 0.85rem;
          color: #6b7280;
          line-height: 1.4;
        }

        .toast-close {
          flex-shrink: 0;
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .toast-close:hover {
          color: #6b7280;
          background: rgba(0, 0, 0, 0.05);
        }

        @media (max-width: 768px) {
          .toast-container {
            top: 0.5rem;
            right: 0.5rem;
            left: 0.5rem;
            max-width: none;
          }

          .toast {
            padding: 0.875rem 1rem;
          }

          .toast-title {
            font-size: 0.85rem;
          }

          .toast-message {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Toast
