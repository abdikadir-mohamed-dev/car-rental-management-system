import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { loginThunk as login } from '../../redux/slices/authSlice'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    dispatch(
      login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })
    )
      .unwrap()
      .then((res) => {
        toast.success('Login successful!')

        const role = res.user?.role

        if (role === 'admin') {
          navigate('/admin')
        } else if (role === 'staff') {
          navigate('/staff')
        } else if (role === 'driver') {
          navigate('/driver')
        } else {
          navigate('/customer')
        }
      })
      .catch((err) => {
        toast.error(err || 'Invalid email or password')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6"
    >
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome Back
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          Sign in to your DriveGo account
        </p>
      </div>

      {/* EMAIL */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Email Address
        </label>

        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          className={`input w-full ${
            errors.email ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          placeholder="Enter your email"
        />

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email}
          </p>
        )}
      </div>

      {/* PASSWORD */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
          className={`input w-full ${
            errors.password ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          placeholder="Enter your password"
        />

        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password}
          </p>
        )}
      </div>

      {/* FORGOT PASSWORD */}
      <div className="flex justify-end">
        <Link
          to="/auth/forgot-password"
          className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
        >
          Forgot password?
        </Link>
      </div>

      {/* SIGN IN */}
      <button
        type="submit"
        className="btn-primary w-full py-3 rounded-lg font-semibold transition-all"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      {/* REGISTER */}
      <div className="pt-2 border-t border-slate-100">
        <p className="text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link
            to="/auth/register"
            className="text-blue-600 hover:text-blue-700 hover:underline font-semibold"
          >
            Create an account
          </Link>
        </p>
      </div>
    </form>
  )
}

export default Login