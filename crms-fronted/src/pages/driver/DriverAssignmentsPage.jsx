import { useEffect, useState } from 'react'
import {
  ClipboardList,
  Car,
  MapPin,
  Clock,
  Phone,
  Loader2,
  User,
} from 'lucide-react'
import toast from 'react-hot-toast'

import {
  getAssignments,
  acceptAssignment,
} from '../../services/driverService'

const statusStyles = {
  assigned: 'badge-success',
  pending: 'badge-warning',
  accepted: 'badge-info',
  completed: 'badge-info',
  cancelled: 'badge-danger',
  rejected: 'badge-danger',
  in_progress: 'badge-warning',
}

export default function DriverAssignmentsPage() {
  const [assignments, setAssignments] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [acceptingId, setAcceptingId] = useState(null)

  const loadAssignments = async () => {
    try {
      setLoading(true)

      const data = await getAssignments()

      setAssignments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(
        'Failed to load assignments:',
        error
      )

      toast.error(
        error.response?.data?.message ||
        'Failed to load assignments'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssignments()
  }, [])

  // ============================================================
  // ACCEPT ASSIGNMENT
  // ============================================================

  const handleAccept = async (assignmentId) => {
    try {
      setAcceptingId(assignmentId)

      await acceptAssignment(assignmentId)

      toast.success('Assignment accepted')

      await loadAssignments()
    } catch (error) {
      console.error(
        'Failed to accept assignment:',
        error
      )

      toast.error(
        error.response?.data?.message ||
        'Failed to accept assignment'
      )
    } finally {
      setAcceptingId(null)
    }
  }

  const filteredAssignments =
    filter === 'all'
      ? assignments
      : assignments.filter(
          (assignment) =>
            assignment.status?.toLowerCase() === filter
        )

  const formatDate = (date) => {
    if (!date) return 'Not specified'

    return new Date(date).toLocaleDateString(
      'en-KE',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            My Assignments
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {filteredAssignments.length}{' '}
            assignment
            {filteredAssignments.length !== 1
              ? 's'
              : ''}
          </p>
        </div>

        {/* FILTERS */}

        <div className="flex flex-wrap gap-2">
          {[
            'all',
            'assigned',
            'accepted',
            'completed',
            'cancelled',
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          EMPTY STATE
      ======================================================== */}

      {filteredAssignments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">

          <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />

          <h3 className="font-semibold text-slate-700">
            No assignments
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            You currently have no assignments matching this filter.
          </p>

        </div>
      ) : (

        /* ======================================================
           ASSIGNMENTS
        ====================================================== */

        <div className="space-y-4">

          {filteredAssignments.map((assignment) => {

            const booking = assignment.booking
            const customer = booking?.customer
            const vehicle = booking?.vehicle

            return (
              <div
                key={assignment.id}
                className="bg-white rounded-xl shadow-sm p-5"
              >

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                  {/* =================================================
                      ASSIGNMENT INFORMATION
                  ================================================= */}

                  <div className="flex items-start gap-4">

                    <div className="w-12 h-12 rounded-lg bg-blue-100 text-primary flex items-center justify-center flex-shrink-0">
                      <ClipboardList size={20} />
                    </div>

                    <div className="min-w-0">

                      {/* TITLE + STATUS */}

                      <div className="flex flex-wrap items-center gap-2">

                        <h2 className="font-semibold text-slate-800">
                          {customer?.name ||
                            'Customer'}
                        </h2>

                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            statusStyles[
                              assignment.status?.toLowerCase()
                            ] ||
                            'badge-warning'
                          }`}
                        >
                          {assignment.status ||
                            'Pending'}
                        </span>

                      </div>

                      <p className="text-sm text-slate-500 mt-1">
                        Assignment #{assignment.id}
                      </p>

                      {/* =================================================
                          DETAILS
                      ================================================= */}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

                        <InfoItem
                          icon={User}
                          label="Customer"
                          value={
                            customer?.name ||
                            'Not available'
                          }
                        />

                        <InfoItem
                          icon={Phone}
                          label="Customer Phone"
                          value={
                            customer?.phone ||
                            'Not available'
                          }
                        />

                        <InfoItem
                          icon={MapPin}
                          label="Pickup"
                          value={
                            booking?.pickupLocation ||
                            'Not specified'
                          }
                        />

                        <InfoItem
                          icon={MapPin}
                          label="Drop-off"
                          value={
                            booking?.dropoffLocation ||
                            'Not specified'
                          }
                        />

                        <InfoItem
                          icon={Car}
                          label="Vehicle"
                          value={
                            vehicle?.name ||
                            'Not available'
                          }
                        />

                        <InfoItem
                          icon={Car}
                          label="Registration"
                          value={
                            vehicle?.registrationNumber ||
                            'Not available'
                          }
                        />

                        <InfoItem
                          icon={Clock}
                          label="Pickup Date"
                          value={formatDate(
                            booking?.pickupDate
                          )}
                        />

                        <InfoItem
                          icon={ClipboardList}
                          label="Booking"
                          value={
                            booking?.displayId ||
                            `BKG-${booking?.id || ''}`
                          }
                        />

                      </div>

                      {/* =================================================
                          ASSIGNED DATE
                      ================================================= */}

                      <div className="mt-4 bg-slate-50 rounded-lg p-3">

                        <p className="text-xs text-slate-400">
                          Assigned
                        </p>

                        <p className="text-sm text-slate-600 mt-1">
                          {formatDate(
                            assignment.assigned_at
                          )}
                        </p>

                      </div>

                    </div>
                  </div>

                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <div className="flex flex-col gap-2">

                    {/* ACCEPT ASSIGNMENT */}

                    {assignment.status?.toLowerCase() === 'assigned' && (
                      <button
                        onClick={() =>
                          handleAccept(assignment.id)
                        }
                        disabled={
                          acceptingId === assignment.id
                        }
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg"
                      >
                        {acceptingId === assignment.id
                          ? 'Accepting...'
                          : 'Accept Assignment'}
                      </button>
                    )}

                    {/* CALL CUSTOMER */}

                    {customer?.phone && (
                      <a
                        href={`tel:${customer.phone}`}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-lg"
                      >
                        <Phone size={15} />
                        Call Customer
                      </a>
                    )}

                  </div>

                </div>
              </div>
            )
          })}

        </div>
      )}
    </div>
  )
}

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-2">

      <Icon
        size={15}
        className="text-slate-400 mt-0.5 flex-shrink-0"
      />

      <div>
        <p className="text-xs text-slate-400">
          {label}
        </p>

        <p className="text-sm text-slate-700 font-medium">
          {value}
        </p>
      </div>

    </div>
  )
}