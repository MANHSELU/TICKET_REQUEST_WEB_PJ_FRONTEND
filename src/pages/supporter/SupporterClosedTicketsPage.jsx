import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, Folder, Search, SlidersHorizontal } from 'lucide-react'
import SupporterLayout from './SupporterLayout.jsx'
import SupporterTicketDetailModal from './SupporterTicketDetailModal.jsx'
import { getMyClosedTicketsApi } from '../../services/supporter/ticketManagement.service'
import '../../styles/requester/TicketHistoryPage.css'
import '../../styles/supporter/SupporterTicketListPage.css'

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

function SupporterClosedTicketsPage() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')

  const fetchTickets = async () => {
    try {
      const res = await getMyClosedTicketsApi()
      setTickets(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được lịch sử xử lý')
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const filteredTickets = useMemo(() => {
    if (!keyword.trim()) return tickets
    const lowerKeyword = keyword.trim().toLowerCase()
    return tickets.filter((ticket) => ticket.title?.toLowerCase().includes(lowerKeyword))
  }, [tickets, keyword])

  return (
    <SupporterLayout activeNav="closed-tickets">
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
          <h1>Lịch sử xử lý</h1>
        </div>
      </div>

      {error && <p className="ticket-required">{error}</p>}

      <div className="thist-toolbar">
        <div className="thist-search stk-search--wide">
          <Search size={15} />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
        <button type="button" className="thist-filter">
          <SlidersHorizontal size={13} />
          Sắp xếp: Mới đóng gần nhất
        </button>
      </div>

      <div className="thist-table-wrap">
        <table className="thist-table stk-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tiêu đề</th>
              <th>Người yêu cầu</th>
              <th>Ngày đóng</th>
              <th>Trạng thái</th>
              <th className="thist-table__actions-head">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 && !error && (
              <tr>
                <td colSpan={6} className="stk-empty">
                  <div className="stk-empty-content">
                    <Folder size={18} />
                    {keyword
                      ? 'Không tìm thấy yêu cầu nào khớp'
                      : 'Bạn chưa hoàn thành yêu cầu nào'}
                  </div>
                </td>
              </tr>
            )}
            {filteredTickets.map((ticket, index) => (
              <tr key={ticket.id} onClick={() => setSelectedTicketId(ticket.id)} className="stk-row">
                <td className="thist-table__id">{index + 1}</td>
                <td>
                  <div className="thist-table__subject-title">{ticket.title}</div>
                  <div className="thist-table__subject-note">{ticket.description}</div>
                </td>
                <td className="thist-table__meta">{ticket.requester?.fullName || '—'}</td>
                <td className="thist-table__date">{formatDate(ticket.closedAt)}</td>
                <td>
                  <span className="thist-status-badge thist-status-badge--closed">
                    <span className="thist-status-badge__dot" />
                    Đã đóng
                  </span>
                </td>
                <td className="thist-table__actions">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SupporterTicketDetailModal
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        onChanged={() => fetchTickets()}
        onToast={() => {}}
      />
    </SupporterLayout>
  )
}

export default SupporterClosedTicketsPage
