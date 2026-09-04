import { NavLink } from 'react-router-dom'
import { X, Car } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutThunk as logout } from '../../redux/slices/authSlice'
import { getUnreadCount } from '../../services/notificationService'
import { useEffect, useState } from 'react'

const adminLinks = [
  { to: '/admin', icon: 'LayoutDashboard', label: 'Dashboard', end: true },
  { to: '/admin/users', icon: 'Users', label: 'Users' },
  { to: '/admin/vehicles', icon: 'Car', label: 'Vehicles' },
  { to: '/admin/bookings', icon: 'Calendar', label: 'Bookings' },
  { to: '/admin/policies', icon: 'FileText', label: 'Rental Policies' },
  { to: '/admin/payments', icon: 'DollarSign', label: 'Payments' },
  { to: '/admin/reports', icon: 'BarChart3', label: 'Reports' },
  { to: '/admin/notifications', icon: 'Bell', label: 'Notifications' },
  { to: '/admin/settings', icon: 'Settings', label: 'Settings' },
  { to: '/admin/profile', icon: 'User', label: 'Profile' },
]

const staffLinks = [
  { to: '/staff', icon: 'LayoutDashboard', label: 'Dashboard', end: true },
  { to: '/staff/bookings', icon: 'Calendar', label: 'Bookings' },
  { to: '/staff/checkout', icon: 'LogOut', label: 'Check-out' },
  { to: '/staff/checkin', icon: 'LogIn', label: 'Check-in' },
  { to: '/staff/vehicles', icon: 'Car', label: 'Vehicles' },
  { to: '/staff/driver-assignments', icon: 'UserCheck', label: 'Driver Assignments' },
  { to: '/staff/customers', icon: 'Users', label: 'Customers' },
  { to: '/staff/reports', icon: 'BarChart3', label: 'Reports' },
  { to: '/staff/notifications', icon: 'Bell', label: 'Notifications' },
  { to: '/staff/profile', icon: 'User', label: 'Profile' },
]

const driverLinks = [
  { to: '/driver', icon: 'LayoutDashboard', label: 'Dashboard', end: true },
  { to: '/driver/assignments', icon: 'ClipboardList', label: 'My Assignments' },
  { to: '/driver/bookings', icon: 'Calendar', label: 'Bookings' },
  { to: '/driver/checkout', icon: 'LogOut', label: 'Check-out' },
  { to: '/driver/checkin', icon: 'LogIn', label: 'Check-in' },
  { to: '/driver/vehicles', icon: 'Car', label: 'Vehicles' },
  { to: '/driver/customers', icon: 'Users', label: 'Customers' },
  { to: '/driver/reports', icon: 'BarChart3', label: 'Reports' },
  { to: '/driver/earnings', icon: 'DollarSign', label: 'Earnings' },
  { to: '/driver/notifications', icon: 'Bell', label: 'Notifications' },
  { to: '/driver/profile', icon: 'User', label: 'Profile' },
]

function Sidebar({ isOpen, onClose, role }) {
  const links = role === 'admin' ? adminLinks : role === 'staff' ? staffLinks : driverLinks
  const dispatch = useDispatch()
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
  }

  const getIcon = (iconName) => {
    const icons = {
      LayoutDashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
      Car: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8m-4 4v3m-4-3h8a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>,
      Calendar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 014 4 4 4 0 01-1 7.746M15 21H3m14 0a4 4 0 01-4 4H7a4 4 0 01-4-4m14-4a4 4 0 00-4-4H7a4 4 0 00-4 4" /></svg>,
      User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
      UserCheck: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
      DollarSign: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      BarChart3: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
      Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      Bell: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
      LogOut: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
      LogIn: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5-4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
      ClipboardList: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
      FileText: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    }
    return icons[iconName] ? icons[iconName]() : null
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar text-white transform transition-transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <NavLink to="/" className="flex items-center gap-2" onClick={onClose}>
            <Car className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold">DriveGo</span>
          </NavLink>
          <button onClick={onClose} className="p-2 hover:bg-sidebar-hover rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="hidden lg:flex items-center gap-2 px-6 py-4">
          <NavLink to="/" className="flex items-center gap-2">
            <Car className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold">DriveGo</span>
          </NavLink>
        </div>
        
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={onClose}
            >
              <span className="relative">
                {getIcon(link.icon)}
                {link.icon === 'Bell' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </span>
              {link.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-hover">
          <NavLink
            to="/auth/login"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
            onClick={() => {
              handleLogout()
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </NavLink>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
