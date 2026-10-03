import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'
import VerifyOtpPage from '../pages/auth/VerifyOtpPage.jsx'
import RequesterDashboardPage from '../pages/requester/RequesterDashboardPage.jsx'
import TicketHistoryPage from '../pages/requester/TicketHistoryPage.jsx'
import ProfilePage from '../pages/requester/ProfilePage.jsx'
import UserManagementPage from '../pages/admin/UserManagementPage.jsx'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx'
import ITServiceManagementPage from '../pages/admin/ITServiceManagementPage.jsx'
import ITServiceCategoryManagementPage from '../pages/admin/ITServiceCategoryManagementPage.jsx'
import TicketCategoryManagementPage from '../pages/admin/TicketCategoryManagementPage.jsx'
import SupportTeamManagementPage from '../pages/admin/SupportTeamManagementPage.jsx'
import AdminTicketListPage from '../pages/admin/AdminTicketListPage.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/requester/dashboard" element={<RequesterDashboardPage />} />
      <Route path="/requester/tickets" element={<TicketHistoryPage />} />
      <Route path="/requester/profile" element={<ProfilePage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/users" element={<UserManagementPage />} />
      <Route path="/admin/services" element={<ITServiceManagementPage />} />
      <Route path="/admin/service-categories" element={<ITServiceCategoryManagementPage />} />
      <Route path="/admin/ticket-categories" element={<TicketCategoryManagementPage />} />
      <Route path="/admin/support-teams" element={<SupportTeamManagementPage />} />
      <Route path="/admin/tickets" element={<AdminTicketListPage />} />
    </Routes>
  )
}

export default AppRoutes
