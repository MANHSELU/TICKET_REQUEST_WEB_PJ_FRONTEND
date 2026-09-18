import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Bell,
  ClipboardList,
  Grid2x2,
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  Radio,
  Search,
  Settings,
  Ticket,
  Users,
} from 'lucide-react'
import logoImg from '../../assets/logo.png'
import NewTicketModal from './NewTicketModal.jsx'
import '../../styles/requester/RequesterDashboardPage.css'

const NAV_SECTIONS = [
  {
    label: 'Tự phục vụ',
    items: [
      { icon: LayoutDashboard, label: 'Bảng điều khiển', key: 'dashboard', path: '/requester/dashboard' },
      { icon: ClipboardList, label: 'Gửi yêu cầu', key: 'submit' },
      { icon: Ticket, label: 'Yêu cầu của tôi', key: 'tickets', path: '/requester/tickets' },
    ],
  },
  {
    label: 'Vận hành nhân viên',
    items: [
      { icon: Grid2x2, label: 'Bảng điều khiển nhân viên', key: 'staff-dashboard' },
      { icon: ListChecks, label: 'Hàng đợi yêu cầu', key: 'queue' },
      { icon: Users, label: 'Không gian làm việc', key: 'workspace' },
    ],
  },
  {
    label: 'Đội ngũ & SLA',
    items: [
      { icon: Users, label: 'Khối lượng công việc', key: 'workload' },
      { icon: AlertTriangle, label: 'Leo thang sự cố', key: 'escalations' },
      { icon: Radio, label: 'Theo dõi SLA', key: 'sla' },
    ],
  },
  {
    label: 'Quản trị',
    items: [
      { icon: Settings, label: 'Cài đặt hệ thống', key: 'settings' },
      { icon: Users, label: 'Quản lý người dùng', key: 'users' },
      { icon: ClipboardList, label: 'Danh mục dịch vụ', key: 'catalog' },
      { icon: Grid2x2, label: 'Ma trận ưu tiên', key: 'priority-matrix' },
    ],
  },
]

function RequesterLayout({ activeNav, children }) {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const navigate = useNavigate()

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

        <div className="rdash-sidebar__footer">
          <div className="rdash-status">
            <span className="rdash-status__dot" />
            Toàn bộ hệ thống hoạt động
          </div>
          <button type="button" className="rdash-nav__item">
            <ClipboardList size={17} />
            Trợ giúp &amp; Tài liệu
          </button>
        </div>
      </aside>

      <div className="rdash-main">
        <header className="rdash-topbar">
          <div className="rdash-search">
            <Search size={16} />
            <input type="text" placeholder="Tìm ticket, bài viết, tài sản..." />
          </div>

          <button
            type="button"
            className="rdash-new-ticket rdash-new-ticket--pinned"
            onClick={() => setIsTicketModalOpen(true)}
          >
            <PlusCircle size={16} />
            Tạo Ticket
          </button>

          <button type="button" className="rdash-bell">
            <Bell size={18} />
            <span className="rdash-bell__dot" />
          </button>
        </header>

        <main className="rdash-content">{children}</main>
      </div>

      <NewTicketModal open={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} />
    </div>
  )
}

export default RequesterLayout
