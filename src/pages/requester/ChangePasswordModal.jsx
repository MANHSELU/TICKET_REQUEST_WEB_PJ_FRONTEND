import { useState } from 'react'
import { Eye, EyeOff, KeyRound, Lock, X } from 'lucide-react'
import Alert from '../../components/common/Alert'
import '../../styles/auth/LoginPage.css'
import '../../styles/requester/NewTicketModal.css'
import '../../styles/requester/ChangePasswordModal.css'
import { changePasswordApi } from '../../services/requester/profileManagement.service'

function ChangePasswordModal({ open, onClose }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  const [alert, setAlert] = useState({ type: 'error', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!open) return null

  const handleClose = () => {
    setOldPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
    setAlert({ type: 'error', message: '' })
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setAlert({ type: 'error', message: '' })
    if (newPassword !== confirmNewPassword) {
      setAlert({ type: 'error', message: 'Mật khẩu xác nhận không khớp' })
      return
    }
    setIsSubmitting(true)
    try {
      await changePasswordApi({ oldPassword, newPassword })
      setAlert({ type: 'success', message: 'Đổi mật khẩu thành công' })
      setTimeout(handleClose, 1500)
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Đã có lỗi xảy ra' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="ticket-modal__overlay" onMouseDown={handleClose}>
      <div
        className="cpw-modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="ticket-modal__header">
          <h2>Đổi mật khẩu</h2>
          <button type="button" className="ticket-modal__close" onClick={handleClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </header>

        <div className="cpw-modal__body">
          <p className="cpw-modal__subtitle">
            Nên dùng mật khẩu mạnh, không trùng với các dịch vụ khác.
          </p>

          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, message: '' })}
          />

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field__label">Mật khẩu hiện tại</span>
              <span className="field__control">
                <Lock size={18} />
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(event) => setOldPassword(event.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="field__toggle"
                  onClick={() => setShowOldPassword((value) => !value)}
                  aria-label={showOldPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            <label className="field">
              <span className="field__label">Mật khẩu mới</span>
              <span className="field__control">
                <KeyRound size={18} />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Tối thiểu 8 ký tự, có ký tự đặc biệt"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="field__toggle"
                  onClick={() => setShowNewPassword((value) => !value)}
                  aria-label={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            <label className="field">
              <span className="field__label">Xác nhận mật khẩu mới</span>
              <span className="field__control">
                <KeyRound size={18} />
                <input
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(event) => setConfirmNewPassword(event.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="field__toggle"
                  onClick={() => setShowConfirmNewPassword((value) => !value)}
                  aria-label={showConfirmNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            <div className="cpw-modal__actions">
              <button type="button" className="ticket-btn ticket-btn--ghost" onClick={handleClose}>
                Hủy
              </button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordModal
