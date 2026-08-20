import { Bell, Search, Menu } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

function Header({ onMenuClick }) {
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isStaff = location.pathname.startsWith('/staff')
  const isDriver = location.pathname.startsWith('/driver')

  const getRole = () => {
    if (user?.role) return user.role
    if (isAdmin) return 'Admin'
    if (isStaff) return 'Staff'
    if (isDriver) return 'Driver'
    return 'User'
  }

  const getName = () => {
    if (user?.name) return user.name
    if (isAdmin) return 'Admin User'
    if (isStaff) return 'Staff User'
    if (isDriver) return 'Driver User'
    return 'User'
  }

  const getInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase()
    if (isAdmin) return 'A'
    if (isStaff) return 'S'
    if (isDriver) return 'D'
    return 'U'
  }

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 lg:hidden"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
        )}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 bg-slate-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all w-64"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-slate-100">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">{getInitial()}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900">{getName()}</p>
            <p className="text-xs text-slate-500 capitalize">{getRole()}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
