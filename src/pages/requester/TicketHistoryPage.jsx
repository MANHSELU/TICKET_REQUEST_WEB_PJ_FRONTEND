import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Folder,
  Gauge,
  KeyRound,
  Loader2,
  Monitor,
  PlusCircle,
  Reply,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import RequesterLayout from './RequesterLayout.jsx'
import TicketDetailModal from './TicketDetailModal.jsx'
import '../../styles/requester/TicketHistoryPage.css'

const SUMMARY_CARDS = [
  {
    icon: Folder,
    hintIcon: Gauge,
    tone: 'neutral',
    value: '7',
    label: 'TẤT CẢ YÊU CẦU',
    hint: 'Ghi nhận trong toàn bộ thời gian',
  },
  {
    icon: Loader2,
    hintIcon: Gauge,
    tone: 'info',
    value: '3',
    label: 'ĐANG MỞ & XỬ LÝ',
    hint: 'Đang được kiểm tra & xử lý',
  },
  {
    icon: Reply,
    hintIcon: AlertTriangle,
    tone: 'danger',
    value: '1',
    label: 'CHỜ PHẢN HỒI CỦA BẠN',
    hint: 'Cần hành động ngay',
    badge: true,
  },
  {
    icon: CheckCircle2,
    hintIcon: Gauge,
    tone: 'success',
    value: '3',
    label: 'ĐÃ XỬ LÝ & ĐÓNG',
    hint: 'Mức độ hài lòng 100%',
  },
]

const TICKETS = [
  {
    id: '#IT-8501',
    subject: 'Yêu cầu cấp thêm dung lượng ổ đĩa cho máy trạm',
    note: 'Chưa có nhân viên tiếp nhận...',
    description:
      'Ổ đĩa hệ thống chỉ còn trống dưới 5%, cần cấp thêm dung lượng lưu trữ để tiếp tục làm việc bình thường.',
    location: 'Bàn 12A - Khu Vận hành',
    type: 'Cấp phát thiết bị',
    typeIcon: Monitor,
    submitted: '14-09-2026, 10:05',
    activity: 'Vừa gửi',
    activityNote: 'Đang chờ hàng đợi tiếp nhận',
    status: 'Chưa tiếp nhận',
    statusTone: 'closed',
  },
  {
    id: '#IT-8492',
    subject: 'Cổng VPN sản xuất bị rớt kết nối mỗi 10 phút',
    note: 'Ảnh hưởng làm việc từ xa...',
    description:
      'Kết nối VPN tới môi trường sản xuất liên tục bị rớt mỗi khoảng 10 phút kể từ sáng nay, ảnh hưởng trực tiếp đến công việc làm từ xa.',
    location: 'Làm việc từ xa',
    type: 'Sự cố kỹ thuật',
    typeIcon: AlertTriangle,
    submitted: '14-09-2026, 09:15',
    activity: '14 phút trước',
    activityNote: 'Ghi chú của Staff L1 đã thêm',
    status: 'Đang xử lý',
    statusTone: 'progress',
  },
  {
    id: '#IT-8474',
    subject: 'Âm thanh Bluetooth bị giật trên Dell Latitude 7430',
    note: 'Đoạn âm thanh trong...',
    description:
      'Đoạn âm thanh trong các cuộc gọi bị giật, ngắt quãng liên tục khi kết nối tai nghe Bluetooth với laptop Dell Latitude 7430.',
    location: 'Bàn 4B - Khu Kỹ thuật',
    type: 'Cấp phát thiết bị',
    typeIcon: Monitor,
    submitted: '14-09-2026, 08:20',
    activity: '2 giờ trước',
    activityNote: 'Phản hồi từ Alex M.',
    status: 'Đã tiếp nhận',
    statusTone: 'waiting',
    actionNeeded: true,
  },
  {
    id: '#IT-8488',
    subject: 'Cấp quyền truy cập read-replica cơ sở dữ liệu',
    note: 'Yêu cầu quyền truy...',
    description:
      'Cần được cấp quyền truy cập read-only tới cụm PostgreSQL AWS Staging để phục vụ công việc phân tích dữ liệu.',
    location: 'Cụm PostgreSQL AWS Staging',
    type: 'Truy cập tài khoản',
    typeIcon: KeyRound,
    submitted: '13-09-2026, 16:30',
    activity: 'Hôm qua 17:10',
    activityNote: 'SecOps đang xem xét chính sách',
    status: 'Đang xử lý',
    statusTone: 'progress',
  },
  {
    id: '#IT-8451',
    subject: 'Chuyển nhóm tổ chức Figma Enterprise',
    note: 'Di chuyển license phần...',
    description: 'Di chuyển license phần mềm Figma Enterprise sang nhóm tổ chức mới cho đội Core UX.',
    location: 'Đội Core UX',
    type: 'Phần mềm & Bản quyền',
    typeIcon: Folder,
    submitted: '24-10-2025, 14:10',
    activity: '24 Th10, 16:00',
    activityNote: 'Hoàn tất bởi SysAdmin',
    status: 'Đã hoàn thành',
    statusTone: 'resolved',
  },
  {
    id: '#IT-8399',
    subject: 'Bộ sạc USB-C thay thế (96W)',
    note: 'Đã xác nhận lấy tại...',
    description: 'Bộ sạc USB-C 96W hiện tại đã hỏng, cần cấp thiết bị thay thế để tiếp tục sử dụng laptop.',
    location: 'Locker Bay #12',
    type: 'Cấp phát thiết bị',
    typeIcon: Monitor,
    submitted: '21-10-2025, 11:04',
    activity: '22 Th10, 09:15',
    activityNote: 'Đã kiểm tra xuất kho tài sản',
    status: 'Đã hoàn thành',
    statusTone: 'resolved',
  },
]

function TicketHistoryPage() {
  const navigate = useNavigate()
  const [selectedTicket, setSelectedTicket] = useState(null)

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

      <section className="thist-summary">
        {SUMMARY_CARDS.map((card) => (
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
              {card.badge && <span className="thist-summary-card__dot" />}
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
          Loại: Tất cả danh mục
          <ChevronRight size={13} />
        </button>
        <button type="button" className="thist-filter">
          Ngày: 30 ngày gần nhất
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
              <th>Chủ đề / Tóm tắt</th>
              <th>Loại</th>
              <th>Ngày gửi</th>
              <th>Hoạt động gần nhất</th>
              <th>Trạng thái</th>
              <th className="thist-table__actions-head">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {TICKETS.map((ticket) => (
              <tr
                className={ticket.actionNeeded ? 'thist-table__row--flag' : undefined}
                key={ticket.id}
              >
                <td className="thist-table__id">{ticket.id}</td>
                <td>
                  <div className="thist-table__subject-title">
                    {ticket.actionNeeded && <span className="thist-flag-dot" aria-hidden="true" />}
                    {ticket.subject}
                  </div>
                  <div className="thist-table__subject-note">{ticket.note}</div>
                </td>
                <td>
                  <span className="thist-table__type">
                    <ticket.typeIcon size={14} />
                    <span>{ticket.type}</span>
                  </span>
                </td>
                <td className="thist-table__date">{ticket.submitted}</td>
                <td>
                  <div className="thist-table__activity-time">{ticket.activity}</div>
                  <div className="thist-table__activity-note">{ticket.activityNote}</div>
                </td>
                <td>
                  <span className={`thist-status-badge thist-status-badge--${ticket.statusTone}`}>
                    <span className="thist-status-badge__dot" />
                    {ticket.status}
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

      <div className="thist-pagination">
        <div className="thist-pagination__controls">
          <button type="button" disabled>
            Trước
          </button>
          <button type="button" className="thist-pagination__page thist-pagination__page--active">
            1
          </button>
          <button type="button" className="thist-pagination__page">
            2
          </button>
          <button type="button">
            Tiếp
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      <TicketDetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
    </RequesterLayout>
  )
}

export default TicketHistoryPage
