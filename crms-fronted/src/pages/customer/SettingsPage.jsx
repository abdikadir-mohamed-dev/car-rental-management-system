import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getProfile, updateProfile } from '../../services/userService'

function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    bookingNotifications: true,
    promotionalNotifications: false,
    language: 'en',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const user = await getProfile()

        setSettings({
          emailNotifications: user.emailNotifications ?? true,
          bookingNotifications: user.bookingNotifications ?? true,
          promotionalNotifications: user.promotionalNotifications ?? false,
          language: user.language ?? 'en',
        })
      } catch (error) {
        console.error(error)
        toast.error('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)

      await updateProfile({
        email_notifications: settings.emailNotifications,
        booking_notifications: settings.bookingNotifications,
        promotional_notifications: settings.promotionalNotifications,
        language: settings.language,
      })

      toast.success('Settings saved successfully')
    } catch (error) {
      console.error(error)
      toast.error(
        error.response?.data?.message || 'Failed to save settings'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-600">Loading settings...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Settings
      </h1>

      <p className="text-slate-600 mb-6">
        Manage your account settings
      </p>

      <div className="space-y-6 max-w-2xl">

        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            Notification Settings
          </h3>

          <div className="space-y-4">

            {/* Email */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">
                  Email Notifications
                </p>
                <p className="text-sm text-slate-600">
                  Receive booking updates via email
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    emailNotifications: e.target.checked,
                  })
                }
                className="w-5 h-5"
              />
            </div>

            {/* Booking */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">
                  Booking Notifications
                </p>
                <p className="text-sm text-slate-600">
                  Receive updates about your bookings
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.bookingNotifications}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bookingNotifications: e.target.checked,
                  })
                }
                className="w-5 h-5"
              />
            </div>

            {/* Promotional */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">
                  Promotional Notifications
                </p>
                <p className="text-sm text-slate-600">
                  Receive offers and promotions
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.promotionalNotifications}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    promotionalNotifications: e.target.checked,
                  })
                }
                className="w-5 h-5"
              />
            </div>

          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            Language
          </h3>

          <select
            value={settings.language}
            onChange={(e) =>
              setSettings({
                ...settings,
                language: e.target.value,
              })
            }
            className="input"
          >
            <option value="en">English</option>
            <option value="sw">Swahili</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>

      </div>
    </div>
  )
}

export default SettingsPage