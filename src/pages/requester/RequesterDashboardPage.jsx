import { Heart, MessageCircle, Repeat2, Share, Ticket, User } from 'lucide-react'
import RequesterLayout from './RequesterLayout.jsx'
import '../../styles/requester/RequesterDashboardPage.css'

const FEED_ITEMS = [
  {
    type: 'announcement',
    author: 'Đội CNTT',
    handle: 'it_support',
    time: '2 giờ',
    content: 'Bảo trì VPN khu vực US-East vào Chủ nhật này lúc 02:00 UTC. Thời gian gián đoạn dự kiến khoảng 45 phút. Vui lòng lưu công việc trước thời điểm trên.',
    image: 'https://picsum.photos/seed/vpn-maintenance/640/360',
  },
  {
    type: 'ticket',
    author: 'Hoạt động ticket',
    handle: 'ticket_bot',
    time: '5 giờ',
    content: '#IT-8492 · Màn hình rời chớp trên dock Thunderbolt 4 đang được tiếp nhận xử lý tại Bàn 4B - Khu Kỹ thuật.',
  },
  {
    type: 'announcement',
    author: 'Đội CNTT',
    handle: 'it_support',
    time: '8 giờ',
    content: 'Khuyến nghị cập nhật macOS Sonoma cho toàn bộ thiết bị trước ngày 10/11 để đảm bảo tương thích bảo mật.',
    image: 'https://picsum.photos/seed/macos-update/640/360',
  },
  {
    type: 'guide',
    author: 'Thư viện hướng dẫn',
    handle: 'it_guides',
    time: '1 ngày',
    content: 'Hướng dẫn mới: Cấu hình YubiKey cho đăng nhập một lần AWS. Thiết lập xác thực 2 lớp chỉ trong 5 phút.',
    image: 'https://picsum.photos/seed/yubikey-guide/640/360',
  },
  {
    type: 'ticket',
    author: 'Hoạt động ticket',
    handle: 'ticket_bot',
    time: '2 ngày',
    content: '#IT-8480 · Cấp quyền truy cập read-replica cơ sở dữ liệu đang chờ phản hồi từ đội vận hành hạ tầng.',
  },
  {
    type: 'announcement',
    author: 'Đội CNTT',
    handle: 'it_support',
    time: '3 ngày',
    content: 'Đã hoàn tất di dời hạ tầng mạng Wi-Fi tại tòa nhà C, tốc độ kết nối được cải thiện đáng kể.',
    image: 'https://picsum.photos/seed/wifi-upgrade/640/360',
  },
  {
    type: 'guide',
    author: 'Thư viện hướng dẫn',
    handle: 'it_guides',
    time: '4 ngày',
    content: 'Hướng dẫn mới: Kết nối Wi-Fi nội bộ bảo mật qua EAP-TLS trên laptop công ty.',
    image: 'https://picsum.photos/seed/eap-tls-guide/640/360',
  },
]

function RequesterDashboardPage() {
  return (
    <RequesterLayout activeNav="dashboard">
      <div className="rfeed">
        <div className="rfeed__header">
          <h1>Bảng tin</h1>
        </div>

        <div className="rfeed__list">
          {FEED_ITEMS.map((item, index) => (
            <article className={`rfeed-post rfeed-post--${item.type}`} key={index}>
              <span className="rfeed-post__avatar">
                <User size={18} />
              </span>
              <div className="rfeed-post__body">
                <div className="rfeed-post__meta">
                  <span className="rfeed-post__author">{item.author}</span>
                  <span className="rfeed-post__handle">@{item.handle}</span>
                  <span className="rfeed-post__dot">·</span>
                  <span className="rfeed-post__time">{item.time}</span>
                </div>
                <p className="rfeed-post__content">{item.content}</p>
                {item.image && (
                  <div className="rfeed-post__image">
                    <img src={item.image} alt="" loading="lazy" />
                  </div>
                )}
                <div className="rfeed-post__actions">
                  <button type="button" className="rfeed-post__action">
                    <MessageCircle size={16} />
                  </button>
                  <button type="button" className="rfeed-post__action">
                    <Repeat2 size={16} />
                  </button>
                  <button type="button" className="rfeed-post__action">
                    <Heart size={16} />
                  </button>
                  <button type="button" className="rfeed-post__action">
                    <Share size={16} />
                  </button>
                  {item.type === 'ticket' && (
                    <span className="rfeed-post__tag">
                      <Ticket size={12} />
                      Ticket
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </RequesterLayout>
  )
}

export default RequesterDashboardPage
