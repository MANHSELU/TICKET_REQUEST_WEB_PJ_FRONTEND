import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'
import VerifyOtpPage from '../pages/auth/VerifyOtpPage.jsx'
import RequesterDashboardPage from '../pages/requester/RequesterDashboardPage.jsx'
import TicketHistoryPage from '../pages/requester/TicketHistoryPage.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/requester/dashboard" element={<RequesterDashboardPage />} />
      <Route path="/requester/tickets" element={<TicketHistoryPage />} />
    </Routes>
  )
}

export default AppRoutes
