import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import '../../styles/common/Alert.css'

function Alert({ type = 'error', message, onClose }) {
  if (!message) return null

  const icon = {
    error: <XCircle size={18} />,
    success: <CheckCircle2 size={18} />,
    warning: <AlertTriangle size={18} />,
  }[type]

  return (
    <div className={`app-alert app-alert--${type}`} role="alert">
      <span className="app-alert__icon">{icon}</span>
      <p className="app-alert__message">{message}</p>
      {onClose && (
        <button
          type="button"
          className="app-alert__close"
          onClick={onClose}
          aria-label="Đóng thông báo"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default Alert
