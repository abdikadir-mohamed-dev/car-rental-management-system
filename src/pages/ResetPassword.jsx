import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'

import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResetPassword() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [token, setToken] = useState(params.get('token') ?? '')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }
    setBusy(true)
    try {
      await resetPassword(token, password)
      toast.success('Password updated — you can now log in')
      navigate('/login')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Reset failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription>Choose a new password for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Reset token</Label>
              <Input required value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste the token from your email" />
            </div>
            <div>
              <Label>New password</Label>
              <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6+ characters" />
            </div>
            <div>
              <Label>Confirm new password</Label>
              <Input type="password" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" />
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={busy}>
              {busy ? 'Updating…' : 'Update password'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            <Link to="/login" className="font-medium text-emerald-700 hover:underline">Back to log in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
