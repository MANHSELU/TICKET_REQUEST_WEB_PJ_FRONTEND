import {
  AlertTriangle,
  ChevronRight,
  ClipboardList,
  Cloud,
  Gauge,
  Grid2x2,
  KeyRound,
  Laptop,
  Megaphone,
  Monitor,
  Shield,
  ShieldCheck,
  Ticket,
  Wifi,
  Wrench,
} from 'lucide-react'
import RequesterLayout from './RequesterLayout.jsx'
import '../../styles/requester/RequesterDashboardPage.css'

const QUICK_ACTIONS = [
  {
    icon: AlertTriangle,
    tone: 'danger',
    tag: 'Thiết bị & Hệ thống gặp sự cố',
    title: 'Báo cáo sự cố',
    description: 'Báo cáo thiết bị hỏng, sự cố đường mạng, hoặc...',
    actionIcon: Wrench,
    actionLabel: 'Nhận hỗ trợ',
  },
  {
    icon: Monitor,
    tone: 'neutral',
    tag: 'Danh mục tiêu chuẩn',
    title: 'Yêu cầu thiết bị',
    description: 'Yêu cầu màn hình, laptop, thiết bị ngoại vi, hoặc...',
    actionIcon: Laptop,
    actionLabel: 'Xem thiết bị',
  },
  {
    icon: Cloud,
    tone: 'neutral',
    tag: 'Phê duyệt tức thì',
    title: 'Phần mềm & Bản quyền',
    description: 'Yêu cầu bản quyền IDE, bộ Adobe, phần mềm...',
    actionIcon: Grid2x2,
    actionLabel: 'Yêu cầu ứng dụng',
  },
  {
    icon: ShieldCheck,
    tone: 'neutral',
    tag: 'Đã xác thực bảo mật',
    title: 'Truy cập & Quyền hạn',
    description: 'VPN, quyền truy cập kho mã nguồn, tài khoản đám mây...',
    actionIcon: KeyRound,
    actionLabel: 'Yêu cầu truy cập',
  },
]

const RECENT_TICKETS = [
  {
    id: '#IT-8492',
    subject: 'Màn hình rời chớp trên dock Thunderbolt 4',
    note: 'Bàn 4B - Khu Kỹ thuật',
    type: 'Thiết bị',
    typeIcon: Monitor,
    date: 'Hôm nay, 09:15',
    status: 'Mới',
    statusTone: 'new',
  },
  {
    id: '#IT-8480',
    subject: 'Cấp quyền truy cập read-replica cơ sở dữ liệu',
    note: 'Cụm PostgreSQL AWS Staging',
    type: 'Truy cập',
    typeIcon: KeyRound,
    date: 'Hôm qua, 16:30',
    status: 'Đang xử lý',
    statusTone: 'progress',
  },
  {
    id: '#IT-8451',
    subject: 'Chuyển nhóm tổ chức Figma Enterprise',
    note: 'Cấp phép license cho Core UX',
    type: 'Sự cố',
    typeIcon: AlertTriangle,
    date: '24 Th10, 14:10',
    status: 'Chờ người yêu cầu',
    statusTone: 'waiting',
  },
  {
    id: '#IT-8399',
    subject: 'Bộ sạc USB-C thay thế (96W)',
    note: 'Đã giao tới Locker Bay #12',
    type: 'Thiết bị',
    typeIcon: Monitor,
    date: '21 Th10, 11:04',
    status: 'Đã xử lý',
    statusTone: 'resolved',
  },
]

const BROADCASTS = [
  {
    icon: AlertTriangle,
    title: 'Bảo trì theo lịch',
    description: 'Bảo trì VPN khu vực US-East vào Chủ nhật này lúc 02:00 UTC.',
    meta: 'Thời gian gián đoạn dự kiến: ~45 phút',
  },
  {
    icon: Shield,
    title: 'Thông báo cập nhật macOS Sonoma',
    description: 'Khuyến nghị áp dụng cho toàn bộ thiết bị trước ngày 10/11.',
    link: true,
  },
  {
    icon: Wifi,
    title: 'Nâng cấp Wi-Fi khuôn viên',
    description: 'Đã hoàn tất di dời hạ tầng tại tòa nhà C.',
    link: true,
  },
]

const GUIDES = [
  'Cấu hình YubiKey cho đăng nhập một lần AWS',
  'Kết nối Wi-Fi nội bộ bảo mật qua EAP-TLS',
  'Chính sách hoàn tiền thiết bị ngoại vi làm việc tại nhà',
]

function RequesterDashboardPage() {
  return (
    <RequesterLayout activeNav="dashboard">
      <section className="rdash-actions">
        {QUICK_ACTIONS.map((action) => (
          <div className="rdash-action-card" key={action.title}>
            <div className="rdash-action-card__top">
              <span className={`rdash-action-card__icon rdash-action-card__icon--${action.tone}`}>
                <action.icon size={20} />
              </span>
              <span className="rdash-action-card__tag">{action.tag}</span>
            </div>
            <h3>{action.title}</h3>
            <p>{action.description}</p>
            <button type="button" className="rdash-action-card__button">
              <action.actionIcon size={15} />
              {action.actionLabel}
            </button>
          </div>
        ))}
      </section>

      <section className="rdash-lower">
        <div className="rdash-tickets">
          <div className="rdash-panel__header">
            <h2>
              <Ticket size={16} />
              Ticket gần đây
              <span className="rdash-panel__count">4 Tổng cộng</span>
            </h2>
            <button type="button" className="rdash-link-button">
              Xem tất cả ticket
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="rdash-table">
            <div className="rdash-table__head">
              <span>MÃ TICKET</span>
              <span>CHỦ ĐỀ</span>
              <span>LOẠI</span>
              <span>NGÀY GỬI</span>
              <span>TRẠNG THÁI</span>
            </div>
            {RECENT_TICKETS.map((ticket) => (
              <div className="rdash-table__row" key={ticket.id}>
                <span className="rdash-table__id">{ticket.id}</span>
                <span className="rdash-table__subject">
                  <span className="rdash-table__subject-title">{ticket.subject}</span>
                  <span className="rdash-table__subject-note">{ticket.note}</span>
                </span>
                <span className="rdash-table__type">
                  <ticket.typeIcon size={13} />
                  {ticket.type}
                </span>
                <span className="rdash-table__date">{ticket.date}</span>
                <span className={`rdash-status-badge rdash-status-badge--${ticket.statusTone}`}>
                  <span className="rdash-status-badge__dot" />
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rdash-side">
          <div className="rdash-panel">
            <div className="rdash-panel__header">
              <h2>
                <Megaphone size={16} />
                Thông báo IT
              </h2>
              <span className="rdash-status__dot" />
            </div>
            <div className="rdash-broadcasts">
              {BROADCASTS.map((item) => (
                <div className="rdash-broadcast" key={item.title}>
                  <span className="rdash-broadcast__icon">
                    <item.icon size={16} />
                  </span>
                  <div>
                    <div className="rdash-broadcast__title">
                      {item.title}
                      {item.link && <ChevronRight size={13} />}
                    </div>
                    <p>{item.description}</p>
                    {item.meta && (
                      <span className="rdash-broadcast__meta">
                        <Gauge size={12} />
                        {item.meta}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rdash-panel">
            <div className="rdash-panel__header">
              <h2>
                <ClipboardList size={16} />
                Hướng dẫn phổ biến
              </h2>
            </div>
            <div className="rdash-guides">
              {GUIDES.map((guide) => (
                <button type="button" className="rdash-guide" key={guide}>
                  {guide}
                  <ChevronRight size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </RequesterLayout>
  )
}

export default RequesterDashboardPage
