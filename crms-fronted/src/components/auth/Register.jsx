import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { CarFront, ShieldCheck, KeyRound } from 'lucide-react'
import { registerThunk } from '../../redux/slices/authSlice'

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone must be exactly 10 digits'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      const result = await dispatch(
        registerThunk({
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          password: formData.password,
        })
      ).unwrap()

      toast.success('Account created successfully!')

      const role = result.user?.role

      if (role === 'admin') {
        navigate('/admin')
      } else if (role === 'staff') {
        navigate('/staff')
      } else if (role === 'driver') {
        navigate('/driver')
      } else {
        navigate('/customer')
      }
    } catch (error) {
      toast.error(error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center px-4 py-10">

      {/* CODE-BASED CAR BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* Gradient glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />

        {/* Road */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-slate-900 border-t border-slate-800">
          <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-slate-700" />
        </div>

        {/* Decorative car */}
        <div className="absolute bottom-20 left-[8%] text-blue-500/10">
          <CarFront className="w-72 h-72" strokeWidth={0.8} />
        </div>

        <div className="absolute top-20 right-[8%] text-blue-400/10">
          <CarFront className="w-56 h-56" strokeWidth={0.8} />
        </div>

        {/* Small decorative lines */}
        <div className="absolute top-[25%] left-[12%] w-20 h-px bg-blue-500/20" />
        <div className="absolute top-[30%] left-[15%] w-10 h-px bg-blue-500/20" />

        <div className="absolute top-[35%] right-[12%] w-24 h-px bg-blue-500/20" />
        <div className="absolute top-[40%] right-[15%] w-12 h-px bg-blue-500/20" />
      </div>

      {/* REGISTER CARD */}
      <div className="relative z-10 w-full max-w-lg">

        {/* Logo / heading */}
        <div className="text-center mb-6">

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30 mb-4">
            <CarFront className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white">
            Create Your Account
          </h1>

          <p className="text-slate-400 mt-2">
            Join DriveGo and start your journey
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-7 sm:p-8 space-y-5"
        >

          {/* First + Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`input ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
                placeholder="John"
              />

              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`input ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
                placeholder="Doe"
              />

              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName}
                </p>
              )}
            </div>

          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input ${
                errors.email ? 'border-red-500' : ''
              }`}
              placeholder="john@example.com"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`input ${
                errors.phone ? 'border-red-500' : ''
              }`}
              placeholder="0711000000"
            />

            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`input ${
                errors.password ? 'border-red-500' : ''
              }`}
              placeholder="Min. 6 characters"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`input ${
                errors.confirmPassword ? 'border-red-500' : ''
              }`}
              placeholder="Repeat password"
            />

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Security information */}
          <div className="grid grid-cols-2 gap-3 pt-1">

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Secure account
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <KeyRound className="w-4 h-4 text-blue-600" />
              Protected login
            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Login */}
          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>

        </form>
      </div>
    </div>
  )
}

export default Register