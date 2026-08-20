import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Car,
  Calendar,
  CalendarCheck,
  CarFront,
  History,
  CreditCard,
  FileText,
  User,
  Bell,
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const customerLinks = [
  { to: '/customer', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/customer/vehicles', icon: Car, label: 'Browse Vehicles' },
  { to: '/customer/bookings', icon: Calendar, label: 'My Bookings' },
  { to: '/customer/bookings/upcoming', icon: CalendarCheck, label: 'Upcoming Rentals' },
  { to: '/customer/bookings/active', icon: CarFront, label: 'Active Rental' },
  { to: '/customer/booking-history', icon: History, label: 'Booking History' },
  { to: '/customer/payments', icon: CreditCard, label: 'Payments & Receipts' },
  { to: '/customer/agreements', icon: FileText, label: 'Rental Agreements' },
  { to: '/customer/profile', icon: User, label: 'Profile' },
  { to: '/customer/notifications', icon: Bell, label: 'Notifications' },
  { to: '/customer/support', icon: HelpCircle, label: 'Help & Support' },
]

function CustomerSidebar({ isOpen, onClose }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/auth/login')
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
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <div className="flex items-center gap-2">
            <Car className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold">DriveGo</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-sidebar-hover rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-6 py-5">
          <Car className="w-7 h-7 text-primary" />
          <span className="text-xl font-bold">DriveGo</span>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
          {customerLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium ${
                  isActive ? 'bg-sidebar-active text-white' : 'text-slate-300 hover:bg-sidebar-hover hover:text-white'
                }`
              }
              onClick={onClose}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-hover">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-sidebar-hover hover:text-white rounded-lg transition-colors duration-200 text-sm font-medium w-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default CustomerSidebar
