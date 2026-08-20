import { Routes, Route } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'

function AuthRoutes() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
    </Routes>
  )
}

export default AuthRoutes
