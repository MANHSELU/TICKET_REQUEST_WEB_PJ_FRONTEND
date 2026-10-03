import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, Search, User } from 'lucide-react'
import logoImg from '../../assets/logo.png'
import NewTicketModal from './NewTicketModal.jsx'
import { getProfileApi } from '../../services/requester/profileManagement.service'
import '../../styles/requester/RequesterHeader.css'

function RequesterLayout({ activeNav, children }) {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(null)
  const navigate = useNavigate()
  const accountMenuRef = useRef(null)

  useEffect(() => {
    getProfileApi()
      .then((res) => {
        setFullName(res.data.data.fullName)
        if (res.data.data.imgUrl) {
          setAvatarUrl(res.data.data.imgUrl)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/auth/login')
  }

  return (
    <div className="rheader-page">
      <header className="rheader">
        <div className="rheader__group rheader__group--left">
          <div className="rheader__brand" onClick={() => navigate('/requester/dashboard')}>
            <span className="rheader__logo">
              <img src={logoImg} alt="NexusIT" />
            </span>
            <span className="rheader__brand-name">NEXUS IT SUPPORT</span>
          </div>
        </div>

        <div className="rheader__group rheader__group--center">
          <nav className="rheader__nav">
            <button
              type="button"
              className={
                activeNav === 'dashboard' ? 'rheader__nav-item rheader__nav-item--active' : 'rheader__nav-item'
              }
              onClick={() => navigate('/requester/dashboard')}
            >
              Bảng tin
            </button>
            <button
              type="button"
              className={
                activeNav === 'tickets' ? 'rheader__nav-item rheader__nav-item--active' : 'rheader__nav-item'
              }
              onClick={() => navigate('/requester/tickets')}
            >
              Yêu cầu của tôi
            </button>
            <button
              type="button"
              className="rheader__nav-item"
              onClick={() => setIsTicketModalOpen(true)}
            >
              Tạo Ticket
            </button>
            <button
              type="button"
              className={
                activeNav === 'profile' ? 'rheader__nav-item rheader__nav-item--active' : 'rheader__nav-item'
              }
              onClick={() => navigate('/requester/profile')}
            >
              Hồ sơ cá nhân
            </button>
            <button type="button" className="rheader__nav-item" disabled>
              Cài đặt
            </button>
          </nav>
        </div>

        <div className="rheader__group rheader__group--right">
          <div className="rheader__search">
            <Search size={15} />
            <input type="text" placeholder="Tìm ticket..." />
          </div>

          <button type="button" className="rheader__bell" aria-label="Thông báo">
            <Bell size={21} />
            <span className="rheader__bell-dot" />
          </button>

          <div className="rheader__account" ref={accountMenuRef}>
            <button
              type="button"
              className="rheader__avatar"
              onClick={() => setIsAccountMenuOpen((value) => !value)}
              aria-label="Tài khoản"
            >
              {avatarUrl ? <img src={avatarUrl} alt="Avatar" /> : <User size={22} />}
            </button>

            {isAccountMenuOpen && (
              <div className="rheader__account-menu">
                <div className="rheader__account-menu__name">{fullName || 'Người dùng'}</div>
                <button
                  type="button"
                  className="rheader__account-menu__item"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="rheader-content">{children}</main>

      <NewTicketModal open={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} />
    </div>
  )
}

export default RequesterLayout
