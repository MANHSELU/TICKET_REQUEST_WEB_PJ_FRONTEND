import { useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle2, ClipboardList, PlusCircle, Search, SlidersHorizontal, SquarePen, XCircle, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from './AdminLayout.jsx'
import {
  createItServiceApi,
  getItServicesApi,
  searchItServicesApi,
  updateItServiceApi,
} from '../../services/admin/itServiceManagement.service'
import { getItServiceCategoriesApi } from '../../services/admin/itServiceCategoryManagement.service'
import '../../styles/requester/TicketHistoryPage.css'
import '../../styles/requester/NewTicketModal.css'
import '../../styles/admin/AdminCommon.css'

const initialForm = { serviceName: '', description: '', isActive: true, itServiceCategoryId: '' }

function ITServiceManagementPage() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [serviceCategories, setServiceCategories] = useState([])
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingServiceId, setEditingServiceId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchServices = async () => {
    try {
      const res = await getItServicesApi()
      setServices(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được danh sách dịch vụ')
    }
  }

  useEffect(() => {
    if (!keyword.trim()) {
      fetchServices()
      return
    }

    const timeoutId = setTimeout(() => {
      searchItServicesApi(keyword)
        .then((res) => setServices(res.data.data))
        .catch((err) => setError(err.response?.data?.message || 'Tìm kiếm thất bại'))
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [keyword])

  useEffect(() => {
    getItServiceCategoriesApi()
      .then((res) => setServiceCategories(res.data.data))
      .catch(() => {})
  }, [])

  const openCreateModal = () => {
    setEditingServiceId(null)
    setForm(initialForm)
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (service) => {
    setEditingServiceId(service.id)
    setForm({
      serviceName: service.service_name,
      description: service.description,
      isActive: service.isActive,
      itServiceCategoryId: service.itServiceCategoryId || '',
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleFormChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value })
  }

  const handleStatusChange = (event) => {
    setForm({ ...form, isActive: event.target.value === 'true' })
  }

  const handleSubmitForm = async (event) => {
    event.preventDefault()
    setFormError('')
    setIsSubmitting(true)
    try {
      if (editingServiceId) {
        await updateItServiceApi(editingServiceId, form)
      } else {
        await createItServiceApi(form)
      }
      setIsModalOpen(false)
      fetchServices()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout activeNav="services">
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
          <h1>Dịch vụ CNTT</h1>
        </div>
        <button type="button" className="thist-submit-btn" onClick={openCreateModal}>
          <PlusCircle size={15} />
          Tạo dịch vụ
        </button>
      </div>

      {error && <p className="ticket-required">{error}</p>}

      <section className="thist-summary admin-summary--3col">
        <div className="thist-summary-card">
          <div>
            <div className="thist-summary-card__value">{services.length}</div>
            <div className="thist-summary-card__label">TỔNG DỊCH VỤ</div>
          </div>
          <span className="thist-summary-card__icon thist-summary-card__icon--info">
            <ClipboardList size={18} />
          </span>
        </div>
        <div className="thist-summary-card">
          <div>
            <div className="thist-summary-card__value">
              {services.filter((service) => service.isActive).length}
            </div>
            <div className="thist-summary-card__label">ĐANG HOẠT ĐỘNG</div>
          </div>
          <span className="thist-summary-card__icon thist-summary-card__icon--success">
            <CheckCircle2 size={18} />
          </span>
        </div>
        <div className="thist-summary-card">
          <div>
            <div className="thist-summary-card__value">
              {services.filter((service) => !service.isActive).length}
            </div>
            <div className="thist-summary-card__label">NGỪNG HOẠT ĐỘNG</div>
          </div>
          <span className="thist-summary-card__icon thist-summary-card__icon--danger">
            <XCircle size={18} />
          </span>
        </div>
      </section>

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm theo tên dịch vụ..."
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
        <table className="thist-table admin-table--even admin-table--6col-stt">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên dịch vụ</th>
              <th>Nhóm dịch vụ</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th className="thist-table__actions-head">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service.id}>
                <td className="admin-table__nowrap">{index + 1}</td>
                <td>{service.service_name}</td>
                <td className="admin-table__nowrap">{service.category?.categoryName || '—'}</td>
                <td>{service.description}</td>
                <td>
                  <span
                    className={`thist-status-badge thist-status-badge--${
                      service.isActive ? 'resolved' : 'closed'
                    }`}
                  >
                    <span className="thist-status-badge__dot" />
                    {service.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  </span>
                </td>
                <td className="thist-table__actions">
                  <div className="admin-action-cell">
                    <button
                      type="button"
                      className="admin-action-btn admin-action-btn--neutral"
                      onClick={() => openEditModal(service)}
                    >
                      <SquarePen size={14} />
                      Cập nhật
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
              <h2>{editingServiceId ? 'Cập nhật dịch vụ' : 'Tạo dịch vụ mới'}</h2>
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
                  <span>Tên dịch vụ</span>
                </div>
                <div className="ticket-summary-input">
                  <input
                    type="text"
                    placeholder="Cấp phát thiết bị"
                    value={form.serviceName}
                    onChange={handleFormChange('serviceName')}
                  />
                </div>
              </section>

              <section className="ticket-section">
                <div className="ticket-section__label">
                  <span>Nhóm dịch vụ</span>
                </div>
                <select
                  className="admin-select"
                  value={form.itServiceCategoryId}
                  onChange={handleFormChange('itServiceCategoryId')}
                >
                  <option value="">-- Chọn nhóm dịch vụ --</option>
                  {serviceCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
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
                    placeholder="Mô tả ngắn gọn về dịch vụ này..."
                    value={form.description}
                    onChange={handleFormChange('description')}
                    rows={4}
                  />
                </div>
              </section>

              {editingServiceId && (
                <section className="ticket-section">
                  <div className="ticket-section__label">
                    <span>Trạng thái</span>
                  </div>
                  <select
                    className="admin-select"
                    value={String(form.isActive)}
                    onChange={handleStatusChange}
                  >
                    <option value="true">Đang hoạt động</option>
                    <option value="false">Ngừng hoạt động</option>
                  </select>
                </section>
              )}

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

export default ITServiceManagementPage
