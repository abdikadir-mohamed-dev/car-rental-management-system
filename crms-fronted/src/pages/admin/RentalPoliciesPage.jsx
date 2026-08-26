import { useState } from 'react'
import toast from 'react-hot-toast'

const INITIAL_POLICIES = {
  cancellation: {
    windowHours: 24,
    feePercent: 10,
    allowCancellation: true,
  },
  lateReturn: {
    gracePeriodMinutes: 30,
    lateFeePerHour: 500,
    maxLateFee: 5000,
  },
  minRentalAge: {
    minAge: 21,
    youngDriverSurcharge: 500,
  },
  rentalDuration: {
    minDurationDays: 1,
    maxDurationDays: 30,
  },
  securityDeposit: {
    defaultAmount: 10000,
  },
}

function RentalPoliciesPage() {
  const [policies, setPolicies] = useState(INITIAL_POLICIES)
  const [saving, setSaving] = useState(false)

  const update = (section, field, value) => {
    setPolicies((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setSaving(false)
    toast.success('Rental policies saved successfully')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Rental Policies</h1>
        <p className="text-slate-600 mt-1">Manage the rules and requirements that apply to vehicle rentals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Cancellation Policy</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Cancellation Window (hours before pickup)</label>
              <input
                type="number"
                className="input"
                value={policies.cancellation.windowHours}
                onChange={(e) => update('cancellation', 'windowHours', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">Cancellation Fee (%)</label>
              <input
                type="number"
                className="input"
                value={policies.cancellation.feePercent}
                onChange={(e) => update('cancellation', 'feePercent', Number(e.target.value))}
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
                  checked={policies.cancellation.allowCancellation}
                  onChange={(e) => update('cancellation', 'allowCancellation', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Late Return Policy</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Grace Period (minutes)</label>
              <input
                type="number"
                className="input"
                value={policies.lateReturn.gracePeriodMinutes}
                onChange={(e) => update('lateReturn', 'gracePeriodMinutes', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">Late Return Fee (KES per hour)</label>
              <input
                type="number"
                className="input"
                value={policies.lateReturn.lateFeePerHour}
                onChange={(e) => update('lateReturn', 'lateFeePerHour', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">Maximum Late Fee (KES)</label>
              <input
                type="number"
                className="input"
                value={policies.lateReturn.maxLateFee}
                onChange={(e) => update('lateReturn', 'maxLateFee', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Minimum Rental Age</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Minimum Rental Age (years)</label>
              <input
                type="number"
                className="input"
                value={policies.minRentalAge.minAge}
                onChange={(e) => update('minRentalAge', 'minAge', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">Young Driver Surcharge (KES)</label>
              <input
                type="number"
                className="input"
                value={policies.minRentalAge.youngDriverSurcharge}
                onChange={(e) => update('minRentalAge', 'youngDriverSurcharge', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Rental Duration</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Minimum Rental Duration (days)</label>
              <input
                type="number"
                className="input"
                value={policies.rentalDuration.minDurationDays}
                onChange={(e) => update('rentalDuration', 'minDurationDays', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">Maximum Rental Duration (days)</label>
              <input
                type="number"
                className="input"
                value={policies.rentalDuration.maxDurationDays}
                onChange={(e) => update('rentalDuration', 'maxDurationDays', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h3 className="font-semibold text-slate-900 mb-4">Security Deposit</h3>
          <div className="max-w-md">
            <label className="label">Default Security Deposit (KES)</label>
            <input
              type="number"
              className="input"
              value={policies.securityDeposit.defaultAmount}
              onChange={(e) => update('securityDeposit', 'defaultAmount', Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

export default RentalPoliciesPage
