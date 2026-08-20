import { useState } from 'react'
import { forgotPassword } from '../../services/authService'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { validateEmail } from '../../utils/validation'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email')
      return
    }

    setLoading(true)
    forgotPassword(email)
      .then(() => {
        setSent(true)
        toast.success('Reset link sent to your email')
      })
      .catch(() => {
        toast.error('Failed to send reset link')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="card">
      {sent ? (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h3>
          <p className="text-gray-600 mb-4">We sent a password reset link to {email}</p>
          <Link to="/auth/login" className="text-blue-600 hover:underline">Back to login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
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
          <p className="text-center text-sm">
            <Link to="/auth/login" className="text-blue-600 hover:underline">Back to login</Link>
          </p>
        </form>
      )}
    </div>
  )
}

export default ForgotPassword
