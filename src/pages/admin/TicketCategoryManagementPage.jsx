import { useEffect, useState } from 'react'
import { ArrowLeft, Grid2x2, PlusCircle, Search, SlidersHorizontal, SquarePen, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from './AdminLayout.jsx'
import {
  createTicketCategoryApi,
  getTicketCategoriesApi,
  searchTicketCategoriesApi,
  updateTicketCategoryApi,
} from '../../services/admin/ticketCategoryManagement.service'
import '../../styles/requester/TicketHistoryPage.css'
import '../../styles/requester/NewTicketModal.css'
import '../../styles/admin/AdminCommon.css'

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Thấp' },
  { value: 'MEDIUM', label: 'Trung bình' },
  { value: 'HIGH', label: 'Cao' },
  { value: 'URGENT', label: 'Khẩn cấp' },
]

const PRIORITY_LABEL = PRIORITY_OPTIONS.reduce((acc, item) => {
  acc[item.value] = item.label
  return acc
}, {})

const PRIORITY_TONE = {
  LOW: 'closed',
  MEDIUM: 'progress',
  HIGH: 'high',
  URGENT: 'waiting',
}

const initialForm = { categoryName: '', description: '', defaultPriority: '' }

function TicketCategoryManagementPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchCategories = async () => {
    try {
      const res = await getTicketCategoriesApi()
      setCategories(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được danh sách danh mục')
    }
  }

  useEffect(() => {
    if (!keyword.trim()) {
      fetchCategories()
      return
    }

    const timeoutId = setTimeout(() => {
      searchTicketCategoriesApi(keyword)
        .then((res) => setCategories(res.data.data))
        .catch((err) => setError(err.response?.data?.message || 'Tìm kiếm thất bại'))
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [keyword])

  const openCreateModal = () => {
    setEditingCategoryId(null)
    setForm(initialForm)
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (category) => {
    setEditingCategoryId(category.id)
    setForm({
      categoryName: category.category_name,
      description: category.description,
      defaultPriority: category.defaultPriority,
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleFormChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value })
  }

  const handleSubmitForm = async (event) => {
    event.preventDefault()
    setFormError('')
    setIsSubmitting(true)
    try {
      if (editingCategoryId) {
        await updateTicketCategoryApi(editingCategoryId, form)
      } else {
        await createTicketCategoryApi(form)
      }
      setIsModalOpen(false)
      fetchCategories()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout activeNav="categories">
      <div className="thist-heading">
        <div className="thist-heading__title">
          <button
            type="button"
            className="thist-back-btn"
            onClick={() => navigate('/admin/dashboard')}
            aria-label="Quay lại"
          >
            <ArrowLeft size={18} />
          </button>
          <h1>Danh mục yêu cầu</h1>
        </div>
        <button type="button" className="thist-submit-btn" onClick={openCreateModal}>
          <PlusCircle size={15} />
          Tạo danh mục
        </button>
      </div>

      {error && <p className="ticket-required">{error}</p>}

      <section className="thist-summary admin-summary--1col">
        <div className="thist-summary-card">
          <div>
            <div className="thist-summary-card__value">{categories.length}</div>
            <div className="thist-summary-card__label">TỔNG DANH MỤC</div>
          </div>
          <span className="thist-summary-card__icon thist-summary-card__icon--info">
            <Grid2x2 size={18} />
          </span>
        </div>
      </section>

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm theo tên danh mục..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          {keyword && (
            <button
              type="button"
              className="admin-search__clear"
              onClick={() => setKeyword('')}
              aria-label="Xóa tìm kiếm"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button type="button" className="admin-filter-btn" aria-label="Mở bộ lọc">
          <SlidersHorizontal size={16} />
        </button>
      </div>

      <div className="thist-table-wrap">
        <table className="thist-table admin-table--even admin-table--5col">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên danh mục</th>
              <th>Mô tả</th>
              <th>Mức ưu tiên mặc định</th>
              <th className="thist-table__actions-head">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id}>
                <td className="admin-table__nowrap">{index + 1}</td>
                <td>{category.category_name}</td>
                <td>{category.description}</td>
                <td>
                  <span
                    className={`thist-status-badge thist-status-badge--${
                      PRIORITY_TONE[category.defaultPriority] || 'closed'
                    }`}
                  >
                    <span className="thist-status-badge__dot" />
                    {PRIORITY_LABEL[category.defaultPriority] || category.defaultPriority}
                  </span>
                </td>
                <td className="thist-table__actions">
                  <div className="admin-action-cell">
                    <button
                      type="button"
                      className="admin-action-btn admin-action-btn--neutral"
                      onClick={() => openEditModal(category)}
                    >
                      <SquarePen size={14} />
                      Sửa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="ticket-modal__overlay" onMouseDown={() => setIsModalOpen(false)}>
          <div
            className="ticket-modal"
            role="dialog"
            aria-modal="true"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="ticket-modal__accent" />
            <header className="ticket-modal__header">
              <h2>{editingCategoryId ? 'Cập nhật danh mục' : 'Tạo danh mục mới'}</h2>
              <button
                type="button"
                className="ticket-modal__close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </header>

            <form className="ticket-modal__body" onSubmit={handleSubmitForm}>
              <section className="ticket-section">
                <div className="ticket-section__label">
                  <span>Tên danh mục</span>
                </div>
                <div className="ticket-summary-input">
                  <input
                    type="text"
                    placeholder="Sự cố phần cứng"
                    value={form.categoryName}
                    onChange={handleFormChange('categoryName')}
                  />
                </div>
              </section>

              <section className="ticket-section">
                <div className="ticket-section__label">
                  <span>Mức ưu tiên mặc định</span>
                </div>
                <select
                  className="admin-select"
                  value={form.defaultPriority}
                  onChange={handleFormChange('defaultPriority')}
                >
                  <option value="">-- Chọn mức ưu tiên --</option>
                  {PRIORITY_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </section>

              <section className="ticket-section">
                <div className="ticket-section__label">
                  <span>Mô tả</span>
                </div>
                <div className="ticket-editor">
                  <textarea
                    placeholder="Mô tả ngắn gọn về danh mục này..."
                    value={form.description}
                    onChange={handleFormChange('description')}
                    rows={4}
                  />
                </div>
              </section>

              {formError && <p className="ticket-required">{formError}</p>}

              <footer className="ticket-modal__footer">
                <div className="ticket-modal__footer-actions">
                  <button
                    type="button"
                    className="ticket-btn ticket-btn--ghost"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="ticket-btn ticket-btn--primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                  </button>
                </div>
              </footer>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default TicketCategoryManagementPage
