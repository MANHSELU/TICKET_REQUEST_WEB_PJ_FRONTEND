import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ImagePlus, Send, Trash2 } from 'lucide-react'
import SupporterLayout from './SupporterLayout.jsx'
import { createAnnouncementApi } from '../../services/supporter/announcement.service'
import '../../styles/requester/TicketHistoryPage.css'
import '../../styles/requester/NewTicketModal.css'
import '../../styles/requester/NewTicketPage.css'

function SupporterCreatePostPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const previewUrl = image ? URL.createObjectURL(image) : null

  const handleImageSelected = (fileList) => {
    const file = fileList?.[0]
    if (file) setImage(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!title.trim() || !content.trim()) {
      setError('Vui lòng nhập đầy đủ tiêu đề và nội dung')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      if (image) {
        formData.append('image', image)
      }
      await createAnnouncementApi(formData)
      navigate('/supporter/posts', {
        state: { toastMessage: 'Đăng thông báo thành công!' },
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SupporterLayout activeNav="create-post">
      <div className="thist-heading">
        <div className="thist-heading__title">
          <button
            type="button"
            className="thist-back-btn"
            onClick={() => navigate('/supporter/posts')}
            aria-label="Quay lại"
          >
            <ArrowLeft size={18} />
          </button>
          <h1>Đăng thông báo mới</h1>
        </div>
      </div>

      <div className="ticket-page">
        <div className="ticket-page__card">
          <form className="ticket-modal__body ticket-page__body" onSubmit={handleSubmit}>
            <section className="ticket-section">
              <div className="ticket-section__label">
                <span>1. Tiêu đề thông báo</span>
                <span className="ticket-required">Bắt buộc</span>
              </div>
              <div className="ticket-summary-input">
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Bảo trì VPN khu vực US-East vào Chủ nhật này"
                  maxLength={150}
                />
              </div>
            </section>

            <section className="ticket-section">
              <div className="ticket-section__label">
                <span>2. Nội dung</span>
                <span className="ticket-required">Bắt buộc</span>
              </div>
              <div className="ticket-editor">
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Nhập nội dung chi tiết của thông báo..."
                  rows={8}
                />
              </div>
            </section>

            <section className="ticket-section">
              <div className="ticket-section__label">
                <span>3. Ảnh minh họa</span>
                <span className="ticket-hint">Không bắt buộc, tối đa 3MB</span>
              </div>

              {!image && (
                <div
                  className="ticket-dropzone"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault()
                    handleImageSelected(event.dataTransfer.files)
                  }}
                >
                  <span className="ticket-dropzone__icon">
                    <ImagePlus size={22} />
                  </span>
                  <p>
                    Kéo &amp; thả ảnh vào đây hoặc{' '}
                    <button type="button" onClick={() => fileInputRef.current?.click()}>
                      chọn ảnh
                    </button>{' '}
                    từ máy tính
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) => handleImageSelected(event.target.files)}
                  />
                </div>
              )}

              {image && (
                <div className="ticket-files">
                  <div className="ticket-file">
                    <span className="ticket-file__icon ticket-file__icon--preview">
                      <img src={previewUrl} alt={image.name} />
                    </span>
                    <span className="ticket-file__info">
                      <span className="ticket-file__name">{image.name}</span>
                    </span>
                    <button type="button" aria-label="Xóa ảnh" onClick={() => setImage(null)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
            </section>

            {error && <p className="ticket-required">{error}</p>}
          </form>

          <footer className="ticket-modal__footer">
            <div className="ticket-modal__footer-actions">
              <button
                type="button"
                className="ticket-btn ticket-btn--ghost"
                onClick={() => navigate('/supporter/feed')}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="ticket-btn ticket-btn--primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                <Send size={15} />
                {isSubmitting ? 'Đang đăng...' : 'Đăng thông báo'}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </SupporterLayout>
  )
}

export default SupporterCreatePostPage
