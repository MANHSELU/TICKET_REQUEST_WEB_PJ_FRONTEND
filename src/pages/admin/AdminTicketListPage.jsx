import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Search, SlidersHorizontal, Ticket } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from './AdminLayout.jsx'
import { getAllTicketsApi } from '../../services/admin/ticketManagement.service'
import '../../styles/requester/TicketHistoryPage.css'
import '../../styles/admin/AdminCommon.css'

const STATUS_LABEL = {
  OPEN: 'Chưa tiếp nhận',
  IN_PROGRESS: 'Đang xử lý',
  RESOLVED: 'Đã hoàn thành',
  CLOSED: 'Đã đóng',
}

const STATUS_TONE = {
  OPEN: 'closed',
  IN_PROGRESS: 'progress',
  RESOLVED: 'resolved',
  CLOSED: 'resolved',
}

const PRIORITY_LABEL = {
  LOW: 'Thấp',
  MEDIUM: 'Trung bình',
  HIGH: 'Cao',
  URGENT: 'Khẩn cấp',
}

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function AdminTicketListPage() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getAllTicketsApi()
      .then((res) => setTickets(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Không tải được danh sách yêu cầu'))
  }, [])

  const filteredTickets = useMemo(() => {
    if (!keyword.trim()) return tickets
    const lowerKeyword = keyword.trim().toLowerCase()
    return tickets.filter(
      (ticket) =>
        ticket.title?.toLowerCase().includes(lowerKeyword) ||
        ticket.requester?.fullName?.toLowerCase().includes(lowerKeyword) ||
        String(ticket.id).includes(lowerKeyword),
    )
  }, [tickets, keyword])

  return (
    <AdminLayout activeNav="tickets">
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
          <h1>Toàn bộ yêu cầu hỗ trợ</h1>
        </div>
      </div>

      {error && <p className="ticket-required">{error}</p>}

      <section className="thist-summary admin-summary--3col">
        <div className="thist-summary-card">
          <div>
            <div className="thist-summary-card__value">{tickets.length}</div>
            <div className="thist-summary-card__label">TỔNG YÊU CẦU</div>
          </div>
          <span className="thist-summary-card__icon thist-summary-card__icon--info">
            <Ticket size={18} />
          </span>
        </div>
        <div className="thist-summary-card">
          <div>
            <div className="thist-summary-card__value">
              {tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length}
            </div>
            <div className="thist-summary-card__label">ĐANG MỞ & XỬ LÝ</div>
          </div>
          <span className="thist-summary-card__icon thist-summary-card__icon--neutral">
            <Ticket size={18} />
          </span>
        </div>
        <div className="thist-summary-card">
          <div>
            <div className="thist-summary-card__value">
              {tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length}
            </div>
            <div className="thist-summary-card__label">ĐÃ XỬ LÝ & ĐÓNG</div>
          </div>
          <span className="thist-summary-card__icon thist-summary-card__icon--success">
            <Ticket size={18} />
          </span>
        </div>
      </section>

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm theo mã, tiêu đề hoặc người gửi..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
        <button type="button" className="admin-filter-btn" aria-label="Mở bộ lọc">
          <SlidersHorizontal size={16} />
        </button>
      </div>

      <div className="thist-table-wrap">
        <table className="thist-table admin-table--even admin-table--7col admin-table--no-actions">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tiêu đề</th>
              <th>Người gửi</th>
              <th>Dịch vụ</th>
              <th>Mức ưu tiên</th>
              <th>Trạng thái</th>
              <th>Ngày gửi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="admin-table__nowrap">#{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.requester?.fullName || '—'}</td>
                <td>{ticket.itService?.service_name || '—'}</td>
                <td className="admin-table__nowrap">
                  {PRIORITY_LABEL[ticket.priority] || ticket.priority}
                </td>
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
    </AdminLayout>
  )
}

export default AdminTicketListPage
