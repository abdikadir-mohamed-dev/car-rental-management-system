import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const hasToken = typeof window !== 'undefined' && localStorage.getItem('token')

  if (!hasToken || !isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
