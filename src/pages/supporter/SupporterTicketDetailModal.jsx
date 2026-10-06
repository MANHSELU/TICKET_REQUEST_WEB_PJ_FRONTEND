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
  UserCheck,
  Wrench,
  X,
} from 'lucide-react'
import {
  acceptTicketApi,
  closeTicketApi,
  getMessagesApi,
  getTicketDetailApi,
  sendMessageApi,
} from '../../services/supporter/ticketManagement.service'
import { decodeJwt } from '../../utils/jwt.util'
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

function SupporterTicketDetailModal({ ticketId, onClose, onChanged, onToast }) {
  const [reply, setReply] = useState('')
  const [messages, setMessages] = useState([])
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isActing, setIsActing] = useState(false)

  let currentUserId = null
  try {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) currentUserId = decodeJwt(accessToken).userId
  } catch {
    currentUserId = null
  }

  const fetchDetail = async () => {
    try {
      const res = await getTicketDetailApi(ticketId)
      setTicket(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được chi tiết yêu cầu')
    }
  }

  const fetchMessages = async () => {
    try {
      const res = await getMessagesApi(ticketId)
      setMessages(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được đoạn hội thoại')
    }
  }

  useEffect(() => {
    if (!ticketId) return
    setTicket(null)
    setMessages([])
    setError('')
    fetchDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId])

  useEffect(() => {
    if (ticket && ticket.status !== 'OPEN') {
      fetchMessages()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket?.status])

  if (!ticketId || !ticket) return null

  const currentStageIndex = STATUS_STAGE_INDEX[ticket.status] ?? 0
  const showThread = ticket.status !== 'OPEN'

  const handleSend = async (event) => {
    event.preventDefault()
    if (!reply.trim()) return

    setIsSending(true)
    setError('')
    try {
      await sendMessageApi({ ticketId, message: reply })
      setReply('')
      fetchMessages()
    } catch (err) {
      setError(err.response?.data?.message || 'Không gửi được tin nhắn')
    } finally {
      setIsSending(false)
    }
  }

  const handleAccept = async () => {
    setIsActing(true)
    try {
      await acceptTicketApi(ticketId)
      onToast?.('Tiếp nhận yêu cầu thành công!')
      await fetchDetail()
      onChanged?.()
    } catch (err) {
      onToast?.(err.response?.data?.message || 'Tiếp nhận thất bại', 'error')
    } finally {
      setIsActing(false)
    }
  }

  const handleClose = async () => {
    setIsActing(true)
    try {
      await closeTicketApi(ticketId)
      onToast?.('Đã đóng yêu cầu thành công!')
      await fetchDetail()
      onChanged?.()
    } catch (err) {
      onToast?.(err.response?.data?.message || 'Đóng yêu cầu thất bại', 'error')
    } finally {
      setIsActing(false)
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
            <h2>
              <span className="tdetail-header__label">Mô tả yêu cầu: </span>
              {ticket.title}
            </h2>
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
                <span className="tdetail-info-item__value">{formatDate(ticket.createdAt)}</span>
              </div>

              <div className="tdetail-info-item">
                <span className="tdetail-info-item__label">
                  <Gauge size={13} />
                  Mức độ ưu tiên
                </span>
                <span
                  className={`thist-status-badge thist-status-badge--${
                    PRIORITY_TONE[ticket.priority] || 'closed'
                  }`}
                >
                  <span className="thist-status-badge__dot" />
                  {PRIORITY_LABEL[ticket.priority] || ticket.priority || '—'}
                </span>
              </div>

              <div className="tdetail-info-item">
                <span className="tdetail-info-item__label">
                  <Grid2x2 size={13} />
                  Danh mục yêu cầu
                </span>
                <span className="tdetail-info-item__value">
                  {ticket.ticketCategory?.category_name || '—'}
                </span>
              </div>

              <div className="tdetail-info-item">
                <span className="tdetail-info-item__label">
                  <Wrench size={13} />
                  Dịch vụ
                </span>
                <span className="tdetail-info-item__value">
                  {ticket.itService?.service_name || '—'}
                </span>
              </div>
            </div>

            <div className="tdetail-summary-card__divider" />

            <div className="tdetail-info-item">
              <span className="tdetail-info-item__label">
                <FileText size={13} />
                Mô tả
              </span>
              <p className="tdetail-description">{ticket.description}</p>
            </div>

            {ticket.attachments?.length > 0 && (
              <>
                <div className="tdetail-summary-card__divider" />
                <div className="tdetail-info-item">
                  <span className="tdetail-info-item__label">
                    <Paperclip size={13} />
                    Ảnh đính kèm
                  </span>
                  <div className="tdetail-attachments">
                    {ticket.attachments.map((attachment) => (
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
                  <div
                    className={
                      message.senderId === currentUserId
                        ? 'tdetail-message tdetail-message--self'
                        : 'tdetail-message'
                    }
                    key={message.id}
                  >
                    <div className="tdetail-message__meta">
                      <span className="tdetail-message__author">
                        {message.senderId === currentUserId ? 'Bạn' : 'Người yêu cầu'}
                      </span>
                      <span className="tdetail-message__time">{formatDate(message.createdAt)}</span>
                    </div>
                    <p className="tdetail-message__text">{message.message}</p>
                  </div>
                ))}
              </div>

              {ticket.status === 'IN_PROGRESS' && (
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
          <div className="ticket-modal__footer-actions">
            <button type="button" className="ticket-btn ticket-btn--ghost" onClick={onClose}>
              Đóng cửa sổ
            </button>
            {ticket.status === 'OPEN' && (
              <button
                type="button"
                className="ticket-btn ticket-btn--primary"
                onClick={handleAccept}
                disabled={isActing}
              >
                <UserCheck size={15} />
                {isActing ? 'Đang xử lý...' : 'Tiếp nhận yêu cầu'}
              </button>
            )}
            {ticket.status === 'IN_PROGRESS' && (
              <button
                type="button"
                className="ticket-btn ticket-btn--primary"
                onClick={handleClose}
                disabled={isActing}
              >
                <CheckCircle2 size={15} />
                {isActing ? 'Đang xử lý...' : 'Đóng yêu cầu'}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}

export default SupporterTicketDetailModal
