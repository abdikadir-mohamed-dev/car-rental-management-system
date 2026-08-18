import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await requestPasswordReset(email)
      setSent(true)
      // MVP note: since there's no email provider configured, the backend
      // returns the reset link/token directly so it can be tested end to end.
      if (res?.reset_token) {
        navigate(`/reset-password?token=${res.reset_token}`)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not process that request')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Forgot password</CardTitle>
          <CardDescription>We'll send a reset link to your email.</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
              If an account exists for that email, a password reset link is on its way.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={busy}>
                {busy ? 'Sending…' : 'Send reset link'}
              </Button>
            </form>
          )}
          <p className="mt-4 text-center text-sm text-slate-500">
            Remembered it? <Link to="/login" className="font-medium text-emerald-700 hover:underline">Back to log in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
