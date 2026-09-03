import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, User, LogOut, Menu, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutThunk as logout } from '../../redux/slices/authSlice'

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    setDropdownOpen(false)
    setMobileOpen(false)
  }

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Car className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">DriveGo</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Home</Link>
            <Link to="/vehicles" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Browse Cars</Link>
            <Link to="/locations" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Locations</Link>
            
            <Link to="/about" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">About Us</Link>
            <Link to="/contact" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Contact</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-slate-200 text-sm">
                    {user?.name || 'User'}
                  </span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth/login" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium">Login</Link>
                <Link to="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Sign Up</Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-slate-800 pt-4">
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/vehicles" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium" onClick={() => setMobileOpen(false)}>Browse Cars</Link>
              <Link to="/locations" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium" onClick={() => setMobileOpen(false)}>Locations</Link>

              <Link to="/about" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium" onClick={() => setMobileOpen(false)}>About Us</Link>
              <Link to="/contact" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium" onClick={() => setMobileOpen(false)}>Contact</Link>
              <div className="border-t border-slate-800 pt-2 mt-2">
                {user ? (
                  <>
                    <Link to="/customer" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium block" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                    <button onClick={handleLogout} className="text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium w-full text-left">Logout</button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/auth/login" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium" onClick={() => setMobileOpen(false)}>Login</Link>
                    <Link to="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium text-center" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
