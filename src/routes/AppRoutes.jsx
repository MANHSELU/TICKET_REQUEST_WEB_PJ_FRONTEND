import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'
import VerifyOtpPage from '../pages/auth/VerifyOtpPage.jsx'
import RequesterDashboardPage from '../pages/requester/RequesterDashboardPage.jsx'
import TicketHistoryPage from '../pages/requester/TicketHistoryPage.jsx'
import NewTicketPage from '../pages/requester/NewTicketPage.jsx'
import ProfilePage from '../pages/requester/ProfilePage.jsx'
import UserManagementPage from '../pages/admin/UserManagementPage.jsx'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx'
import ITServiceManagementPage from '../pages/admin/ITServiceManagementPage.jsx'
import ITServiceCategoryManagementPage from '../pages/admin/ITServiceCategoryManagementPage.jsx'
import TicketCategoryManagementPage from '../pages/admin/TicketCategoryManagementPage.jsx'
import SupportTeamManagementPage from '../pages/admin/SupportTeamManagementPage.jsx'
import AdminTicketListPage from '../pages/admin/AdminTicketListPage.jsx'
import SupporterTicketListPage from '../pages/supporter/SupporterTicketListPage.jsx'
import SupporterProfilePage from '../pages/supporter/SupporterProfilePage.jsx'
import SupporterClosedTicketsPage from '../pages/supporter/SupporterClosedTicketsPage.jsx'
import SupporterFeedPage from '../pages/supporter/SupporterFeedPage.jsx'
import SupporterCreatePostPage from '../pages/supporter/SupporterCreatePostPage.jsx'
import SupporterPostHistoryPage from '../pages/supporter/SupporterPostHistoryPage.jsx'
import SupporterRatingsPage from '../pages/supporter/SupporterRatingsPage.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/requester/dashboard" element={<RequesterDashboardPage />} />
      <Route path="/requester/tickets" element={<TicketHistoryPage />} />
      <Route path="/requester/tickets/new" element={<NewTicketPage />} />
      <Route path="/requester/profile" element={<ProfilePage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/users" element={<UserManagementPage />} />
      <Route path="/admin/services" element={<ITServiceManagementPage />} />
      <Route path="/admin/service-categories" element={<ITServiceCategoryManagementPage />} />
      <Route path="/admin/ticket-categories" element={<TicketCategoryManagementPage />} />
      <Route path="/admin/support-teams" element={<SupportTeamManagementPage />} />
      <Route path="/admin/tickets" element={<AdminTicketListPage />} />
      <Route path="/supporter/dashboard" element={<SupporterTicketListPage />} />
      <Route path="/supporter/tickets/closed" element={<SupporterClosedTicketsPage />} />
      <Route path="/supporter/feed" element={<SupporterFeedPage />} />
      <Route path="/supporter/posts/new" element={<SupporterCreatePostPage />} />
      <Route path="/supporter/posts" element={<SupporterPostHistoryPage />} />
      <Route path="/supporter/ratings" element={<SupporterRatingsPage />} />
      <Route path="/supporter/profile" element={<SupporterProfilePage />} />
    </Routes>
  )
}

export default AppRoutes
