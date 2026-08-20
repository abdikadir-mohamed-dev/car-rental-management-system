import { useMemo, useState } from 'react'
import {
  BadgeCheck,
  Bell,
  Camera,
  CarFront,
  CheckCircle,
  ChevronDown,
  ClipboardList,
  Edit3,
  LayoutGrid,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Star,
  UserRound,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'

const navItems = [
  { label: 'Dashboard', icon: LayoutGrid },
  { label: 'Assignments', icon: ClipboardList },
  { label: 'Bookings', icon: CarFront },
  { label: 'Customers', icon: Users },
  { label: 'Earnings', icon: Wallet },
  { label: 'Profile', icon: UserRound },
]

const initialProfile = {
  name: 'James Kariuki',
  email: 'james.kariuki@drivego.co',
  phone: '+254 712 345 678',
  licenseNumber: 'DL-204859',
  vehicleType: 'Toyota RAV4',
  location: 'Nairobi, Kenya',
  status: 'Available',
  emergencyContact: 'Mary Kariuki • +254 734 112 233',
}

const statusStyles = {
  Available: 'bg-emerald-100 text-emerald-800',
  Busy: 'bg-amber-100 text-amber-800',
  Offline: 'bg-slate-200 text-slate-700',
}

function DriverProfilePage() {
  const [profile, setProfile] = useState(initialProfile)
  const [formData, setFormData] = useState(initialProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Profile')

  const initials = useMemo(
    () =>
      profile.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join(''),
    [profile.name],
  )

  const startEditing = () => {
    setFormData(profile)
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setProfile(formData)
    setIsEditing(false)
    toast.success('Profile updated successfully')
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col bg-[#0F172A] text-slate-200 lg:flex">
          <div className="flex items-center gap-3 border-b border-slate-700/80 px-5 py-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <CarFront className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">DriveGo</p>
              <p className="text-xs text-slate-400">Driver Portal</p>
            </div>
          </div>

          <nav className="mt-4 flex-1 space-y-1 px-3">
            {navItems.map(({ label, icon: Icon }) => {
              const isActive = activeNav === label

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveNav(label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              )
            })}
          </nav>

          <div className="border-t border-slate-700/80 p-3">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open navigation"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Profile</p>
                  <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Driver Account</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-600 text-sm font-bold text-white">
                    {initials}
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold text-slate-800">James Kariuki</p>
                    <p className="text-[11px] text-slate-400">Driver</p>
                  </div>
                  <ChevronDown className="mr-1 h-4 w-4 text-slate-500" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">Driver account</p>
                  <h2 className="text-3xl font-bold text-slate-900">My Profile</h2>
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={startEditing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.1fr,2fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 text-2xl font-bold text-white shadow-md">
                        {initials}
                      </div>
                      <button
                        type="button"
                        className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-700 shadow-sm"
                        aria-label="Upload photo"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-2xl font-bold text-slate-900">{profile.name}</h3>
                      <div className="mt-2 flex items-center justify-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[profile.status] || 'bg-slate-100 text-slate-700'}`}
                        >
                          {profile.status}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {profile.rating || '4.9'} rating
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                      <span className="text-sm text-slate-500">Trips completed</span>
                      <span className="text-lg font-bold text-slate-900">{profile.tripsCompleted || 184}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                      <span className="text-sm text-slate-500">License</span>
                      <span className="text-sm font-semibold text-slate-800">{profile.licenseNumber}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                      <span className="text-sm text-slate-500">Assigned vehicle</span>
                      <span className="text-sm font-semibold text-slate-800">{profile.vehicleType}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">Edit driver details</h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
                          <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none ring-0 transition focus:border-emerald-500 focus:bg-white" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
                          <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none ring-0 transition focus:border-emerald-500 focus:bg-white" name="phone" value={formData.phone} onChange={handleChange} required />
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                          <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none ring-0 transition focus:border-emerald-500 focus:bg-white" type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">License number</label>
                          <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none ring-0 transition focus:border-emerald-500 focus:bg-white" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">Vehicle type</label>
                          <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none ring-0 transition focus:border-emerald-500 focus:bg-white" name="vehicleType" value={formData.vehicleType} onChange={handleChange} required />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">Current location</label>
                          <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none ring-0 transition focus:border-emerald-500 focus:bg-white" name="location" value={formData.location} onChange={handleChange} required />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">Availability status</label>
                          <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none ring-0 transition focus:border-emerald-500 focus:bg-white" name="status" value={formData.status} onChange={handleChange}>
                            <option>Available</option>
                            <option>Busy</option>
                            <option>Offline</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">Emergency contact</label>
                          <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none ring-0 transition focus:border-emerald-500 focus:bg-white" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} required />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button type="button" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" onClick={cancelEditing}>
                          Cancel
                        </button>
                        <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">Driver information</h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 p-4">
                          <p className="mb-1 flex items-center gap-2 text-sm text-slate-500">
                            <UserRound className="h-4 w-4" />
                            Full name
                          </p>
                          <p className="text-base font-semibold text-slate-900">{profile.name}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 p-4">
                          <p className="mb-1 flex items-center gap-2 text-sm text-slate-500">
                            <Phone className="h-4 w-4" />
                            Phone
                          </p>
                          <p className="text-base font-semibold text-slate-900">{profile.phone}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 p-4 md:col-span-2">
                          <p className="mb-1 flex items-center gap-2 text-sm text-slate-500">
                            <Mail className="h-4 w-4" />
                            Email
                          </p>
                          <p className="text-base font-semibold text-slate-900">{profile.email}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 p-4">
                          <p className="mb-1 flex items-center gap-2 text-sm text-slate-500">
                            <BadgeCheck className="h-4 w-4" />
                            License number
                          </p>
                          <p className="text-base font-semibold text-slate-900">{profile.licenseNumber}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 p-4">
                          <p className="mb-1 flex items-center gap-2 text-sm text-slate-500">
                            <CarFront className="h-4 w-4" />
                            Vehicle type
                          </p>
                          <p className="text-base font-semibold text-slate-900">{profile.vehicleType}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 p-4 md:col-span-2">
                          <p className="mb-1 flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="h-4 w-4" />
                            Location
                          </p>
                          <p className="text-base font-semibold text-slate-900">{profile.location}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 p-4 md:col-span-2">
                          <p className="mb-1 flex items-center gap-2 text-sm text-slate-500">
                            <ShieldCheck className="h-4 w-4" />
                            Emergency contact
                          </p>
                          <p className="text-base font-semibold text-slate-900">{profile.emergencyContact}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <div className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setSidebarOpen(false)} />
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-[#0F172A] text-slate-200 transition-transform duration-200 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-slate-700/80 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <CarFront className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-white">DriveGo</span>
          </div>
          <button type="button" className="rounded-lg p-2 text-slate-300 hover:bg-slate-800" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-4 space-y-1 px-3">
          {navItems.map(({ label, icon: Icon }) => {
            const isActive = activeNav === label

            return (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setActiveNav(label)
                  setSidebarOpen(false)
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  isActive ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            )
          })}
        </nav>
      </aside>
    </div>
  )
}

export default DriverProfilePage
``