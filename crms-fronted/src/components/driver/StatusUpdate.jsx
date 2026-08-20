import { useState } from 'react'
import { updateTripStatus } from '../../services/driverService'
import toast from 'react-hot-toast'
import { Send } from 'lucide-react'

function StatusUpdate({ tripId, currentStatus, onUpdate }) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    updateTripStatus(tripId, currentStatus, notes)
      .then(() => {
        toast.success('Status updated successfully')
        onUpdate?.()
      })
      .catch(() => toast.error('Failed to update status'))
      .finally(() => setLoading(false))
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-4">
      <div>
        <label className="label">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="3"
          className="input"
          placeholder="Add any notes about this trip..."
        />
      </div>
      <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
        <Send className="w-4 h-4" />
        {loading ? 'Updating...' : 'Update Status'}
      </button>
    </form>
  )
}

export default StatusUpdate
