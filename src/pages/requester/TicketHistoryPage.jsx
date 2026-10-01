import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Folder,
  Gauge,
  Loader2,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import RequesterLayout from './RequesterLayout.jsx'
import TicketDetailModal from './TicketDetailModal.jsx'
import { getMyTicketsApi } from '../../services/requester/ticketRequest.service'
import '../../styles/requester/TicketHistoryPage.css'

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

function TicketHistoryPage() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await getMyTicketsApi()
        setTickets(res.data.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Không tải được danh sách yêu cầu')
      }
    }
    fetchTickets()
  }, [])

  const summaryCards = [
    {
      icon: Folder,
      hintIcon: Gauge,
      tone: 'neutral',
      value: tickets.length,
      label: 'TẤT CẢ YÊU CẦU',
      hint: 'Ghi nhận trong toàn bộ thời gian',
    },
    {
      icon: Loader2,
      hintIcon: Gauge,
      tone: 'info',
      value: tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
      label: 'ĐANG MỞ & XỬ LÝ',
      hint: 'Đang được kiểm tra & xử lý',
    },
    {
      icon: CheckCircle2,
      hintIcon: Gauge,
      tone: 'success',
      value: tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
      label: 'ĐÃ XỬ LÝ & ĐÓNG',
      hint: 'Yêu cầu đã hoàn tất',
    },
  ]

  return (
    <RequesterLayout activeNav="tickets">
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
          <h1>Lịch sử các yêu cầu của tôi</h1>
        </div>
      </div>

      {error && <p className="ticket-required">{error}</p>}

      <section className="thist-summary">
        {summaryCards.map((card) => (
          <div
            className={
              card.tone === 'danger'
                ? 'thist-summary-card thist-summary-card--danger'
                : 'thist-summary-card'
            }
            key={card.label}
          >
            <div>
              <div className="thist-summary-card__value">{card.value}</div>
              <div className="thist-summary-card__label">{card.label}</div>
              <div className="thist-summary-card__hint">
                <card.hintIcon size={11} />
                {card.hint}
              </div>
            </div>
            <span className={`thist-summary-card__icon thist-summary-card__icon--${card.tone}`}>
              <card.icon size={18} />
            </span>
          </div>
        ))}
      </section>

      <div className="thist-toolbar">
        <div className="thist-search">
          <Search size={15} />
          <input type="text" placeholder="Tìm theo mã ticket..." />
        </div>
        <button type="button" className="thist-filter">
          Trạng thái: Tất cả
          <ChevronRight size={13} />
        </button>
        <button type="button" className="thist-filter">
          <SlidersHorizontal size={13} />
          Sắp xếp: Cập nhật gần nhất
        </button>
        <button type="button" className="thist-reset">
          <X size={13} />
          Đặt lại
        </button>
      </div>

      <div className="thist-table-wrap">
        <table className="thist-table">
          <thead>
            <tr>
              <th>Mã ticket</th>
              <th>Tiêu đề</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th className="thist-table__actions-head">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="thist-table__id">#{ticket.id}</td>
                <td>
                  <div className="thist-table__subject-title">{ticket.title}</div>
                  <div className="thist-table__subject-note">{ticket.description}</div>
                </td>
                <td className="thist-table__date">{formatDate(ticket.createdAt)}</td>
                <td>
                  <span className={`thist-status-badge thist-status-badge--${STATUS_TONE[ticket.status] || 'closed'}`}>
                    <span className="thist-status-badge__dot" />
                    {STATUS_LABEL[ticket.status] || ticket.status}
                  </span>
                </td>
                <td className="thist-table__actions">
                  <button
                    type="button"
                    className="thist-row-link"
                    aria-label="Xem chi tiết"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <ArrowRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TicketDetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
    </RequesterLayout>
  )
}

export default TicketHistoryPage
