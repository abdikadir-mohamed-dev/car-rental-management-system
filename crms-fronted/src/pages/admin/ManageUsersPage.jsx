import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

import UserManagement from '../../components/admin/UserManagement'

import {
  getUsers,
  createStaff,
  createDriver,
  registerUser,
} from '../../services/adminService'

function ManageUsersPage() {
  const [showModal, setShowModal] = useState(false)
  const [showCredentialsModal, setShowCredentialsModal] = useState(false)

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    licenseNumber: '',
  })

  const [errors, setErrors] = useState({})

  // ============================================================
  // LOAD USERS
  // ============================================================

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getUsers()

        const list = Array.isArray(data)
          ? data
          : data?.users || []

        setUsers(list)
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            'Failed to load users'
        )
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  // ============================================================
  // FORM HANDLING
  // ============================================================

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

    // Clear license number when switching away from Driver
    if (name === 'role' && value !== 'driver') {
      setFormData((prev) => ({
        ...prev,
        role: value,
        licenseNumber: '',
      }))

      setErrors((prev) => ({
        ...prev,
        licenseNumber: '',
      }))
    }
  }

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateForm = () => {
    const newErrors = {}

    // Name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email = 'Invalid email format'
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    } else if (
      !/^\d{10}$/.test(formData.phone.trim())
    ) {
      newErrors.phone = 'Phone must be exactly 10 digits'
    }

    // Role
    if (!formData.role) {
      newErrors.role = 'Role is required'
    }

    // Driver license number
    if (formData.role === 'driver') {
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber =
          'License number is required for drivers'
      } else if (formData.licenseNumber.trim().length < 3) {
        newErrors.licenseNumber =
          'License number must be at least 3 characters'
      }
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  // ============================================================
  // CREATE USER
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      let result

      if (formData.role === 'staff') {
        result = await createStaff({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          isActive: true,
        })
      } else if (formData.role === 'driver') {
        result = await createDriver({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          licenseNumber: formData.licenseNumber.trim(),
          isActive: true,
        })
      } else {
        // This branch is kept for future roles.
        // Customer registration requires a password.
        result = await registerUser({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          role: formData.role,
        })
      }

      const newUser = result?.user || result

      setUsers((prev) => [newUser, ...prev])

      // --------------------------------------------------------
      // STAFF / DRIVER
      // Backend generates the temporary password.
      // --------------------------------------------------------

      if (
        formData.role === 'staff' ||
        formData.role === 'driver'
      ) {
        if (result?.password) {
          setCredentials({
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            role: formData.role,
            password: result.password,
          })

          setShowCredentialsModal(true)
        } else {
          toast.success(
            `Account created successfully for ${formData.email}`
          )
        }
      } else {
        toast.success(
          `Account created successfully for ${formData.email}`
        )
      }

      resetForm()
      setShowModal(false)
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Failed to create user'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ============================================================
  // RESET FORM
  // ============================================================

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'staff',
      licenseNumber: '',
    })

    setErrors({})
  }

  const handleClose = () => {
    if (submitting) return

    setShowModal(false)
    resetForm()
  }

  // ============================================================
  // COPY TEMPORARY PASSWORD
  // ============================================================

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(
        credentials.password
      )

      toast.success('Temporary password copied')
    } catch (err) {
      toast.error('Could not copy password')
    }
  }

  // ============================================================
  // CLOSE CREDENTIALS MODAL
  // ============================================================

  const handleCloseCredentials = () => {
    setShowCredentialsModal(false)

    setCredentials({
      name: '',
      email: '',
      role: '',
      password: '',
    })
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">{error}</p>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-blue-600 hover:underline"
        >
          Retry
        </button>
      </div>
    )
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div>
      {/* ========================================================
          PAGE HEADER
      ======================================================== */}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Manage Users
          </h1>

          <p className="text-slate-600 mt-1">
            View and manage all users
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          Add User
        </button>
      </div>

      {/* ========================================================
          USER MANAGEMENT
      ======================================================== */}

      <UserManagement
        users={users}
        setUsers={setUsers}
      />

      {/* ========================================================
          ADD USER MODAL
      ======================================================== */}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">

            {/* HEADER */}

            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Add User
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Create an account for a staff member or driver.
                A temporary password will be generated
                automatically.
              </p>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >
              {/* NAME */}

              <div>
                <label className="label">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input ${
                    errors.name ? 'border-danger' : ''
                  }`}
                  placeholder="John Doe"
                />

                {errors.name && (
                  <p className="text-danger text-sm mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* EMAIL */}

              <div>
                <label className="label">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input ${
                    errors.email ? 'border-danger' : ''
                  }`}
                  placeholder="john@example.com"
                />

                {errors.email && (
                  <p className="text-danger text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* PHONE */}

              <div>
                <label className="label">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input ${
                    errors.phone ? 'border-danger' : ''
                  }`}
                  placeholder="0711000000"
                />

                {errors.phone && (
                  <p className="text-danger text-sm mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* ROLE */}

              <div>
                <label className="label">
                  Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`input capitalize ${
                    errors.role ? 'border-danger' : ''
                  }`}
                >
                  <option value="staff">
                    Staff
                  </option>

                  <option value="driver">
                    Driver
                  </option>
                </select>

                {errors.role && (
                  <p className="text-danger text-sm mt-1">
                    {errors.role}
                  </p>
                )}
              </div>

              {/* DRIVER LICENSE */}

              {formData.role === 'driver' && (
                <div>
                  <label className="label">
                    License Number
                  </label>

                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className={`input ${
                      errors.licenseNumber
                        ? 'border-danger'
                        : ''
                    }`}
                    placeholder="DL12345678"
                  />

                  {errors.licenseNumber && (
                    <p className="text-danger text-sm mt-1">
                      {errors.licenseNumber}
                    </p>
                  )}

                  <p className="text-xs text-slate-500 mt-1">
                    Enter the driver's valid license number.
                  </p>
                </div>
              )}

              {/* PASSWORD INFORMATION */}

              <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
                <p className="text-sm font-medium text-blue-900">
                  Temporary password
                </p>

                <p className="text-sm text-blue-700 mt-1">
                  The system will automatically generate a
                  temporary password after the account is
                  created. You will be shown the password once
                  creation is successful.
                </p>
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={submitting}
                >
                  {submitting
                    ? 'Creating...'
                    : 'Create User'}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-secondary flex-1"
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          TEMPORARY CREDENTIALS MODAL
      ======================================================== */}

      {showCredentialsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">

            {/* HEADER */}

            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Account Created
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Save these credentials and give them to the
                account holder.
              </p>
            </div>

            {/* CREDENTIALS */}

            <div className="p-6 space-y-4">

              {/* NAME */}

              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">
                  Name
                </p>

                <p className="text-slate-900 font-medium mt-1">
                  {credentials.name}
                </p>
              </div>

              {/* EMAIL */}

              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">
                  Email
                </p>

                <p className="text-slate-900 font-medium mt-1">
                  {credentials.email}
                </p>
              </div>

              {/* ROLE */}

              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">
                  Role
                </p>

                <p className="text-slate-900 font-medium mt-1 capitalize">
                  {credentials.role}
                </p>
              </div>

              {/* PASSWORD */}

              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">
                  Temporary Password
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-slate-100 border border-slate-200 rounded-lg px-4 py-3 font-mono text-lg font-semibold text-slate-900">
                    {credentials.password}
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="btn-secondary whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* WARNING */}

              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm font-medium text-amber-900">
                  Important
                </p>

                <p className="text-sm text-amber-800 mt-1">
                  This is a temporary password. The account
                  holder should change it after signing in.
                </p>
              </div>

              {/* DONE */}

              <button
                type="button"
                onClick={handleCloseCredentials}
                className="btn-primary w-full"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageUsersPage