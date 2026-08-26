import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login as loginUser } from '../../redux/slices/authSlice'
import { setAuthToken } from '../../services/authService'
import toast from 'react-hot-toast'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const result = await dispatch(loginUser({ email: formData.email, password: formData.password })).unwrap()
      if (result.token) {
        setAuthToken(result.token)
        toast.success('Login successful!')
        if (result.user?.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/customer')
        }
      }
    } catch (err) {
      toast.error(err || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`input ${errors.email ? 'border-red-500' : ''}`}
          placeholder="customer@drivego.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`input ${errors.password ? 'border-red-500' : ''}`}
          placeholder="password123"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      <p className="text-center text-sm text-slate-600">
        <Link to="/auth/forgot-password" className="text-blue-600 hover:underline">Forgot password?</Link>
      </p>
      <p className="text-center text-sm text-slate-600">
        Don't have an account? <Link to="/auth/register" className="text-blue-600 hover:underline font-medium">Create Account</Link>
      </p>
      <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500">
        <p className="font-medium mb-1">Demo credentials:</p>
        <p>Customer: customer@drivego.com / password123</p>
        <p>Admin: admin@drivego.com / admin123</p>
      </div>
    </form>
  )
}

export default Login
