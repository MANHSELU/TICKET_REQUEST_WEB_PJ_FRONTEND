import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Star } from 'lucide-react'
import SupporterLayout from './SupporterLayout.jsx'
import '../../styles/requester/TicketHistoryPage.css'
import '../../styles/supporter/SupporterRatingsPage.css'

const MOCK_RATINGS = [
  {
    id: 1,
    ticketTitle: 'Màn hình rời chớp trên dock Thunderbolt 4',
    requesterName: 'Nguyễn Văn An',
    score: 5,
    comment: 'Xử lý nhanh và nhiệt tình, cảm ơn bạn rất nhiều!',
    date: '04/10/2026',
  },
  {
    id: 2,
    ticketTitle: 'Cấp quyền truy cập read-replica cơ sở dữ liệu',
    requesterName: 'Trần Thị Bích',
    score: 4,
    comment: 'Hỗ trợ tốt nhưng phản hồi hơi chậm lúc đầu.',
    date: '02/10/2026',
  },
  {
    id: 3,
    ticketTitle: 'Cấu hình YubiKey cho đăng nhập một lần AWS',
    requesterName: 'Lê Hoàng Nam',
    score: 5,
    comment: 'Hướng dẫn rất chi tiết, dễ hiểu.',
    date: '28/09/2026',
  },
]

function SupporterRatingsPage() {
  const navigate = useNavigate()
  const averageScore =
    MOCK_RATINGS.reduce((sum, item) => sum + item.score, 0) / MOCK_RATINGS.length

  return (
    <SupporterLayout activeNav="ratings">
      <div className="thist-heading">
        <div className="thist-heading__title">
          <button
            type="button"
            className="thist-back-btn"
            onClick={() => navigate('/supporter/dashboard')}
            aria-label="Quay lại"
          >
            <ArrowLeft size={18} />
          </button>
          <h1>Đánh giá của tôi</h1>
        </div>
      </div>

      <section className="thist-summary srat-summary--2col">
        <div className="thist-summary-card">
          <div>
            <div className="thist-summary-card__value">{averageScore.toFixed(1)} / 5</div>
            <div className="thist-summary-card__label">ĐIỂM TRUNG BÌNH</div>
            <div className="thist-summary-card__hint">Dựa trên đánh giá của người yêu cầu</div>
          </div>
          <span className="thist-summary-card__icon thist-summary-card__icon--success">
            <Star size={18} />
          </span>
        </div>
        <div className="thist-summary-card">
          <div>
            <div className="thist-summary-card__value">{MOCK_RATINGS.length}</div>
            <div className="thist-summary-card__label">TỔNG LƯỢT ĐÁNH GIÁ</div>
            <div className="thist-summary-card__hint">Từ các yêu cầu đã hoàn thành</div>
          </div>
          <span className="thist-summary-card__icon thist-summary-card__icon--info">
            <Star size={18} />
          </span>
        </div>
      </section>

      <div className="srat-list">
        {MOCK_RATINGS.map((item) => (
          <div className="srat-card" key={item.id}>
            <div className="srat-card__header">
              <div>
                <div className="srat-card__ticket">{item.ticketTitle}</div>
                <div className="srat-card__requester">{item.requesterName} · {item.date}</div>
              </div>
              <div className="srat-card__stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={15}
                    className={index < item.score ? 'srat-star srat-star--filled' : 'srat-star'}
                  />
                ))}
              </div>
            </div>
            <p className="srat-card__comment">{item.comment}</p>
          </div>
        ))}
      </div>
    </SupporterLayout>
  )
}

export default SupporterRatingsPage
