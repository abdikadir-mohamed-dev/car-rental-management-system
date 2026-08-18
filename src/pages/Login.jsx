import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { useAuth, homeRouteFor } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const DEMO = [
  { role: 'Customer', email: 'customer@driveeasy.com', password: 'customer123' },
  { role: 'Staff', email: 'staff@driveeasy.com', password: 'staff123' },
  { role: 'Admin', email: 'admin@driveeasy.com', password: 'admin123' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const user = await login(email, password)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      const from = location.state?.from
      navigate(from || homeRouteFor(user))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      toast.error(message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Log in</CardTitle>
          <CardDescription>Access your bookings and rental tools.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
          )}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                <Link to="/forgot-password" className="text-xs font-medium text-emerald-700 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={busy}>
              {busy ? 'Logging in…' : 'Log in'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            No account? <Link to="/register" className="font-medium text-emerald-700 hover:underline">Sign up</Link>
          </p>
          <p className="mt-1 text-center text-xs text-slate-400">
            Staff and driver accounts are created by an admin — use your temporary
            password, then change it from your profile.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-4 border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Demo accounts (click to fill)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {DEMO.map((d) => (
            <button
              key={d.role}
              type="button"
              className="rounded-full border px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-emerald-400 hover:text-emerald-700"
              onClick={() => { setEmail(d.email); setPassword(d.password) }}
            >
              {d.role}
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
