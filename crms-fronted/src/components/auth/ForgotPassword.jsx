import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPassword } from '../../services/authService'
import toast from 'react-hot-toast'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [resetToken, setResetToken] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email')
      return
    }

    setLoading(true)
    try {
      const response = await forgotPassword(email)
      const token = response.data?.resetToken
      if (token) {
        setResetToken(token)
      }
      setSent(true)
      toast.success('Reset link sent to your email')
    } catch (err) {
      toast.error(err || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  const handleContinueToReset = () => {
    if (resetToken) {
      navigate(`/auth/reset-password/${resetToken}`)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {sent ? (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Check your email</h3>
          <p className="text-slate-600 mb-4">We sent a password reset link to {email}</p>
          {resetToken && (
            <button onClick={handleContinueToReset} className="btn-primary w-full mb-3">
              Continue to Reset Password
            </button>
          )}
          <Link to="/auth/login" className="text-blue-600 hover:underline font-medium">Back to login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="Enter your email"
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <p className="text-center text-sm text-slate-600">
            <Link to="/auth/login" className="text-blue-600 hover:underline font-medium">Back to login</Link>
          </p>
        </form>
      )}
    </div>
  )
}

export default ForgotPassword
