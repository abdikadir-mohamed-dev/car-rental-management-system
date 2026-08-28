import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { FileText, Clock, DollarSign, User, CalendarDays, Shield } from 'lucide-react'
import { getPolicies, updatePolicies } from '../../services/adminService'

function RentalPoliciesPage() {
  const [policies, setPolicies] = useState({
    cancellationWindow: 24,
    cancellationFee: '10',
    allowCancellation: true,
    lateReturnGracePeriod: 30,
    lateReturnFee: '500',
    maximumLateFee: '5000',
    minimumRentalAge: 21,
    youngDriverSurcharge: '500',
    minimumRentalDuration: 1,
    maximumRentalDuration: 30,
    defaultSecurityDeposit: '10000',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        setLoading(true)
        const data = await getPolicies()
        if (data && Object.keys(data).length > 0) {
          setPolicies((prev) => ({ ...prev, ...data }))
        }
      } catch (err) {
        console.error('Failed to load policies:', err)
      } finally {
        setLoading(false)
      }
    }
    loadPolicies()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      await updatePolicies(policies)
      toast.success('Rental policies saved successfully')
    } catch (err) {
      toast.error(err.message || 'Failed to save policies')
    } finally {
      setSaving(false)
    }
  }

  const updatePolicy = (key, value) => {
    setPolicies((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Rental Policies</h1>
        <p className="text-slate-600 mt-1">Manage the rules and requirements that apply to vehicle rentals</p>
      </div>
      <div className="space-y-6 max-w-3xl">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-slate-700" />
            <h3 className="font-semibold text-slate-900">Cancellation Policy</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Cancellation Window (hours)</label>
              <input
                type="number"
                value={policies.cancellationWindow}
                onChange={(e) => updatePolicy('cancellationWindow', Number(e.target.value))}
                className="input"
              />
            </div>
            <div>
              <label className="label">Cancellation Fee (%)</label>
              <input
                type="text"
                value={policies.cancellationFee}
                onChange={(e) => updatePolicy('cancellationFee', e.target.value)}
                className="input"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Allow Cancellation</p>
                <p className="text-sm text-slate-600">Enable customers to cancel bookings</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={policies.allowCancellation}
                  onChange={(e) => updatePolicy('allowCancellation', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-slate-700" />
            <h3 className="font-semibold text-slate-900">Late Return Policy</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Grace Period (minutes)</label>
              <input
                type="number"
                value={policies.lateReturnGracePeriod}
                onChange={(e) => updatePolicy('lateReturnGracePeriod', Number(e.target.value))}
                className="input"
              />
            </div>
            <div>
              <label className="label">Late Return Fee (KES per hour)</label>
              <input
                type="text"
                value={policies.lateReturnFee}
                onChange={(e) => updatePolicy('lateReturnFee', e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">Maximum Late Fee (KES)</label>
              <input
                type="text"
                value={policies.maximumLateFee}
                onChange={(e) => updatePolicy('maximumLateFee', e.target.value)}
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-slate-700" />
            <h3 className="font-semibold text-slate-900">Minimum Rental Age</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Minimum Rental Age (years)</label>
              <input
                type="number"
                value={policies.minimumRentalAge}
                onChange={(e) => updatePolicy('minimumRentalAge', Number(e.target.value))}
                className="input"
              />
            </div>
            <div>
              <label className="label">Young Driver Surcharge (KES)</label>
              <input
                type="text"
                value={policies.youngDriverSurcharge}
                onChange={(e) => updatePolicy('youngDriverSurcharge', e.target.value)}
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-slate-700" />
            <h3 className="font-semibold text-slate-900">Rental Duration</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Minimum Rental Duration (days)</label>
              <input
                type="number"
                value={policies.minimumRentalDuration}
                onChange={(e) => updatePolicy('minimumRentalDuration', Number(e.target.value))}
                className="input"
              />
            </div>
            <div>
              <label className="label">Maximum Rental Duration (days)</label>
              <input
                type="number"
                value={policies.maximumRentalDuration}
                onChange={(e) => updatePolicy('maximumRentalDuration', Number(e.target.value))}
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-slate-700" />
            <h3 className="font-semibold text-slate-900">Security Deposit</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Default Security Deposit (KES)</label>
              <input
                type="text"
                value={policies.defaultSecurityDeposit}
                onChange={(e) => updatePolicy('defaultSecurityDeposit', e.target.value)}
                className="input"
              />
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

export default RentalPoliciesPage
