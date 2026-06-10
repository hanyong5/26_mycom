import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ role } = {}) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">로딩 중...</div>
  if (!user) return <Navigate to="/auth/login" state={{ from: location }} replace />
  if (role && profile?.role !== role) return <Navigate to="/" replace />
  return <Outlet />
}
