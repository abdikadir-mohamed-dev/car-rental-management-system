import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../redux/slices/authSlice'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const { loading, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    dispatch(login(formData))
      .unwrap()
      .then(() => {
        toast.success('Login successful!')
        navigate('/customer')
      })
      .catch((err) => {
        toast.error(err)
      })
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div>
        <label className="label">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`input ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="label">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`input ${errors.password ? 'border-red-500' : ''}`}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      <p className="text-center text-sm text-gray-600">
        Don't have an account? <Link to="/auth/register" className="text-blue-600 hover:underline">Register</Link>
      </p>
      <p className="text-center text-sm">
        <Link to="/auth/forgot-password" className="text-blue-600 hover:underline">Forgot password?</Link>
      </p>
    </form>
  )
}

export default Login
