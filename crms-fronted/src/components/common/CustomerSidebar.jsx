import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'
import { LayoutDashboard, Car, Calendar, Heart, CreditCard, Bell, User, Settings, HelpCircle, LogOut, Menu, X } from 'lucide-react'

const navItems = [
  { to: '/customer', icon: 'LayoutDashboard', label: 'Dashboard', end: true },
  { to: '/customer/browse', icon: 'Car', label: 'Browse Cars' },
  { to: '/customer/my-bookings', icon: 'Calendar', label: 'My Bookings' },
  { to: '/customer/saved-cars', icon: 'Heart', label: 'Saved Cars' },
  { to: '/customer/payments', icon: 'CreditCard', label: 'Payments' },
  { to: '/customer/notifications', icon: 'Bell', label: 'Notifications' },
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
  User,
  Settings,
}

function CustomerSidebar({ isOpen, onClose }) {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
                <Icon className="w-5 h-5" />
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
