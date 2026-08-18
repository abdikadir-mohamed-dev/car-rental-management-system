import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { Bell, Car, LogOut, Menu, UserRound, X } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const linkCls = ({ isActive }) =>
  cn(
    'text-sm font-medium transition-colors hover:text-emerald-600',
    isActive ? 'text-emerald-600' : 'text-slate-600',
  )

function NotificationBell() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    api('/api/bookings/notifications')
      .then((d) => setItems(d.notifications))
      .catch(() => {})
  }, [open])

  const unread = items.filter((n) => !n.read).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <p className="text-sm font-semibold">Notifications</p>
          <button
            className="text-xs text-emerald-600 hover:underline"
            onClick={() => {
              api('/api/bookings/notifications/read', { method: 'POST' }).then(() =>
                setItems((prev) => prev.map((n) => ({ ...n, read: true }))),
              )
            }}
          >
            Mark all read
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {items.length === 0 && <p className="p-4 text-sm text-slate-500">No notifications yet.</p>}
          {items.map((n) => (
            <div key={n.id} className={cn('border-b px-4 py-3 text-sm last:border-0', !n.read && 'bg-emerald-50/60')}>
              <p className="text-slate-700">{n.message}</p>
              <p className="mt-1 text-xs text-slate-400">{new Date(n.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = (
    <>
      <NavLink to="/catalog" className={linkCls} onClick={() => setMobileOpen(false)}>Browse Cars</NavLink>
      {user?.role === 'customer' && (
        <NavLink to="/bookings" className={linkCls} onClick={() => setMobileOpen(false)}>My Bookings</NavLink>
      )}
      {(user?.role === 'staff' || user?.role === 'admin') && (
        <NavLink to="/staff" className={linkCls} onClick={() => setMobileOpen(false)}>Staff Desk</NavLink>
      )}
      {user?.role === 'admin' && (
        <NavLink to="/admin" className={linkCls} onClick={() => setMobileOpen(false)}>Admin</NavLink>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Car className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">DriveEasy</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">{nav}</nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <UserRound className="h-4 w-4" />
                    </span>
                    <span className="max-w-[120px] truncate text-sm">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="capitalize">{user.role} account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === 'customer' && (
                    <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => {
                      logout()
                      toast.success('Logged out')
                      navigate('/')
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('/register')}>
                Sign up
              </Button>
            </>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen((o) => !o)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">{nav}</nav>
          <div className="mt-4 flex gap-2">
            {user ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  logout()
                  setMobileOpen(false)
                  navigate('/')
                }}
              >
                Log out ({user.name})
              </Button>
            ) : (
              <>
                <Button variant="outline" className="w-full" onClick={() => { setMobileOpen(false); navigate('/login') }}>Log in</Button>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => { setMobileOpen(false); navigate('/register') }}>Sign up</Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
