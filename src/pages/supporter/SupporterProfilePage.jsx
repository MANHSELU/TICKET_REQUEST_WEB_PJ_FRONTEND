import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Camera, Check, CheckCircle2, KeyRound, Mail, Phone, User } from 'lucide-react'
import SupporterLayout from './SupporterLayout.jsx'
import ChangePasswordModal from '../requester/ChangePasswordModal.jsx'
import Alert from '../../components/common/Alert'
import { getProfileApi, updateProfileApi } from '../../services/requester/profileManagement.service'
import '../../styles/requester/NewTicketModal.css'
import '../../styles/requester/ProfilePage.css'

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function SupporterProfilePage() {
  const navigate = useNavigate()
  const avatarInputRef = useRef(null)

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [joinedAt, setJoinedAt] = useState('')
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)

  const [profileAlert, setProfileAlert] = useState({ type: 'error', message: '' })
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileApi()
        const profile = res.data.data
        setFullName(profile.fullName)
        setPhone(profile.phone)
        setEmail(profile.email)
        setJoinedAt(formatDate(profile.createdAt))
        if (profile.imgUrl) {
          setAvatarPreview(profile.imgUrl)
        }
      } catch (error) {
        setProfileAlert({ type: 'error', message: error.response?.data?.message || 'Không tải được hồ sơ' })
      }
    }
    fetchProfile()
  }, [])

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
    setAvatarFile(file)
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    setProfileAlert({ type: 'error', message: '' })
    setIsSavingProfile(true)

    try {
      const formData = new FormData()
      formData.append('fullName', fullName)
      formData.append('phone', phone)
      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }
      await updateProfileApi(formData)
      setProfileAlert({ type: 'success', message: 'Cập nhật hồ sơ thành công' })
    } catch (error) {
      setProfileAlert({ type: 'error', message: error.response?.data?.message || 'Đã có lỗi xảy ra' })
    } finally {
      setIsSavingProfile(false)
    }
  }

  return (
    <SupporterLayout activeNav="profile">
      <div className="thist-heading">
        <div className="thist-heading__title">
          <button
            type="button"
            className="thist-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Quay lại"
          >
            <ArrowLeft size={18} />
          </button>
          <h1>Hồ sơ cá nhân</h1>
        </div>
      </div>

      <div className="profile-layout">
        <section className="profile-side-card">
          <div className="profile-side-card__avatar-wrap">
            <div className="profile-side-card__avatar">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Ảnh đại diện" />
              ) : (
                <User size={60} />
              )}
            </div>
            <button
              type="button"
              className="profile-side-card__avatar-edit"
              onClick={() => avatarInputRef.current?.click()}
              aria-label="Đổi ảnh đại diện"
            >
              <Camera size={16} />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </div>

          <div className="profile-side-card__name">{fullName}</div>
          <div className="profile-side-card__role">Nhân viên hỗ trợ</div>

          <div className="profile-side-card__email">
            <Mail size={14} />
            {email}
          </div>

          <span className="profile-status-badge">
            <span className="profile-status-badge__dot" />
            Đã xác thực
          </span>
        </section>

        <section className="profile-info-card">
          <div className="profile-info-card__header">
            <Alert
              type={profileAlert.type}
              message={profileAlert.message}
              onClose={() => setProfileAlert({ ...profileAlert, message: '' })}
            />
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="profile-row">
              <span className="profile-row__label">
                <Mail size={15} />
                Email
              </span>
              <span className="profile-row__value profile-row__value--muted">{email}</span>
            </div>

            <div className="profile-row">
              <span className="profile-row__label">
                <User size={15} />
                Họ và tên
              </span>
              <input
                className="profile-row__input"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="profile-row">
              <span className="profile-row__label">
                <Phone size={15} />
                Số điện thoại
              </span>
              <input
                className="profile-row__input"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
              />
            </div>

            <div className="profile-row">
              <span className="profile-row__label">
                <Calendar size={15} />
                Ngày tham gia
              </span>
              <span className="profile-row__value profile-row__value--muted">{joinedAt}</span>
            </div>

            <div className="profile-row">
              <span className="profile-row__label">
                <CheckCircle2 size={15} />
                Trạng thái
              </span>
              <span className="profile-status-badge">
                <span className="profile-status-badge__dot" />
                Đã xác thực
              </span>
            </div>

            <div className="profile-info-card__actions">
              <button
                type="button"
                className="profile-side-card__password-btn"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                <KeyRound size={14} />
                Đổi mật khẩu
              </button>
              <button type="submit" className="profile-save-btn" disabled={isSavingProfile}>
                <Check size={16} />
                {isSavingProfile ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </form>
        </section>
      </div>

      <ChangePasswordModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </SupporterLayout>
  )
}

export default SupporterProfilePage
