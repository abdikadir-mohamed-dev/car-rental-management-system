import { useEffect, useState } from 'react'
import {
  Search,
  UserCheck,
  UserX,
  Bell,
  Loader2,
} from 'lucide-react'
import axios from 'axios'

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000'

function DriverAssignments() {
  const [requests, setRequests] = useState([])
  const [drivers, setDrivers] = useState([])
  const [assignments, setAssignments] = useState([])

  const [search, setSearch] = useState('')

  const [selectedRequest, setSelectedRequest] =
    useState(null)

  const [selectedDriverId, setSelectedDriverId] =
    useState('')

  const [loading, setLoading] = useState(true)

  const [assigning, setAssigning] =
    useState(false)

  const [error, setError] = useState('')

  // ==========================================================
  // API CLIENT
  // ==========================================================

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`
    }

    return config
  })

  // ==========================================================
  // LOAD DATA
  // ==========================================================

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const [
        requestsResponse,
        driversResponse,
        assignmentsResponse,
      ] = await Promise.all([
        api.get(
          '/api/driver-assignments/requests'
        ),

        api.get(
          '/api/driver-assignments/available-drivers'
        ),

        api.get(
          '/api/driver-assignments/'
        ),
      ])

      setRequests(
        requestsResponse.data || []
      )

      setDrivers(
        driversResponse.data || []
      )

      setAssignments(
        assignmentsResponse.data || []
      )

    } catch (error) {

      console.error(
        'Failed to load driver assignments:',
        error
      )

      setError(
        error.response?.data?.message ||
        'Failed to load driver assignments'
      )

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // ==========================================================
  // SEARCH
  // ==========================================================

  const filteredRequests =
    requests.filter((request) => {

      const searchText =
        search.toLowerCase()

      return (
        request.customer?.name
          ?.toLowerCase()
          .includes(searchText) ||

        request.vehicle?.name
          ?.toLowerCase()
          .includes(searchText) ||

        request._id
          ?.toLowerCase()
          .includes(searchText) ||

        request.bookingId
          ?.toLowerCase()
          .includes(searchText)
      )
    })

  // ==========================================================
  // OPEN ASSIGN MODAL
  // ==========================================================

  const openAssignModal = (request) => {

    setSelectedRequest(request)

    setSelectedDriverId('')

    setError('')
  }

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const closeModal = () => {

    if (assigning) return

    setSelectedRequest(null)

    setSelectedDriverId('')
  }

  // ==========================================================
  // ASSIGN DRIVER
  // ==========================================================

  const handleAssign = async () => {

    if (
      !selectedRequest ||
      !selectedDriverId
    ) {
      return
    }

    try {

      setAssigning(true)

      setError('')

      await api.post(
        '/api/driver-assignments/',
        {
          booking_id:
            selectedRequest.booking_id,

          driver_id:
            Number(selectedDriverId),
        }
      )

      // Close modal
      setSelectedRequest(null)

      setSelectedDriverId('')

      // Reload real data
      await loadData()

    } catch (error) {

      console.error(
        'Failed to assign driver:',
        error
      )

      setError(
        error.response?.data?.message ||
        'Failed to assign driver'
      )

    } finally {

      setAssigning(false)
    }
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <div className="card p-10 flex items-center justify-center">

        <div className="flex items-center gap-3 text-slate-500">

          <Loader2 className="w-5 h-5 animate-spin" />

          Loading driver assignments...

        </div>

      </div>
    )
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* ======================================================
          PENDING DRIVER REQUESTS
      ====================================================== */}

      <div className="card p-6">

        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">

          <Bell className="w-5 h-5 text-warning" />

          Pending Driver Requests

        </h3>

        {/* SEARCH */}

        <div className="mb-4">

          <div className="relative">

            <Search
              className="
                absolute
                left-3
                top-1/2
                transform
                -translate-y-1/2
                w-5
                h-5
                text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="input pl-10"
            />

          </div>

        </div>

        {/* EMPTY */}

        {filteredRequests.length === 0 ? (

          <p className="text-center text-slate-500 py-8">

            No pending driver requests.

          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-200">

                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Request ID
                  </th>

                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Customer
                  </th>

                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Vehicle
                  </th>

                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Dates
                  </th>

                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Route
                  </th>

                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredRequests.map(
                  (request) => (

                    <tr
                      key={request._id}
                      className="
                        border-b
                        border-slate-100
                        hover:bg-slate-50
                      "
                    >

                      <td className="py-3 px-4 text-slate-900">

                        #{request._id}

                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium">

                        {request.customer?.name ||
                          'N/A'}

                      </td>

                      <td className="py-3 px-4 text-slate-600">

                        {request.vehicle?.name ||
                          'N/A'}

                      </td>

                      <td className="py-3 px-4 text-slate-600">

                        {request.pickupDate
                          ? request.pickupDate.slice(
                              0,
                              10
                            )
                          : 'N/A'}

                        {' - '}

                        {request.dropoffDate
                          ? request.dropoffDate.slice(
                              0,
                              10
                            )
                          : 'N/A'}

                      </td>

                      <td className="py-3 px-4 text-slate-600">

                        {request.pickupLocation ||
                          'N/A'}

                        {' → '}

                        {request.dropoffLocation ||
                          'N/A'}

                      </td>

                      <td className="py-3 px-4">

                        <button
                          onClick={() =>
                            openAssignModal(
                              request
                            )
                          }
                          className="
                            btn-primary
                            text-sm
                            px-3
                            py-1
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <UserCheck className="w-4 h-4" />

                          Assign Driver

                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ======================================================
          RECENT ASSIGNMENTS
      ====================================================== */}

      {assignments.length > 0 && (

        <div className="card p-6">

          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">

            <UserCheck className="w-5 h-5 text-success" />

            Recent Assignments

          </h3>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-200">

                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Assignment ID
                  </th>

                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Customer
                  </th>

                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Driver
                  </th>

                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Vehicle
                  </th>

                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {assignments.map(
                  (assignment) => (

                    <tr
                      key={assignment.id}
                      className="
                        border-b
                        border-slate-100
                        hover:bg-slate-50
                      "
                    >

                      <td className="py-3 px-4 text-slate-900">

                        #{assignment.id}

                      </td>

                      <td className="py-3 px-4 text-slate-600">

                        {assignment.booking
                          ?.customer?.name ||
                          'N/A'}

                      </td>

                      <td className="py-3 px-4 text-slate-600">

                        {assignment.driver?.name ||
                          'N/A'}

                      </td>

                      <td className="py-3 px-4 text-slate-600">

                        {assignment.booking
                          ?.vehicle?.name ||
                          'N/A'}

                      </td>

                      <td className="py-3 px-4">

                        <span className="badge badge-success capitalize">

                          {assignment.status ||
                            'assigned'}

                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {/* ======================================================
          ASSIGNMENT MODAL
      ====================================================== */}

      {selectedRequest && (

        <div className="
          fixed
          inset-0
          bg-black
          bg-opacity-50
          flex
          items-center
          justify-center
          z-50
          p-4
        ">

          <div className="
            bg-white
            rounded-lg
            shadow-xl
            max-w-lg
            w-full
            max-h-[90vh]
            overflow-y-auto
          ">

            {/* HEADER */}

            <div className="
              p-6
              border-b
              border-slate-200
              flex
              items-center
              justify-between
            ">

              <h3 className="
                text-lg
                font-semibold
                text-slate-900
              ">

                Confirm Driver Assignment

              </h3>

              <button
                onClick={closeModal}
                disabled={assigning}
                className="
                  text-slate-400
                  hover:text-slate-600
                "
              >

                <UserX className="w-5 h-5" />

              </button>

            </div>

            {/* DETAILS */}

            <div className="p-6 space-y-4">

              <div className="
                grid
                grid-cols-2
                gap-4
              ">

                <div>

                  <p className="text-sm text-slate-500">
                    Customer
                  </p>

                  <p className="font-medium text-slate-900">

                    {selectedRequest.customer?.name ||
                      'N/A'}

                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Vehicle
                  </p>

                  <p className="font-medium text-slate-900">

                    {selectedRequest.vehicle?.name ||
                      'N/A'}

                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Pickup
                  </p>

                  <p className="font-medium text-slate-900">

                    {selectedRequest.pickupLocation ||
                      'N/A'}

                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Dropoff
                  </p>

                  <p className="font-medium text-slate-900">

                    {selectedRequest.dropoffLocation ||
                      'N/A'}

                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Pickup Date
                  </p>

                  <p className="font-medium text-slate-900">

                    {selectedRequest.pickupDate
                      ? selectedRequest.pickupDate.slice(
                          0,
                          10
                        )
                      : 'N/A'}

                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Return Date
                  </p>

                  <p className="font-medium text-slate-900">

                    {selectedRequest.dropoffDate
                      ? selectedRequest.dropoffDate.slice(
                          0,
                          10
                        )
                      : 'N/A'}

                  </p>

                </div>

              </div>

              {/* DRIVER SELECT */}

              <div>

                <label className="label">
                  Select Driver
                </label>

                <select
                  value={selectedDriverId}
                  onChange={(e) =>
                    setSelectedDriverId(
                      e.target.value
                    )
                  }
                  disabled={assigning}
                  className="input"
                >

                  <option value="">
                    -- Choose a driver --
                  </option>

                  {drivers.map(
                    (driver) => (

                      <option
                        key={driver.id}
                        value={driver.id}
                      >

                        {driver.name}

                        {driver.licenseNumber &&
                          ` (${driver.licenseNumber})`}

                      </option>

                    )
                  )}

                </select>

                {drivers.length === 0 && (

                  <p className="
                    text-sm
                    text-slate-500
                    mt-1
                  ">

                    No available drivers at the moment.

                  </p>

                )}

              </div>

            </div>

            {/* FOOTER */}

            <div className="
              p-6
              border-t
              border-slate-200
              flex
              justify-end
              gap-3
            ">

              <button
                onClick={closeModal}
                disabled={assigning}
                className="btn-secondary"
              >

                Cancel

              </button>

              <button
                onClick={handleAssign}
                disabled={
                  !selectedDriverId ||
                  assigning
                }
                className="
                  btn-primary
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  flex
                  items-center
                  gap-2
                "
              >

                {assigning && (
                  <Loader2
                    className="
                      w-4
                      h-4
                      animate-spin
                    "
                  />
                )}

                {assigning
                  ? 'Assigning...'
                  : 'Confirm Assignment'}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default DriverAssignments