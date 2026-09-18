import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  Gauge,
  KeyRound,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sliders,
  User,
  Zap,
} from 'lucide-react'
import Alert from '../../components/common/Alert'
import backgroundImg from '../../assets/background.png'
import logoImg from '../../assets/logo.png'
import '../../styles/auth/LoginPage.css'
import '../../styles/auth/RegisterPage.css'
import { registerApi } from '../../services/auth/auth.service';

function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const [alert, setAlert] = useState({ type: 'error', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setAlert({ type: 'error', message: '' })
    setIsSubmitting(true);
    try {
      await registerApi({fullName, phone, email, password, confirmPass});
      setAlert({ type: 'success', message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.' })
      navigate('/auth/verify-otp', { state: { email } })
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Đã có lỗi xảy ra' });
    } finally {
      setIsSubmitting(false);
    };
  };

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

          <h2 className="login-panel__title">Tạo tài khoản mới</h2>
          <p className="login-panel__subtitle">
            Đăng ký để gửi và theo dõi yêu cầu hỗ trợ CNTT của bạn.
          </p>

          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, message: '' })}
          />

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field__label">Họ và tên</span>
              <span className="field__control">
                <User size={18} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                />
              </span>
            </label>

            <label className="field">
              <span className="field__label">Số điện thoại</span>
              <span className="field__control">
                <Phone size={18} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="0912345678"
                  autoComplete="tel"
                />
              </span>
            </label>

            <label className="field">
              <span className="field__label">Email</span>
              <span className="field__control">
                <Mail size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="ban@fpt.edu.vn"
                  autoComplete="username"
                />
              </span>
            </label>

            <label className="field">
              <span className="field__label">Mật khẩu</span>
              <span className="field__control">
                <Lock size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Tối thiểu 8 ký tự, có ký tự đặc biệt"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="field__toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            <label className="field">
              <span className="field__label">Xác nhận mật khẩu</span>
              <span className="field__control">
                <Lock size={18} />
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  value={confirmPass}
                  onChange={(event) => setConfirmPass(event.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="field__toggle"
                  onClick={() => setShowConfirmPass((value) => !value)}
                  aria-label={showConfirmPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </form>

          <div className="login-panel__footer">
            <span>
              Đã có tài khoản? <Link to="/auth/login" className="link">Đăng nhập</Link>
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default RegisterPage
