import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ClipboardList, Gauge, Grid2x2, Ticket, Users } from 'lucide-react'
import AdminLayout from './AdminLayout.jsx'
import { getUsersApi } from '../../services/admin/userManagement.service'
import { getAllTicketsApi } from '../../services/admin/ticketManagement.service'
import { getItServicesApi } from '../../services/admin/itServiceManagement.service'
import { getSupportTeamsApi } from '../../services/admin/supportTeamManagement.service'
import '../../styles/requester/TicketHistoryPage.css'
import '../../styles/admin/AdminDashboardPage.css'

const STATUS_CONFIG = [
  { key: 'OPEN', label: 'Chưa tiếp nhận', color: '#94a3b8' },
  { key: 'IN_PROGRESS', label: 'Đang xử lý', color: '#0d9db3' },
  { key: 'RESOLVED', label: 'Đã hoàn thành', color: '#16a34a' },
  { key: 'CLOSED', label: 'Đã đóng', color: '#64748b' },
]

const PRIORITY_CONFIG = [
  { key: 'LOW', label: 'Thấp', color: '#94a3b8' },
  { key: 'MEDIUM', label: 'Trung bình', color: '#0d9db3' },
  { key: 'HIGH', label: 'Cao', color: '#f59e0b' },
  { key: 'URGENT', label: 'Khẩn cấp', color: '#dc2626' },
]

const STATUS_LABEL = STATUS_CONFIG.reduce((acc, s) => ({ ...acc, [s.key]: s.label }), {})
const STATUS_TONE = {
  OPEN: 'closed',
  IN_PROGRESS: 'progress',
  RESOLVED: 'resolved',
  CLOSED: 'resolved',
}

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function StatusDonutChart({ tickets }) {
  const total = tickets.length

  const segments = useMemo(() => {
    let cumulative = 0
    return STATUS_CONFIG.map((status) => {
      const count = tickets.filter((t) => t.status === status.key).length
      const percent = total > 0 ? count / total : 0
      const start = cumulative
      cumulative += percent
      return { ...status, count, percent, start }
    })
  }, [tickets, total])

  const radius = 60
  const circumference = 2 * Math.PI * radius

  if (total === 0) {
    return <p className="admin-chart__empty">Chưa có dữ liệu yêu cầu để hiển thị</p>
  }

  return (
    <div className="admin-chart">
      <svg viewBox="0 0 160 160" className="admin-chart__svg">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="20" />
        {segments.map((segment) => {
          if (segment.percent === 0) return null
          const dashArray = `${segment.percent * circumference} ${circumference}`
          const dashOffset = -segment.start * circumference
          return (
            <circle
              key={segment.key}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="20"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 80 80)"
            />
          )
        })}
        <text x="80" y="76" textAnchor="middle" className="admin-chart__total-value">
          {total}
        </text>
        <text x="80" y="94" textAnchor="middle" className="admin-chart__total-label">
          YÊU CẦU
        </text>
      </svg>
      <div className="admin-chart__legend">
        {segments.map((segment) => (
          <div className="admin-chart__legend-item" key={segment.key}>
            <span className="admin-chart__legend-dot" style={{ background: segment.color }} />
            <span className="admin-chart__legend-label">{segment.label}</span>
            <span className="admin-chart__legend-value">{segment.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PriorityBarChart({ tickets }) {
  const total = tickets.length

  const bars = useMemo(() => {
    const maxCount = Math.max(
      1,
      ...PRIORITY_CONFIG.map((p) => tickets.filter((t) => t.priority === p.key).length),
    )
    return PRIORITY_CONFIG.map((priority) => {
      const count = tickets.filter((t) => t.priority === priority.key).length
      return { ...priority, count, widthPercent: (count / maxCount) * 100 }
    })
  }, [tickets])

  if (total === 0) {
    return <p className="admin-chart__empty">Chưa có dữ liệu yêu cầu để hiển thị</p>
  }

  return (
    <div className="admin-bar-chart">
      {bars.map((bar) => (
        <div className="admin-bar-chart__row" key={bar.key}>
          <span className="admin-bar-chart__label">{bar.label}</span>
          <div className="admin-bar-chart__track">
            <div
              className="admin-bar-chart__fill"
              style={{ width: `${bar.widthPercent}%`, background: bar.color }}
            />
          </div>
          <span className="admin-bar-chart__value">{bar.count}</span>
        </div>
      ))}
    </div>
  )
}

function AdminDashboardPage() {
  const navigate = useNavigate()
  const [userCount, setUserCount] = useState(0)
  const [tickets, setTickets] = useState([])
  const [serviceCount, setServiceCount] = useState(0)
  const [teamCount, setTeamCount] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getUsersApi(), getAllTicketsApi(), getItServicesApi(), getSupportTeamsApi()])
      .then(([usersRes, ticketsRes, servicesRes, teamsRes]) => {
        setUserCount(usersRes.data.data.length)
        setTickets(ticketsRes.data.data)
        setServiceCount(servicesRes.data.data.length)
        setTeamCount(teamsRes.data.data.length)
      })
      .catch((err) => setError(err.response?.data?.message || 'Không tải được số liệu thống kê'))
  }, [])

  const openTicketCount = tickets.filter(
    (t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS',
  ).length

  const recentTickets = tickets.slice(0, 6)

  const summaryCards = [
    { icon: Users, tone: 'neutral', value: userCount, label: 'TỔNG NGƯỜI DÙNG', hint: 'Toàn hệ thống' },
    { icon: Ticket, tone: 'info', value: openTicketCount, label: 'TICKET ĐANG MỞ', hint: 'Đang chờ xử lý' },
    { icon: ClipboardList, tone: 'success', value: serviceCount, label: 'DỊCH VỤ CNTT', hint: 'Đang hoạt động' },
    { icon: Grid2x2, tone: 'neutral', value: teamCount, label: 'ĐỘI HỖ TRỢ', hint: 'Đang hoạt động' },
  ]

  return (
    <AdminLayout activeNav="dashboard">
      <div className="thist-heading">
        <div className="thist-heading__title">
          <h1>Bảng điều khiển quản trị</h1>
        </div>
      </div>

      {error && <p className="ticket-required">{error}</p>}

      <section className="thist-summary">
        {summaryCards.map((card) => (
          <div className="thist-summary-card" key={card.label}>
            <div>
              <div className="thist-summary-card__value">{card.value}</div>
              <div className="thist-summary-card__label">{card.label}</div>
              <div className="thist-summary-card__hint">
                <Gauge size={11} />
                {card.hint}
              </div>
            </div>
            <span className={`thist-summary-card__icon thist-summary-card__icon--${card.tone}`}>
              <card.icon size={18} />
            </span>
          </div>
        ))}
      </section>

      <div className="admin-dashboard-grid">
        <div className="admin-chart-card">
          <div className="admin-chart-card__title">Phân bổ yêu cầu theo trạng thái</div>
          <StatusDonutChart tickets={tickets} />
        </div>

        <div className="admin-chart-card">
          <div className="admin-chart-card__title">Phân bổ yêu cầu theo mức ưu tiên</div>
          <PriorityBarChart tickets={tickets} />
        </div>
      </div>

      <div className="admin-recent-card">
        <div className="admin-recent-card__header">
          <div className="admin-chart-card__title">Yêu cầu gần đây</div>
          <button type="button" className="admin-recent-card__link" onClick={() => navigate('/admin/tickets')}>
            Xem tất cả
            <ArrowRight size={14} />
          </button>
        </div>

        {recentTickets.length === 0 ? (
          <p className="admin-chart__empty">Chưa có yêu cầu nào trong hệ thống</p>
        ) : (
          <div className="thist-table-wrap">
            <table className="thist-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Tiêu đề</th>
                  <th>Người gửi</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="admin-table__nowrap">#{ticket.id}</td>
                    <td>{ticket.title}</td>
                    <td>{ticket.requester?.fullName || '—'}</td>
                    <td>
                      <span
                        className={`thist-status-badge thist-status-badge--${
                          STATUS_TONE[ticket.status] || 'closed'
                        }`}
                      >
                        <span className="thist-status-badge__dot" />
                        {STATUS_LABEL[ticket.status] || ticket.status}
                      </span>
                    </td>
                    <td className="admin-table__nowrap">{formatDate(ticket.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminDashboardPage
