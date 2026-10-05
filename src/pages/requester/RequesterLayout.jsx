import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, LayoutDashboard, ListChecks, LogOut, PlusCircle, Search, Settings, User, UserCircle } from 'lucide-react'
import logoImg from '../../assets/logo.png'
import AiChatbotWidget from '../../components/requester/AiChatbotWidget.jsx'
import { getProfileApi } from '../../services/requester/profileManagement.service'
import '../../styles/requester/RequesterHeader.css'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Bảng tin', key: 'dashboard', path: '/requester/dashboard' },
  { icon: ListChecks, label: 'Yêu cầu của tôi', key: 'tickets', path: '/requester/tickets' },
  { icon: PlusCircle, label: 'Tạo Ticket', key: 'create-ticket', path: '/requester/tickets/new' },
  { icon: UserCircle, label: 'Hồ sơ cá nhân', key: 'profile', path: '/requester/profile' },
  { icon: Settings, label: 'Cài đặt', key: 'settings' },
]

function RequesterLayout({ activeNav, children }) {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [menuPosition, setMenuPosition] = useState(null)
  const navigate = useNavigate()
  const accountMenuRef = useRef(null)
  const accountBtnRef = useRef(null)

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

  const handleNavClick = (item) => {
    if (item.path) {
      navigate(item.path)
    }
  }

  const handleToggleAccountMenu = () => {
    if (!isAccountMenuOpen && accountBtnRef.current) {
      const rect = accountBtnRef.current.getBoundingClientRect()
      setMenuPosition({ left: rect.left, right: window.innerWidth - rect.right, bottom: window.innerHeight - rect.top + 8 })
    }
    setIsAccountMenuOpen((value) => !value)
  }

  return (
    <div className="rside-page">
      <aside className="rside">
        <div className="rside__brand" onClick={() => navigate('/requester/dashboard')}>
          <span className="rside__logo">
            <img src={logoImg} alt="NexusIT" />
          </span>
          <span className="rside__brand-name">NEXUS IT SUPPORT</span>
        </div>

        <nav className="rside__nav">
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.key}
              className={
                item.key === activeNav ? 'rside__nav-item rside__nav-item--active' : 'rside__nav-item'
              }
              onClick={() => handleNavClick(item)}
              disabled={!item.path}
            >
              <item.icon size={19} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="rside__footer" ref={accountMenuRef}>
          <button
            type="button"
            ref={accountBtnRef}
            className="rside__account"
            onClick={handleToggleAccountMenu}
          >
            <span className="rside__avatar">
              {avatarUrl ? <img src={avatarUrl} alt="Avatar" /> : <User size={18} />}
            </span>
            <span className="rside__account-name">{fullName || 'Người dùng'}</span>
          </button>

          {isAccountMenuOpen && menuPosition && (
            <div
              className="rside__account-menu"
              style={{ left: menuPosition.left, right: menuPosition.right, bottom: menuPosition.bottom }}
            >
              <button type="button" className="rside__account-menu__item" onClick={handleLogout}>
                <LogOut size={15} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="rside-main">
        <header className="rside-topbar">
          <div className="rside-topbar__search">
            <Search size={15} />
            <input type="text" placeholder="Tìm ticket..." />
          </div>

          <button type="button" className="rside-topbar__bell" aria-label="Thông báo">
            <Bell size={20} />
            <span className="rside-topbar__bell-dot" />
          </button>
        </header>

        <main className="rside-content">{children}</main>
      </div>

      <AiChatbotWidget />
    </div>
  )
}

export default RequesterLayout
