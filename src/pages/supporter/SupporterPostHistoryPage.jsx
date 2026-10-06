import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Megaphone, PlusCircle } from 'lucide-react'
import SupporterLayout from './SupporterLayout.jsx'
import Toast from '../../components/common/Toast.jsx'
import { getMyAnnouncementsApi } from '../../services/supporter/announcement.service'
import '../../styles/requester/RequesterDashboardPage.css'
import '../../styles/requester/TicketHistoryPage.css'
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

function SupporterPostHistoryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [announcements, setAnnouncements] = useState([])
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const toastTimerRef = useRef(null)

  useEffect(() => {
    getMyAnnouncementsApi()
      .then((res) => setAnnouncements(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Không tải được lịch sử bài đăng'))
  }, [])

  useEffect(() => {
    if (location.state?.toastMessage) {
      setToast({ message: location.state.toastMessage, type: 'success' })
      toastTimerRef.current = setTimeout(() => setToast(null), 2000)
      navigate(location.pathname, { replace: true, state: null })
    }
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state])

  return (
    <SupporterLayout activeNav="post-history">
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
          <h1>Lịch sử bài đăng</h1>
        </div>
        <button
          type="button"
          className="thist-submit-btn"
          onClick={() => navigate('/supporter/posts/new')}
        >
          <PlusCircle size={15} />
          Đăng bài mới
        </button>
      </div>

      <div className="rfeed">
        {error && <p className="ticket-required">{error}</p>}

        {announcements.length === 0 && !error && (
          <div className="rfeed-empty">
            <Megaphone size={20} />
            Bạn chưa đăng thông báo nào
          </div>
        )}

        <div className="rfeed__list">
          {announcements.map((item) => (
            <article className="rfeed-post" key={item.id}>
              <span className="rfeed-post__avatar">
                <Megaphone size={18} />
              </span>
              <div className="rfeed-post__body">
                <div className="rfeed-post__meta">
                  <span className="rfeed-post__author">{item.title}</span>
                  <span className="rfeed-post__dot">·</span>
                  <span className="rfeed-post__time">{formatDate(item.createdAt)}</span>
                </div>
                <p className="rfeed-post__content">{item.content}</p>
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

      <Toast toast={toast} />
    </SupporterLayout>
  )
}

export default SupporterPostHistoryPage
