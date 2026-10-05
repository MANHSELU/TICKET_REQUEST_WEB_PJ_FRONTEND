import { CheckCircle2, XCircle } from 'lucide-react'
import '../../styles/common/Toast.css'

function Toast({ toast }) {
  if (!toast) return null

  const icon = toast.type === 'error' ? <XCircle size={20} /> : <CheckCircle2 size={20} />

  return (
    <div className="app-toast-overlay">
      <div className={`app-toast app-toast--${toast.type || 'success'}`}>
        <span className="app-toast__icon">{icon}</span>
        <p className="app-toast__message">{toast.message}</p>
      </div>
    </div>
  )
}

export default Toast
