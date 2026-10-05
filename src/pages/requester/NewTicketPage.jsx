import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bold,
  Code,
  Eye,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  PenSquare,
  Quote,
  Send,
  Trash2,
  Underline,
} from 'lucide-react'
import RequesterLayout from './RequesterLayout.jsx'
import { createTicketApi, getItServicesApi, getTicketCategoriesApi } from '../../services/requester/ticketRequest.service'
import '../../styles/requester/NewTicketModal.css'
import '../../styles/requester/NewTicketPage.css'

const TOOLBAR_BUTTONS = [
  { icon: Bold, label: 'In đậm' },
  { icon: Italic, label: 'In nghiêng' },
  { icon: Underline, label: 'Gạch chân' },
  { icon: List, label: 'Danh sách' },
  { icon: ListOrdered, label: 'Danh sách số' },
  { icon: Code, label: 'Mã' },
  { icon: Link2, label: 'Liên kết' },
  { icon: Quote, label: 'Trích dẫn' },
]

function NewTicketPage() {
  const navigate = useNavigate()
  const [itServices, setItServices] = useState([])
  const [ticketCategories, setTicketCategories] = useState([])
  const [selectedItServiceId, setSelectedItServiceId] = useState('')
  const [selectedTicketCategoryId, setSelectedTicketCategoryId] = useState('')
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          getItServicesApi(),
          getTicketCategoriesApi(),
        ])
        setItServices(servicesRes.data.data)
        setTicketCategories(categoriesRes.data.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Không tải được danh sách dịch vụ/danh mục')
      }
    }
    fetchOptions()
  }, [])

  const handleFilesSelected = (fileList) => {
    const picked = Array.from(fileList)
    setFiles((current) => [...current, ...picked])
  }

  const handleDrop = (event) => {
    event.preventDefault()
    handleFilesSelected(event.dataTransfer.files)
  }

  const removeFile = (name) => {
    setFiles((current) => current.filter((file) => file.name !== name))
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleCancel = () => {
    navigate('/requester/tickets')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!selectedItServiceId || !selectedTicketCategoryId) {
      setError('Vui lòng chọn dịch vụ và danh mục yêu cầu')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('itServiceId', selectedItServiceId)
      formData.append('ticketCategoryId', selectedTicketCategoryId)
      formData.append('title', summary)
      formData.append('description', description)
      files.forEach((file) => {
        formData.append('attachments', file)
      })
      await createTicketApi(formData)
      navigate('/requester/tickets', {
        state: { toastMessage: 'Tạo yêu cầu hỗ trợ thành công!' },
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <RequesterLayout activeNav="create-ticket">
      <div className="ticket-page">
        <div className="ticket-page__heading">
          <button
            type="button"
            className="thist-back-btn"
            onClick={() => navigate('/requester/tickets')}
            aria-label="Quay lại"
          >
            <ArrowLeft size={18} />
          </button>
          <h1>Gửi yêu cầu hỗ trợ mới</h1>
        </div>

        <div className="ticket-page__card">
          <form className="ticket-modal__body ticket-page__body" onSubmit={handleSubmit}>
            <section className="ticket-section">
              <div className="ticket-section__label">
                <span>1. Chọn loại yêu cầu phù hợp nhất</span>
                <span className="ticket-required">Bắt buộc</span>
              </div>
              <div className="ticket-select-row">
                <div className="ticket-select-group">
                  <label className="ticket-select-group__label">Danh mục yêu cầu</label>
                  <select
                    className="ticket-select"
                    value={selectedTicketCategoryId}
                    onChange={(event) => setSelectedTicketCategoryId(event.target.value)}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {ticketCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ticket-select-group">
                  <label className="ticket-select-group__label">Dịch vụ</label>
                  <select
                    className="ticket-select"
                    value={selectedItServiceId}
                    onChange={(event) => setSelectedItServiceId(event.target.value)}
                  >
                    <option value="">-- Chọn dịch vụ --</option>
                    {itServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.service_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {error && <p className="ticket-required">{error}</p>}
            </section>

            <section className="ticket-section">
              <div className="ticket-section__label">
                <span>2. Tóm tắt ngắn gọn</span>
                <span className="ticket-required">Bắt buộc</span>
              </div>
              <div className="ticket-summary-input">
                <input
                  type="text"
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  placeholder="Màn hình rời liên tục bị mất kết nối khi cắm qua USB-C"
                  maxLength={140}
                />
                <PenSquare size={15} />
              </div>
            </section>

            <section className="ticket-section">
              <div className="ticket-section__label">
                <span>3. Mô tả chi tiết</span>
                <span className="ticket-hint">Hỗ trợ Markdown</span>
              </div>
              <div className="ticket-editor">
                <div className="ticket-editor__toolbar">
                  {TOOLBAR_BUTTONS.map((tool) => (
                    <button type="button" key={tool.label} aria-label={tool.label}>
                      <tool.icon size={15} />
                    </button>
                  ))}
                  <span className="ticket-editor__toolbar-spacer" />
                  <span className="ticket-editor__mode">Trình soạn thảo</span>
                </div>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={
                    'Mỗi sáng khi kết nối lại laptop với dock Thunderbolt 4 tại bàn #402, màn hình phụ ' +
                    'chớp liên tục trong 10-15 giây rồi tắt hẳn.\n\nCác bước đã thử:\n1. Cắm lại cáp DisplayPort và đổi cáp USB-C.\n2. Kiểm tra cáp nguồn đã cắm chặt.'
                  }
                  rows={9}
                />
              </div>
            </section>

            <section className="ticket-section">
              <div className="ticket-section__label">
                <span>4. Tệp đính kèm &amp; Minh chứng hệ thống</span>
                <span className="ticket-hint">Tối đa 5 ảnh, 3 MB/ảnh</span>
              </div>
              <div
                className="ticket-dropzone"
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
              >
                <span className="ticket-dropzone__icon">
                  <ImagePlus size={22} />
                </span>
                <p>
                  Kéo &amp; thả ảnh chụp màn hình vào đây
                  <br />
                  hoặc{' '}
                  <button type="button" onClick={() => fileInputRef.current?.click()}>
                    chọn ảnh
                  </button>{' '}
                  từ máy tính (chỉ nhận ảnh, tối đa 5 ảnh, 3MB/ảnh)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(event) => handleFilesSelected(event.target.files)}
                />
              </div>

              {files.length > 0 && (
                <div className="ticket-files">
                  <span className="ticket-files__label">
                    SẴN SÀNG TẢI LÊN ({files.length} tệp)
                  </span>
                  {files.map((file) => {
                    const previewUrl = URL.createObjectURL(file)
                    return (
                      <div className="ticket-file" key={file.name}>
                        <span className="ticket-file__icon ticket-file__icon--preview">
                          <img src={previewUrl} alt={file.name} />
                        </span>
                        <span className="ticket-file__info">
                          <span className="ticket-file__name">{file.name}</span>
                          <span className="ticket-file__meta">
                            {formatFileSize(file.size)} · {file.type || 'Tệp'}
                          </span>
                        </span>
                        <button
                          type="button"
                          aria-label="Xem trước"
                          onClick={() => window.open(previewUrl, '_blank', 'noopener,noreferrer')}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label="Xóa tệp"
                          onClick={() => removeFile(file.name)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </form>

          <footer className="ticket-page__footer">
            <span className="ticket-modal__footer-note">
              Bạn sẽ nhận được email xác nhận tức thì kèm mã theo dõi
            </span>
            <div className="ticket-modal__footer-actions">
              <button type="button" className="ticket-btn ticket-btn--ghost" onClick={handleCancel}>
                Hủy
              </button>
              <button
                type="submit"
                className="ticket-btn ticket-btn--primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                <Send size={15} />
                {isSubmitting ? 'Đang gửi...' : 'Gửi Ticket Hỗ trợ'}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </RequesterLayout>
  )
}

export default NewTicketPage
