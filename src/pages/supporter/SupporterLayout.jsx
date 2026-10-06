import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  History,
  ListChecks,
  LogOut,
  Newspaper,
  PlusCircle,
  Search,
  Settings,
  Star,
  User,
  UserCircle,
} from 'lucide-react'
import logoImg from '../../assets/logo.png'
import AiChatbotWidget from '../../components/requester/AiChatbotWidget.jsx'
import { getProfileApi } from '../../services/requester/profileManagement.service'
import '../../styles/requester/RequesterHeader.css'

const NAV_ITEMS = [
  { icon: ListChecks, label: 'Hàng đợi yêu cầu', key: 'tickets', path: '/supporter/dashboard' },
  { icon: History, label: 'Lịch sử xử lý', key: 'closed-tickets', path: '/supporter/tickets/closed' },
  { icon: Newspaper, label: 'Bảng tin', key: 'feed', path: '/supporter/feed' },
  { icon: PlusCircle, label: 'Đăng bài', key: 'create-post', path: '/supporter/posts/new' },
  { icon: History, label: 'Lịch sử bài đăng', key: 'post-history', path: '/supporter/posts' },
  { icon: Star, label: 'Đánh giá của tôi', key: 'ratings', path: '/supporter/ratings' },
  { icon: UserCircle, label: 'Hồ sơ cá nhân', key: 'profile', path: '/supporter/profile' },
  { icon: Settings, label: 'Cài đặt', key: 'settings' },
]

function SupporterLayout({ activeNav, children }) {
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(null)
  const navigate = useNavigate()

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

  return (
    <div className="rside-page">
      <aside className="rside">
        <div className="rside__brand" onClick={() => navigate('/supporter/dashboard')}>
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

        <div className="rside__footer">
          <div className="rside__account rside__account--static">
            <span className="rside__avatar">
              {avatarUrl ? <img src={avatarUrl} alt="Avatar" /> : <User size={18} />}
            </span>
            <span className="rside__account-name">{fullName || 'Người dùng'}</span>
          </div>

          <button type="button" className="rside__logout-btn" onClick={handleLogout}>
            <LogOut size={15} />
            Đăng xuất
          </button>
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

export default SupporterLayout
