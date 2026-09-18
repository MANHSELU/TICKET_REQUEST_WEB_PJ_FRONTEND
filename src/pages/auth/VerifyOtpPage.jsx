import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Gauge, KeyRound, ShieldCheck, Sliders, Zap } from 'lucide-react'
import Alert from '../../components/common/Alert'
import backgroundImg from '../../assets/background.png'
import logoImg from '../../assets/logo.png'
import '../../styles/auth/LoginPage.css'
import '../../styles/auth/RegisterPage.css'
import { verifyOtpApi, resendOtpApi } from '../../services/auth/auth.service'

const RESEND_COOLDOWN_SECONDS = 60
const OTP_LENGTH = 6

function VerifyOtpPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ''
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(''))
  const otp = otpDigits.join('')
  const inputRefs = useRef([])
  const [alert, setAlert] = useState({ type: 'error', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return

    const timer = setInterval(() => {
      setCooldown((value) => value - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setAlert({ type: 'error', message: '' })

    if (otp.length !== 6) {
      setAlert({ type: 'error', message: 'Vui lòng nhập đủ 6 chữ số' })
      return
    }

    setIsSubmitting(true)
    try {
      await verifyOtpApi({ email, otp });
      setAlert({ type: 'success', message: 'Xác thực thành công. Bạn có thể đăng nhập' });
      setTimeout(() => {
      navigate('/auth/login');
      }, 3000);
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Đã có lỗi xảy ra' });
    } finally {
      setIsSubmitting(false);
    };
  };

  const handleResend = async () => {
    setAlert({ type: 'error', message: '' })
    setIsResending(true)
    try {
      await resendOtpApi({ email });
      setAlert({ type: 'success', message: 'Gửi lại mã xác thực thành công. Vui lòng thử lại' });
      setCooldown(RESEND_COOLDOWN_SECONDS)
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Đã có lỗi xảy ra' });
    } finally {
    setIsResending(false);
    };
  };

  const handleDigitChange = (index, rawValue) => {
    const value = rawValue.replace(/\D/g, '')
    if (!value) {
      setOtpDigits((digits) => {
        const next = [...digits]
        next[index] = ''
        return next
      })
      return
    }

    setOtpDigits((digits) => {
      const next = [...digits]
      next[index] = value[value.length - 1]
      return next
    })

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleDigitKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleDigitPaste = (event) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return

    const nextDigits = Array(OTP_LENGTH).fill('')
    for (let i = 0; i < pasted.length; i += 1) {
      nextDigits[i] = pasted[i]
    }
    setOtpDigits(nextDigits)

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className="login-page">
      <aside
        className="login-hero login-hero--full"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div className="login-hero__content">
          <div className="login-hero__top">
            <div className="brand">
              <span className="brand__mark">
                <img src={logoImg} alt="NexusIT" />
              </span>
              <div className="brand__text">
                <div className="brand__name">NEXUS IT SUPPORT</div>
              </div>
            </div>
            <div className="status-pill">
              <span className="status-dot" />
              Phần mềm vận hành đội ngũ hỗ trợ
            </div>
          </div>

          <div className="login-hero__body">
            <span className="eyebrow">
              <Sliders size={14} />
              QUẢN LÝ DỊCH VỤ CNTT TRỌNG YẾU
            </span>
            <h1>Vận hành Dịch vụ CNTT Doanh nghiệp Thế hệ mới</h1>
            <p className="login-hero__subtitle">
              Trao quyền cho các đội ngũ kỹ thuật đa khu vực với khả năng phân
              loại sự cố bằng AI, tự động hóa cấp phát máy trạm và bảo mật
              tài sản theo chiều sâu.
            </p>

            <div className="stat-grid">
              <div className="stat-card">
                <span className="stat-card__label">
                  <Zap size={14} />
                  TIẾP NHẬN YÊU CẦU
                </span>
                <span className="stat-card__value">Gửi ticket hỗ trợ</span>
                <span className="stat-card__hint">Tạo và theo dõi yêu cầu hỗ trợ CNTT</span>
              </div>
              <div className="stat-card">
                <span className="stat-card__label">
                  <Gauge size={14} />
                  THEO DÕI TIẾN ĐỘ
                </span>
                <span className="stat-card__value">Trạng thái xử lý</span>
                <span className="stat-card__hint">Cập nhật tiến trình xử lý sự cố</span>
              </div>
              <div className="stat-card">
                <span className="stat-card__label">
                  <ShieldCheck size={14} />
                  QUẢN LÝ THIẾT BỊ
                </span>
                <span className="stat-card__value">Tài sản CNTT</span>
                <span className="stat-card__hint">Theo dõi máy trạm và thiết bị được cấp phát</span>
              </div>
              <div className="stat-card">
                <span className="stat-card__label">
                  <KeyRound size={14} />
                  HỖ TRỢ KỸ THUẬT
                </span>
                <span className="stat-card__value">Đội ngũ chuyên trách</span>
                <span className="stat-card__hint">Kết nối trực tiếp với bộ phận hỗ trợ</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="login-panel login-panel--modal register-panel">
        <div className="login-panel__content">
          <div className="brand brand--light">
            <span className="brand__mark">
              <img src={logoImg} alt="NexusIT" />
            </span>
            <div className="brand__text">
              <div className="brand__name brand__name--dark">NEXUS IT SUPPORT</div>
            </div>
          </div>

          <h2 className="login-panel__title">Xác thực tài khoản</h2>
          <p className="login-panel__subtitle">
            Mã OTP đã được gửi tới email{' '}
            <strong className="otp-email-highlight">{email || 'của bạn'}</strong>. Vui lòng kiểm tra hộp thư
            và nhập mã bên dưới.
          </p>

          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, message: '' })}
          />

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field__label">Mã OTP</span>
              <div className="otp-input-group">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => handleDigitChange(index, event.target.value)}
                    onKeyDown={(event) => handleDigitKeyDown(index, event)}
                    onPaste={handleDigitPaste}
                    className="otp-input-box"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
            </label>

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xác thực...' : 'Xác thực'}
            </button>
          </form>

          <div className="login-panel__footer">
            <span>
              Không nhận được mã?{' '}
              <button
                type="button"
                className="link"
                onClick={handleResend}
                disabled={isResending || cooldown > 0}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
              >
                {isResending
                  ? 'Đang gửi lại...'
                  : cooldown > 0
                    ? `Gửi lại mã OTP (${cooldown}s)`
                    : 'Gửi lại mã OTP'}
              </button>
            </span>
          </div>

          <div className="login-panel__footer">
            <span>
              Quay lại <Link to="/auth/login" className="link">Đăng nhập</Link>
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default VerifyOtpPage
