import { Navigate, useLocation } from 'react-router'

import { useAuth } from '@/lib/auth'

/**
 * Wraps a page and only renders it for an authenticated user whose role is
 * allowed. Frontend gating is a UX nicety only — the Flask backend must
 * independently verify the role on every protected API call.
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">Loading…</div>
    )
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Access restricted</h1>
        <p className="mt-2 text-sm text-slate-500">Your account role does not have access to this page.</p>
      </div>
    )
  }
  return <>{children}</>
}
