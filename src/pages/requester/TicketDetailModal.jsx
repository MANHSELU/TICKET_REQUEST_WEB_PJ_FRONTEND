import { useEffect, useState } from 'react'
import {
  Calendar,
  CheckCircle2,
  Circle,
  FileText,
  Gauge,
  Grid2x2,
  Paperclip,
  Send,
  Wrench,
  X,
} from 'lucide-react'
import { getMessagesApi, getMyTicketDetailApi, sendMessageApi } from '../../services/requester/ticketRequest.service'
import '../../styles/requester/NewTicketModal.css'
import '../../styles/requester/TicketHistoryPage.css'
import '../../styles/requester/TicketDetailModal.css'

const STAGES = ['Chưa tiếp nhận', 'Đang xử lý', 'Đã hoàn thành']

const STATUS_STAGE_INDEX = {
  OPEN: 0,
  IN_PROGRESS: 1,
  RESOLVED: 2,
  CLOSED: 2,
}

const PRIORITY_LABEL = {
  LOW: 'Thấp',
  MEDIUM: 'Trung bình',
  HIGH: 'Cao',
  URGENT: 'Khẩn cấp',
}

const PRIORITY_TONE = {
  LOW: 'closed',
  MEDIUM: 'progress',
  HIGH: 'high',
  URGENT: 'waiting',
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

function TicketDetailModal({ ticket, onClose }) {
  const [reply, setReply] = useState('')
  const [messages, setMessages] = useState([])
  const [ticketDetail, setTicketDetail] = useState(null)
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (!ticket) return

    const fetchDetail = async () => {
      try {
        const res = await getMyTicketDetailApi(ticket.id)
        setTicketDetail(res.data.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Không tải được chi tiết yêu cầu')
      }
    }
    fetchDetail()

    const fetchMessages = async () => {
      try {
        const res = await getMessagesApi(ticket.id)
        setMessages(res.data.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Không tải được đoạn hội thoại')
      }
    }
    fetchMessages()
  }, [ticket])

  if (!ticket) return null

  const currentTicket = ticketDetail || ticket
  const currentStageIndex = STATUS_STAGE_INDEX[currentTicket.status] ?? 0
  const showThread = currentTicket.status !== 'OPEN'

  const handleSend = async (event) => {
    event.preventDefault()
    if (!reply.trim()) return

    setIsSending(true)
    setError('')
    try {
      await sendMessageApi({ ticketId: ticket.id, message: reply })
      setReply('')
      const res = await getMessagesApi(ticket.id)
      setMessages(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Không gửi được tin nhắn')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="ticket-modal__overlay" onMouseDown={onClose}>
      <div
        className="ticket-modal ticket-modal--wide"
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="ticket-modal__accent" />
        <header className="ticket-modal__header">
          <div className="tdetail-header">
            <span className="tdetail-header__id">#{currentTicket.id}</span>
            <h2>{currentTicket.title}</h2>
          </div>
          <button type="button" className="ticket-modal__close" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </header>

        <div className="ticket-modal__body">
          <div className="tdetail-stepper">
            {STAGES.map((stage, index) => {
              const classNames = ['tdetail-step']
              if (index <= currentStageIndex) classNames.push('tdetail-step--done')
              if (index === currentStageIndex && index < STAGES.length - 1) {
                classNames.push('tdetail-step--current')
              }

              return (
                <div className={classNames.join(' ')} key={stage}>
                  <span className="tdetail-step__icon">
                    {index <= currentStageIndex ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <Circle size={16} />
                    )}
                  </span>
                  <span className="tdetail-step__label">{stage}</span>
                  {index < STAGES.length - 1 && <span className="tdetail-step__line" />}
                </div>
              )
            })}
          </div>

          <div className="tdetail-summary-card">
            <div className="tdetail-info-grid">
              <div className="tdetail-info-item">
                <span className="tdetail-info-item__label">
                  <Calendar size={13} />
                  Ngày gửi
                </span>
                <span className="tdetail-info-item__value">{formatDate(currentTicket.createdAt)}</span>
              </div>

              <div className="tdetail-info-item">
                <span className="tdetail-info-item__label">
                  <Gauge size={13} />
                  Mức độ ưu tiên
                </span>
                <span
                  className={`thist-status-badge thist-status-badge--${
                    PRIORITY_TONE[currentTicket.priority] || 'closed'
                  }`}
                >
                  <span className="thist-status-badge__dot" />
                  {PRIORITY_LABEL[currentTicket.priority] || currentTicket.priority || '—'}
                </span>
              </div>

              <div className="tdetail-info-item">
                <span className="tdetail-info-item__label">
                  <Grid2x2 size={13} />
                  Danh mục yêu cầu
                </span>
                <span className="tdetail-info-item__value">
                  {currentTicket.ticketCategory?.category_name || '—'}
                </span>
              </div>

              <div className="tdetail-info-item">
                <span className="tdetail-info-item__label">
                  <Wrench size={13} />
                  Dịch vụ
                </span>
                <span className="tdetail-info-item__value">
                  {currentTicket.itService?.service_name || '—'}
                </span>
              </div>
            </div>

            <div className="tdetail-summary-card__divider" />

            <div className="tdetail-info-item">
              <span className="tdetail-info-item__label">
                <FileText size={13} />
                Mô tả
              </span>
              <p className="tdetail-description">{currentTicket.description}</p>
            </div>

            {currentTicket.attachments?.length > 0 && (
              <>
                <div className="tdetail-summary-card__divider" />
                <div className="tdetail-info-item">
                  <span className="tdetail-info-item__label">
                    <Paperclip size={13} />
                    Ảnh đính kèm
                  </span>
                  <div className="tdetail-attachments">
                    {currentTicket.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tdetail-attachment"
                      >
                        <img src={attachment.fileUrl} alt={attachment.fileName || 'Ảnh đính kèm'} />
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {error && <p className="ticket-required">{error}</p>}

          {showThread && (
            <section className="ticket-section">
              <div className="ticket-section__label">
                <span>Hội thoại trao đổi</span>
              </div>
              <div className="tdetail-thread">
                {messages.map((message) => (
                  <div className="tdetail-message" key={message.id}>
                    <div className="tdetail-message__meta">
                      <span className="tdetail-message__time">{formatDate(message.createdAt)}</span>
                    </div>
                    <p className="tdetail-message__text">{message.message}</p>
                  </div>
                ))}
              </div>

              {ticket.status !== 'CLOSED' && (
                <form className="tdetail-reply" onSubmit={handleSend}>
                  <textarea
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    placeholder="Nhập phản hồi hoặc cập nhật thêm thông tin cho ticket này..."
                    rows={3}
                  />
                  <div className="tdetail-reply__actions">
                    <button
                      type="submit"
                      className="ticket-btn ticket-btn--primary"
                      disabled={!reply.trim() || isSending}
                    >
                      <Send size={15} />
                      {isSending ? 'Đang gửi...' : 'Gửi phản hồi'}
                    </button>
                  </div>
                </form>
              )}
            </section>
          )}
        </div>

        <footer className="ticket-modal__footer">
          <span className="ticket-modal__footer-note">Mã theo dõi: #{ticket.id}</span>
          <div className="ticket-modal__footer-actions">
            <button type="button" className="ticket-btn ticket-btn--ghost" onClick={onClose}>
              Đóng
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default TicketDetailModal
