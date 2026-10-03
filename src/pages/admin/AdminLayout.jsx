import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, FileUp, Gauge, Grid2x2, LayoutDashboard, LogOut, Settings, Ticket, User, Users } from 'lucide-react'
import logoImg from '../../assets/logo.png'
import { getProfileApi } from '../../services/requester/profileManagement.service'
import { decodeJwt } from '../../utils/jwt.util'
import '../../styles/admin/AdminLayout.css'
import '../../styles/admin/AdminCommon.css'

const ROLE_LABEL = {
  1: 'Người yêu cầu',
  2: 'Nhân viên hỗ trợ',
  4: 'Trưởng nhóm hỗ trợ',
  8: 'Quản trị viên',
}

const NAV_SECTIONS = [
  {
    label: 'Tổng quan',
    items: [
      { icon: LayoutDashboard, label: 'Bảng điều khiển', key: 'dashboard', path: '/admin/dashboard' },
      { icon: Ticket, label: 'Toàn bộ yêu cầu', key: 'tickets', path: '/admin/tickets' },
      { icon: Gauge, label: 'Hiệu suất xử lý', key: 'performance' },
    ],
  },
  {
    label: 'Quản lý Dịch vụ & Yêu cầu',
    items: [
      { icon: ClipboardList, label: 'Dịch vụ', key: 'services', path: '/admin/services' },
      { icon: Grid2x2, label: 'Danh mục dịch vụ', key: 'service-categories', path: '/admin/service-categories' },
      { icon: Grid2x2, label: 'Danh mục yêu cầu', key: 'categories', path: '/admin/ticket-categories' },
    ],
  },
  {
    label: 'Quản lý người dùng',
    items: [
      { icon: Users, label: 'Quản lý người dùng', key: 'users', path: '/admin/users' },
      { icon: Users, label: 'Đội hỗ trợ', key: 'teams', path: '/admin/support-teams' },
    ],
  },
  {
    label: 'Khác',
    items: [
      { icon: FileUp, label: 'Tài liệu AI', key: 'ai-documents' },
      { icon: Settings, label: 'Cài đặt hệ thống', key: 'settings' },
    ],
  },
]

function AdminLayout({ activeNav, children }) {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState(null)

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      try {
        setRole(decodeJwt(accessToken).role)
      } catch {
        setRole(null)
      }
    }
    getProfileApi()
      .then((res) => setFullName(res.data.data.fullName))
      .catch(() => {})
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/auth/login')
  }

  return (
    <div className="rdash">
      <aside className="rdash-sidebar">
        <div className="rdash-sidebar__brand">
          <span className="rdash-logo">
            <img src={logoImg} alt="NexusIT" />
          </span>
          <div>
            <div className="rdash-brand__name">NEXUS IT SUPPORT</div>
          </div>
        </div>

        <nav className="rdash-nav">
          {NAV_SECTIONS.map((section) => (
            <div className="rdash-nav__section" key={section.label}>
              <div className="rdash-nav__label">{section.label}</div>
              {section.items.map((item) => (
                <button
                  type="button"
                  key={item.key}
                  className={
                    item.key === activeNav
                      ? 'rdash-nav__item rdash-nav__item--active'
                      : 'rdash-nav__item'
                  }
                  onClick={item.path ? () => navigate(item.path) : undefined}
                  disabled={!item.path}
                >
                  <item.icon size={17} />
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-footer__user">
            <span className="admin-sidebar-footer__avatar">
              <User size={16} />
            </span>
            <div className="admin-sidebar-footer__info">
              <div className="admin-sidebar-footer__name">{fullName || 'Đang tải...'}</div>
              <div className="admin-sidebar-footer__role">{ROLE_LABEL[role] || ''}</div>
            </div>
          </div>
          <button type="button" className="admin-sidebar-footer__logout" onClick={handleLogout}>
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="rdash-main">
        <main className="rdash-content">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
