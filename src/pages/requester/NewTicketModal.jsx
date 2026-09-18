import { useRef, useState } from 'react'
import {
  Bold,
  Code,
  Eye,
  Image,
  ImagePlus,
  Italic,
  KeyRound,
  Link2,
  List,
  ListOrdered,
  Monitor,
  PenSquare,
  Quote,
  Send,
  Trash2,
  Underline,
  Wrench,
  X,
} from 'lucide-react'
import '../../styles/requester/NewTicketModal.css'

const REQUEST_TYPES = [
  {
    id: 'issue',
    icon: Wrench,
    title: 'Sự cố / Trục trặc kỹ thuật',
    description: 'Lỗi phần cứng, phần mềm gặp trục trặc,...',
  },
  {
    id: 'hardware',
    icon: Monitor,
    title: 'Cấp phát Thiết bị',
    description: 'Màn hình, dock, thiết bị ngoại vi, laptop',
  },
  {
    id: 'software',
    icon: PenSquare,
    title: 'Phần mềm & Bản quyền',
    description: 'Cài đặt ứng dụng, gia hạn license, công cụ',
  },
  {
    id: 'access',
    icon: KeyRound,
    title: 'Truy cập & Quyền hạn',
    description: 'Phân quyền, đặt lại 2FA, thư mục...',
  },
]

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

function NewTicketModal({ open, onClose }) {
  const [selectedType, setSelectedType] = useState('issue')
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null)

  if (!open) return null

  const handleFilesSelected = (fileList) => {
    const picked = Array.from(fileList).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }))
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

  const handleSubmit = (event) => {
    event.preventDefault()
    onClose()
  }

  return (
    <div className="ticket-modal__overlay" onMouseDown={onClose}>
      <div
        className="ticket-modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="ticket-modal__accent" />
        <header className="ticket-modal__header">
          <h2>Gửi yêu cầu hỗ trợ mới</h2>
          <button type="button" className="ticket-modal__close" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </header>

        <form className="ticket-modal__body" onSubmit={handleSubmit}>
          <section className="ticket-section">
            <div className="ticket-section__label">
              <span>1. Chọn loại yêu cầu phù hợp nhất</span>
              <span className="ticket-required">Bắt buộc</span>
            </div>
            <div className="ticket-type-grid">
              {REQUEST_TYPES.map((type) => (
                <button
                  type="button"
                  key={type.id}
                  className={
                    type.id === selectedType
                      ? 'ticket-type-card ticket-type-card--active'
                      : 'ticket-type-card'
                  }
                  onClick={() => setSelectedType(type.id)}
                >
                  <span className="ticket-type-card__icon">
                    <type.icon size={18} />
                  </span>
                  <span>
                    <span className="ticket-type-card__title">{type.title}</span>
                    <span className="ticket-type-card__desc">{type.description}</span>
                  </span>
                </button>
              ))}
            </div>
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
                rows={7}
              />
            </div>
          </section>

          <section className="ticket-section">
            <div className="ticket-section__label">
              <span>4. Tệp đính kèm &amp; Minh chứng hệ thống</span>
              <span className="ticket-hint">Tối đa 25 MB</span>
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
                Kéo &amp; thả ảnh chụp màn hình, log, hoặc báo cáo hệ thống vào đây
                <br />
                hoặc{' '}
                <button type="button" onClick={() => fileInputRef.current?.click()}>
                  chọn tệp
                </button>{' '}
                từ máy tính (hỗ trợ PNG, JPG, PDF tối đa 25MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
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
                {files.map((file) => (
                  <div className="ticket-file" key={file.name}>
                    <span className="ticket-file__icon">
                      <Image size={16} />
                    </span>
                    <span className="ticket-file__info">
                      <span className="ticket-file__name">{file.name}</span>
                      <span className="ticket-file__meta">
                        {formatFileSize(file.size)} · {file.type || 'Tệp'}
                      </span>
                    </span>
                    <button type="button" aria-label="Xem trước">
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
                ))}
              </div>
            )}
          </section>
        </form>

        <footer className="ticket-modal__footer">
          <span className="ticket-modal__footer-note">
            Bạn sẽ nhận được email xác nhận tức thì kèm mã theo dõi
          </span>
          <div className="ticket-modal__footer-actions">
            <button type="button" className="ticket-btn ticket-btn--ghost" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="ticket-btn ticket-btn--primary" onClick={handleSubmit}>
              <Send size={15} />
              Gửi Ticket Hỗ trợ
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default NewTicketModal
