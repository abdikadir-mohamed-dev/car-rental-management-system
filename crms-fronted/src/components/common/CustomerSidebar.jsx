import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutThunk as logout } from '../../redux/slices/authSlice'
import { getUnreadCount } from '../../services/notificationService'
import { LayoutDashboard, Car, Calendar, Heart, CreditCard, Bell, User, Settings, HelpCircle, FileText, LogOut, Menu, X } from 'lucide-react'

const navItems = [
  { to: '/customer', icon: 'LayoutDashboard', label: 'Dashboard', end: true },
  { to: '/customer/browse', icon: 'Car', label: 'Browse Cars' },
  { to: '/customer/my-bookings', icon: 'Calendar', label: 'My Bookings' },
  { to: '/customer/saved-cars', icon: 'Heart', label: 'Saved Cars' },
  { to: '/customer/payments', icon: 'CreditCard', label: 'Payments' },
  { to: '/customer/notifications', icon: 'Bell', label: 'Notifications' },
  { to: '/customer/policies', icon: 'FileText', label: 'Rental Policies' },
  { to: '/customer/profile', icon: 'User', label: 'Profile' },
  { to: '/customer/settings', icon: 'Settings', label: 'Settings' },
]

const iconMap = {
  LayoutDashboard,
  Car,
  Calendar,
  Heart,
  CreditCard,
  Bell,
  FileText,
  User,
  Settings,
}

function CustomerSidebar({ isOpen, onClose }) {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const data = await getUnreadCount()
        setUnreadCount(data.count || 0)
      } catch {
        // ignore
      }
    }
    if (user?.id) {
      fetchUnread()
    }
  }, [user?.id])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/auth/login')
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white transform transition-transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <Link to="/" onClick={onClose} className="text-xl font-bold">DriveGo</Link>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Car className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">DriveGo</span>
          </Link>
        </div>

        <nav className="px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon]
            const isActive = item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="relative">
                  <Icon className="w-5 h-5" />
                  {item.icon === 'Bell' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <Link
            to="/customer/help"
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors text-sm font-medium"
          >
            <HelpCircle className="w-5 h-5" />
            Help & Support
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors text-sm font-medium w-full mt-1">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default CustomerSidebar
