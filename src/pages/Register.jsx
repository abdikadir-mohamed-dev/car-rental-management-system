import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', license_number: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const user = await register(form)
      toast.success(`Welcome to DriveEasy, ${user.name.split(' ')[0]}!`)
      navigate('/catalog')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
      toast.error(message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Book cars, track rentals and manage your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
          )}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Full name</Label>
              <Input required value={form.name} onChange={set('name')} placeholder="Jane Mwangi" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Phone</Label>
                <Input value={form.phone} onChange={set('phone')} placeholder="+2547…" />
              </div>
              <div>
                <Label>Driving licence no.</Label>
                <Input value={form.license_number} onChange={set('license_number')} placeholder="DL-123456" />
              </div>
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" required minLength={6} value={form.password} onChange={set('password')} placeholder="6+ characters" />
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={busy}>
              {busy ? 'Creating account…' : 'Sign up'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Already registered? <Link to="/login" className="font-medium text-emerald-700 hover:underline">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
