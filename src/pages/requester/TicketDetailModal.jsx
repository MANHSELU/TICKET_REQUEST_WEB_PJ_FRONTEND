import { useState } from 'react'
import {
  Calendar,
  CheckCircle2,
  Circle,
  FileText,
  Paperclip,
  Send,
  User,
  X,
} from 'lucide-react'
import '../../styles/requester/NewTicketModal.css'
import '../../styles/requester/TicketDetailModal.css'

const STAGES = ['Chưa tiếp nhận', 'Đã tiếp nhận', 'Đang xử lý', 'Đã hoàn thành']

const STAGE_ALIASES = {
  Mới: 'Chưa tiếp nhận',
  'Chờ phản hồi': 'Đã tiếp nhận',
  'Đã xử lý': 'Đã hoàn thành',
  'Đã đóng': 'Đã hoàn thành',
}

const MESSAGES = [
  {
    id: 1,
    author: 'Bạn',
    self: true,
    time: 'Hôm nay 09:15',
    text: 'Sự cố lặp lại nhiều lần trong sáng nay, ảnh hưởng đến công việc từ xa. Mong sớm được hỗ trợ.',
  },
  {
    id: 2,
    author: 'Alex Mercer · Staff L1',
    self: false,
    time: 'Hôm nay 09:40',
    text: 'Chào bạn, mình đã ghi nhận sự cố và đang kiểm tra log kết nối VPN phía server. Sẽ phản hồi sớm nhất.',
  },
]

function TicketDetailModal({ ticket, onClose }) {
  const [reply, setReply] = useState('')

  if (!ticket) return null

  const currentStageIndex = STAGES.indexOf(STAGE_ALIASES[ticket.status] ?? ticket.status)
  const showThread = currentStageIndex === 1 || currentStageIndex === 2

  const handleSend = (event) => {
    event.preventDefault()
    setReply('')
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
            <span className="tdetail-header__id">{ticket.id}</span>
            <h2>{ticket.subject}</h2>
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

          <div className="tdetail-assignee">
            <span className="tdetail-assignee__avatar">
              <User size={14} />
            </span>
            Phụ trách: <strong>Alex Mercer</strong> · Staff L1
          </div>

          <div className="tdetail-summary-card">
            <div className="tdetail-info-grid">
              <div className="tdetail-info-item">
                <span className="tdetail-info-item__label">
                  <ticket.typeIcon size={13} />
                  Loại yêu cầu
                </span>
                <span className="tdetail-info-item__value">{ticket.type}</span>
              </div>
              <div className="tdetail-info-item">
                <span className="tdetail-info-item__label">
                  <Calendar size={13} />
                  Ngày gửi
                </span>
                <span className="tdetail-info-item__value">{ticket.submitted}</span>
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
          </div>

          {showThread && (
            <section className="ticket-section">
              <div className="ticket-section__label">
                <span>Hội thoại trao đổi</span>
              </div>
              <div className="tdetail-thread">
                {MESSAGES.map((message) => (
                  <div
                    className={
                      message.self ? 'tdetail-message tdetail-message--self' : 'tdetail-message'
                    }
                    key={message.id}
                  >
                    <div className="tdetail-message__meta">
                      <span className="tdetail-message__author">{message.author}</span>
                      <span className="tdetail-message__time">{message.time}</span>
                    </div>
                    <p className="tdetail-message__text">{message.text}</p>
                  </div>
                ))}
              </div>

              <form className="tdetail-reply" onSubmit={handleSend}>
                <textarea
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="Nhập phản hồi hoặc cập nhật thêm thông tin cho ticket này..."
                  rows={3}
                />
                <div className="tdetail-reply__actions">
                  <button type="button" className="tdetail-reply__attach" aria-label="Đính kèm tệp">
                    <Paperclip size={15} />
                  </button>
                  <button
                    type="submit"
                    className="ticket-btn ticket-btn--primary"
                    disabled={!reply.trim()}
                  >
                    <Send size={15} />
                    Gửi phản hồi
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>

        <footer className="ticket-modal__footer">
          <span className="ticket-modal__footer-note">Mã theo dõi: {ticket.id}</span>
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
