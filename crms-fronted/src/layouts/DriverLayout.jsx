import {
  useEffect,
  useState,
} from 'react'


import {
  Outlet,
  NavLink,
  useNavigate,
} from 'react-router-dom'

import { toast } from 'react-hot-toast'

import {
  LayoutGrid,
  ClipboardList,
  Route,
  Calendar,
  Bell,
  User,
  LogOut,
  ShipWheel,
  Loader2,
} from 'lucide-react'

import {
  getProfile,
  logout,
} from '../services/authService'

const navItems = [
  {
    label: 'Dashboard',
    to: '/driver/dashboard',
    icon: LayoutGrid,
  },
  {
    label: 'My Assignments',
    to: '/driver/assignments',
    icon: ClipboardList,
  },
  {
    label: 'Trips',
    to: '/driver/trips',
    icon: Route,
  },
  
  {
    label: 'Bookings',
    to: '/driver/bookings',
    icon: Calendar,
  },
  
  
  
  
  {
    label: 'Notifications',
    to: '/driver/notifications',
    icon: Bell,
  },
  {
    label: 'Profile',
    to: '/driver/profile',
    icon: User,
  },
]

export default function DriverLayout() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)

  const loadUser = async () => {
    try {
      const response = await getProfile()

      const currentUser = response.data.user

      setUser(currentUser)

      localStorage.setItem(
        'user',
        JSON.stringify(currentUser)
      )
    } catch (error) {
      console.error(
        'Failed to load current driver:',
        error
      )

      const storedUser =
        localStorage.getItem('user')

      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } finally {
      setLoadingUser(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      toast.success('Logged out successfully')
      navigate('/auth/login')
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">

      <aside className="fixed top-0 left-0 z-50 h-full w-64 bg-sidebar text-white flex flex-col">

        {/* Logo */}

        <div className="flex items-center gap-2 px-6 py-4">
          <NavLink
            to="/"
            className="flex items-center gap-2"
          >
            <ShipWheel className="w-7 h-7 text-primary" />

            <span className="text-xl font-bold text-white">
              DriveGo
            </span>
          </NavLink>
        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">

          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-active text-white'
                    : 'text-slate-300 hover:bg-sidebar-hover hover:text-white'
                }`
              }
            >
              <item.icon size={18} />

              {item.label}
            </NavLink>
          ))}

        </nav>

        {/* Logged-in driver */}

        <div className="border-t border-sidebar-hover p-4">

          {loadingUser ? (
            <div className="flex items-center gap-3 px-2 py-2">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />

              <span className="text-sm text-slate-400">
                Loading...
              </span>
            </div>
          ) : (
            <NavLink
              to="/driver/profile"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-hover transition-colors"
            >

              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">

                {user?.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}

              </div>

              <div className="min-w-0">

                <p className="text-sm font-semibold text-white truncate">
                  {user?.name || 'Driver'}
                </p>

                <p className="text-xs text-slate-400 capitalize">
                  {user?.role || 'driver'}
                </p>

              </div>

            </NavLink>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 mt-2 text-slate-300 hover:bg-sidebar-hover hover:text-white rounded-lg transition-colors text-sm font-medium w-full"
          >
            <LogOut size={18} />

            Logout
          </button>

        </div>

      </aside>

      <div className="flex-1 lg:ml-64 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </div>

    </div>
  )
}