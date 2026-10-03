import { useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Lock, PlusCircle, Search, SlidersHorizontal, Unlock, Users, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from './AdminLayout.jsx'
import {
  createUserApi,
  getUsersApi,
  searchUsersApi,
  updateUserStatusApi,
} from '../../services/admin/userManagement.service'
import '../../styles/requester/TicketHistoryPage.css'
import '../../styles/requester/NewTicketModal.css'
import '../../styles/admin/AdminCommon.css'

const ROLE_OPTIONS = [
  { value: 1, label: 'Người yêu cầu' },
  { value: 2, label: 'Nhân viên hỗ trợ' },
  { value: 4, label: 'Trưởng nhóm hỗ trợ' },
  { value: 8, label: 'Quản trị viên' },
]

const ROLE_LABEL = ROLE_OPTIONS.reduce((acc, role) => {
  acc[role.value] = role.label
  return acc
}, {})

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
}

function UserManagementPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const fetchUsers = async () => {
    try {
      const res = await getUsersApi()
      setUsers(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được danh sách người dùng')
    }
  }

  useEffect(() => {
    if (!keyword.trim()) {
      fetchUsers()
      return
    }

    const timeoutId = setTimeout(() => {
      searchUsersApi(keyword)
        .then((res) => setUsers(res.data.data))
        .catch((err) => setError(err.response?.data?.message || 'Tìm kiếm thất bại'))
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [keyword])

  const handleToggleStatus = async (user) => {
    try {
      await updateUserStatusApi(user.id, !user.isActive)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật trạng thái thất bại')
    }
  }

  const handleFormChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value })
  }

  const handleCreateUser = async (event) => {
    event.preventDefault()
    setFormError('')

    if (form.password !== form.confirmPassword) {
      setFormError('Mật khẩu xác nhận không khớp')
      return
    }

    setIsSubmitting(true)
    try {
      await createUserApi({
        ...form,
        role: Number(form.role),
      })
      setIsModalOpen(false)
      setForm(initialForm)
      fetchUsers()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout activeNav="users">
      <div className="thist-heading">
        <div className="thist-heading__title">
          <button
            type="button"
            className="thist-back-btn"
            onClick={() => navigate('/admin/dashboard')}
            aria-label="Quay lại"
          >
            <ArrowLeft size={18} />
          </button>
          <h1>Quản lý người dùng</h1>
        </div>
        <button type="button" className="thist-submit-btn" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={15} />
          Tạo người dùng
        </button>
      </div>

      {error && <p className="ticket-required">{error}</p>}

      <section className="thist-summary admin-summary--3col">
        <div className="thist-summary-card">
          <div>
            <div className="thist-summary-card__value">{users.length}</div>
            <div className="thist-summary-card__label">TỔNG NGƯỜI DÙNG</div>
          </div>
          <span className="thist-summary-card__icon thist-summary-card__icon--neutral">
            <Users size={18} />
          </span>
        </div>
        <div className="thist-summary-card">
          <div>
            <div className="thist-summary-card__value">
              {users.filter((user) => user.isActive).length}
            </div>
            <div className="thist-summary-card__label">ĐANG HOẠT ĐỘNG</div>
          </div>
          <span className="thist-summary-card__icon thist-summary-card__icon--success">
            <CheckCircle2 size={18} />
          </span>
        </div>
        <div className="thist-summary-card">
          <div>
            <div className="thist-summary-card__value">
              {users.filter((user) => !user.isActive).length}
            </div>
            <div className="thist-summary-card__label">ĐÃ KHÓA</div>
          </div>
          <span className="thist-summary-card__icon thist-summary-card__icon--danger">
            <Lock size={18} />
          </span>
        </div>
      </section>

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          {keyword && (
            <button
              type="button"
              className="admin-search__clear"
              onClick={() => setKeyword('')}
              aria-label="Xóa tìm kiếm"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button type="button" className="admin-filter-btn" aria-label="Mở bộ lọc">
          <SlidersHorizontal size={16} />
        </button>
      </div>

      <div className="thist-table-wrap">
        <table className="thist-table admin-table--even admin-table--6col">
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th className="thist-table__actions-head">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td className="admin-table__nowrap">{ROLE_LABEL[user.role] || user.role}</td>
                <td>
                  <span
                    className={`thist-status-badge thist-status-badge--${
                      user.isActive ? 'resolved' : 'closed'
                    }`}
                  >
                    <span className="thist-status-badge__dot" />
                    {user.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td className="thist-table__actions">
                  <div className="admin-action-cell">
                    <button
                      type="button"
                      className={
                        user.isActive
                          ? 'admin-action-btn admin-action-btn--danger'
                          : 'admin-action-btn admin-action-btn--success'
                      }
                      onClick={() => handleToggleStatus(user)}
                    >
                      {user.isActive ? <Lock size={14} /> : <Unlock size={14} />}
                      {user.isActive ? 'Khóa tài khoản' : 'Mở khóa'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="ticket-modal__overlay" onMouseDown={() => setIsModalOpen(false)}>
          <div
            className="ticket-modal"
            role="dialog"
            aria-modal="true"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="ticket-modal__accent" />
            <header className="ticket-modal__header">
              <h2>Tạo người dùng mới</h2>
              <button
                type="button"
                className="ticket-modal__close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </header>

            <form className="ticket-modal__body" onSubmit={handleCreateUser}>
              <section className="ticket-section">
                <div className="ticket-section__label">
                  <span>Họ và tên</span>
                </div>
                <div className="ticket-summary-input">
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={form.fullName}
                    onChange={handleFormChange('fullName')}
                  />
                </div>
              </section>

              <section className="ticket-section">
                <div className="ticket-section__label">
                  <span>Email</span>
                </div>
                <div className="ticket-summary-input">
                  <input
                    type="email"
                    placeholder="nguyenvana@fpt.edu.vn"
                    value={form.email}
                    onChange={handleFormChange('email')}
                  />
                </div>
              </section>

              <div className="admin-form-row">
                <section className="ticket-section">
                  <div className="ticket-section__label">
                    <span>Số điện thoại</span>
                  </div>
                  <div className="ticket-summary-input">
                    <input
                      type="tel"
                      placeholder="0912345678"
                      value={form.phone}
                      onChange={handleFormChange('phone')}
                    />
                  </div>
                </section>

                <section className="ticket-section">
                  <div className="ticket-section__label">
                    <span>Vai trò</span>
                  </div>
                  <select
                    className="admin-select"
                    value={form.role}
                    onChange={handleFormChange('role')}
                  >
                    <option value="">-- Chọn vai trò --</option>
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </section>
              </div>

              <div className="admin-form-row">
                <section className="ticket-section">
                  <div className="ticket-section__label">
                    <span>Mật khẩu</span>
                  </div>
                  <div className="ticket-summary-input">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Tối thiểu 8 ký tự"
                      value={form.password}
                      onChange={handleFormChange('password')}
                    />
                    <button
                      type="button"
                      className="admin-password-toggle"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </section>

                <section className="ticket-section">
                  <div className="ticket-section__label">
                    <span>Xác nhận mật khẩu</span>
                  </div>
                  <div className="ticket-summary-input">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Nhập lại mật khẩu"
                      value={form.confirmPassword}
                      onChange={handleFormChange('confirmPassword')}
                    />
                    <button
                      type="button"
                      className="admin-password-toggle"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </section>
              </div>

              {formError && <p className="ticket-required">{formError}</p>}

              <footer className="ticket-modal__footer">
                <div className="ticket-modal__footer-actions">
                  <button
                    type="button"
                    className="ticket-btn ticket-btn--ghost"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="ticket-btn ticket-btn--primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang tạo...' : 'Tạo người dùng'}
                  </button>
                </div>
              </footer>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default UserManagementPage
