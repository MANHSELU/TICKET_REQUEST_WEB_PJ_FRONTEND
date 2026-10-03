import { useEffect, useState } from 'react'
import { ArrowLeft, PlusCircle, Search, SlidersHorizontal, SquarePen, Users, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from './AdminLayout.jsx'
import {
  createSupportTeamApi,
  getSupportTeamsApi,
  searchSupportTeamsApi,
  updateSupportTeamApi,
} from '../../services/admin/supportTeamManagement.service'
import '../../styles/requester/TicketHistoryPage.css'
import '../../styles/requester/NewTicketModal.css'
import '../../styles/admin/AdminCommon.css'

const initialForm = { teamCode: '', teamName: '', description: '' }

function SupportTeamManagementPage() {
  const navigate = useNavigate()
  const [teams, setTeams] = useState([])
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTeamId, setEditingTeamId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchTeams = async () => {
    try {
      const res = await getSupportTeamsApi()
      setTeams(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được danh sách đội hỗ trợ')
    }
  }

  useEffect(() => {
    if (!keyword.trim()) {
      fetchTeams()
      return
    }

    const timeoutId = setTimeout(() => {
      searchSupportTeamsApi(keyword)
        .then((res) => setTeams(res.data.data))
        .catch((err) => setError(err.response?.data?.message || 'Tìm kiếm thất bại'))
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [keyword])

  const openCreateModal = () => {
    setEditingTeamId(null)
    setForm(initialForm)
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (team) => {
    setEditingTeamId(team.id)
    setForm({
      teamCode: team.teamCode,
      teamName: team.teamName,
      description: team.description || '',
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
      if (editingTeamId) {
        await updateSupportTeamApi(editingTeamId, form)
      } else {
        await createSupportTeamApi(form)
      }
      setIsModalOpen(false)
      fetchTeams()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout activeNav="teams">
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
          <h1>Đội hỗ trợ</h1>
        </div>
        <button type="button" className="thist-submit-btn" onClick={openCreateModal}>
          <PlusCircle size={15} />
          Tạo đội hỗ trợ
        </button>
      </div>

      {error && <p className="ticket-required">{error}</p>}

      <section className="thist-summary admin-summary--1col">
        <div className="thist-summary-card">
          <div>
            <div className="thist-summary-card__value">{teams.length}</div>
            <div className="thist-summary-card__label">TỔNG ĐỘI HỖ TRỢ</div>
          </div>
          <span className="thist-summary-card__icon thist-summary-card__icon--info">
            <Users size={18} />
          </span>
        </div>
      </section>

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm theo mã hoặc tên đội..."
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
        <table className="thist-table admin-table--even admin-table--4col">
          <thead>
            <tr>
              <th>Mã đội</th>
              <th>Tên đội</th>
              <th>Mô tả</th>
              <th className="thist-table__actions-head">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id}>
                <td className="admin-table__nowrap">{team.teamCode}</td>
                <td>{team.teamName}</td>
                <td>{team.description}</td>
                <td className="thist-table__actions">
                  <div className="admin-action-cell">
                    <button
                      type="button"
                      className="admin-action-btn admin-action-btn--neutral"
                      onClick={() => openEditModal(team)}
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
              <h2>{editingTeamId ? 'Cập nhật đội hỗ trợ' : 'Tạo đội hỗ trợ mới'}</h2>
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
              <div className="admin-form-row">
                <section className="ticket-section">
                  <div className="ticket-section__label">
                    <span>Mã đội</span>
                  </div>
                  <div className="ticket-summary-input">
                    <input
                      type="text"
                      placeholder="TEAM-HW"
                      value={form.teamCode}
                      onChange={handleFormChange('teamCode')}
                    />
                  </div>
                </section>

                <section className="ticket-section">
                  <div className="ticket-section__label">
                    <span>Tên đội</span>
                  </div>
                  <div className="ticket-summary-input">
                    <input
                      type="text"
                      placeholder="Đội phần cứng"
                      value={form.teamName}
                      onChange={handleFormChange('teamName')}
                    />
                  </div>
                </section>
              </div>

              <section className="ticket-section">
                <div className="ticket-section__label">
                  <span>Mô tả</span>
                </div>
                <div className="ticket-editor">
                  <textarea
                    placeholder="Mô tả ngắn gọn về đội hỗ trợ này..."
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

export default SupportTeamManagementPage
