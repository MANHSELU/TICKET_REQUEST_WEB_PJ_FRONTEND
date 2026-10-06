import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  Eye,
  Folder,
  Gauge,
  Loader2,
  Search,
  SlidersHorizontal,
  UserCheck,
  X,
} from 'lucide-react'
import SupporterLayout from './SupporterLayout.jsx'
import SupporterTicketDetailModal from './SupporterTicketDetailModal.jsx'
import Toast from '../../components/common/Toast.jsx'
import { acceptTicketApi, getAllTicketsApi } from '../../services/supporter/ticketManagement.service'
import '../../styles/requester/TicketHistoryPage.css'
import '../../styles/supporter/SupporterTicketListPage.css'

const STATUS_LABEL = {
  OPEN: 'Chưa tiếp nhận',
  IN_PROGRESS: 'Đang xử lý',
  RESOLVED: 'Đã hoàn thành',
  CLOSED: 'Đã đóng',
}

const STATUS_TONE = {
  OPEN: 'waiting',
  IN_PROGRESS: 'progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
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

function SupporterTicketListPage() {
  const [tickets, setTickets] = useState([])
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [acceptingId, setAcceptingId] = useState(null)

  const fetchTickets = async () => {
    try {
      const res = await getAllTicketsApi()
      setTickets(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được danh sách yêu cầu')
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2000)
  }

  const handleAccept = async (event, ticketId) => {
    event.stopPropagation()
    setAcceptingId(ticketId)
    try {
      await acceptTicketApi(ticketId)
      showToast('Tiếp nhận yêu cầu thành công!')
      fetchTickets()
    } catch (err) {
      showToast(err.response?.data?.message || 'Tiếp nhận thất bại', 'error')
    } finally {
      setAcceptingId(null)
    }
  }

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
      tone: 'danger',
      value: tickets.filter((t) => t.status === 'OPEN').length,
      label: 'CHƯA TIẾP NHẬN',
      hint: 'Đang chờ được xử lý',
    },
    {
      icon: UserCheck,
      hintIcon: Gauge,
      tone: 'info',
      value: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
      label: 'ĐANG XỬ LÝ',
      hint: 'Đang được xử lý',
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
    <SupporterLayout activeNav="tickets">
      <div className="thist-heading">
        <div className="thist-heading__title">
          <h1>Hàng đợi yêu cầu hỗ trợ</h1>
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
        <table className="thist-table stk-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tiêu đề</th>
              <th>Người yêu cầu</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th className="thist-table__actions-head">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket.id} onClick={() => setSelectedTicketId(ticket.id)} className="stk-row">
                <td className="thist-table__id">{index + 1}</td>
                <td>
                  <div className="thist-table__subject-title">{ticket.title}</div>
                  <div className="thist-table__subject-note">{ticket.description}</div>
                </td>
                <td className="thist-table__meta">{ticket.requester?.fullName || '—'}</td>
                <td className="thist-table__date">{formatDate(ticket.createdAt)}</td>
                <td>
                  <span className={`thist-status-badge thist-status-badge--${STATUS_TONE[ticket.status] || 'closed'}`}>
                    <span className="thist-status-badge__dot" />
                    {STATUS_LABEL[ticket.status] || ticket.status}
                  </span>
                </td>
                <td className="thist-table__actions">
                  <div className="stk-actions">
                    {ticket.status === 'OPEN' && (
                      <button
                        type="button"
                        className="stk-accept-btn"
                        disabled={acceptingId === ticket.id}
                        onClick={(event) => handleAccept(event, ticket.id)}
                      >
                        <UserCheck size={14} />
                        {acceptingId === ticket.id ? 'Đang nhận...' : 'Tiếp nhận'}
                      </button>
                    )}
                    <button
                      type="button"
                      className="thist-detail-btn"
                      onClick={(event) => {
                        event.stopPropagation()
                        setSelectedTicketId(ticket.id)
                      }}
                    >
                      <Eye size={14} />
                      Chi tiết
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SupporterTicketDetailModal
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        onChanged={() => {
          fetchTickets()
        }}
        onToast={showToast}
      />

      <Toast toast={toast} />
    </SupporterLayout>
  )
}

export default SupporterTicketListPage
