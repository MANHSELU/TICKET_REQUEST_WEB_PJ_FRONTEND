import { useEffect, useState } from 'react'
import { Megaphone, User } from 'lucide-react'
import SupporterLayout from './SupporterLayout.jsx'
import { getAllAnnouncementsApi } from '../../services/supporter/announcement.service'
import '../../styles/requester/NewTicketModal.css'
import '../../styles/requester/RequesterDashboardPage.css'
import '../../styles/supporter/SupporterFeedPage.css'

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

function SupporterFeedPage() {
  const [announcements, setAnnouncements] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getAllAnnouncementsApi()
      .then((res) => setAnnouncements(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Không tải được bảng tin'))
  }, [])

  return (
    <SupporterLayout activeNav="feed">
      <div className="thist-heading">
        <div className="thist-heading__title">
          <h1>Bảng tin</h1>
        </div>
      </div>

      <div className="rfeed">
        {error && <p className="ticket-required">{error}</p>}

        {announcements.length === 0 && !error && (
          <div className="rfeed-empty">
            <Megaphone size={20} />
            Chưa có thông báo nào được đăng
          </div>
        )}

        <div className="rfeed__list">
          {announcements.map((item) => (
            <article className="rfeed-post rfeed-post--announcement" key={item.id}>
              <span className="rfeed-post__avatar">
                <User size={18} />
              </span>
              <div className="rfeed-post__body">
                <div className="rfeed-post__meta">
                  <span className="rfeed-post__author">{item.author?.fullName || 'Đội CNTT'}</span>
                  <span className="rfeed-post__dot">·</span>
                  <span className="rfeed-post__time">{formatDate(item.createdAt)}</span>
                </div>
                <p className="rfeed-post__content">
                  <strong>{item.title}</strong>
                  <br />
                  {item.content}
                </p>
                {item.imageUrl && (
                  <div className="rfeed-post__image">
                    <img src={item.imageUrl} alt={item.title} loading="lazy" />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </SupporterLayout>
  )
}

export default SupporterFeedPage
