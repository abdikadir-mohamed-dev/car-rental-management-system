import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getPublicPolicies } from '../../services/adminService'

function CustomerPoliciesPage() {
  const [policies, setPolicies] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        setLoading(true)
        const data = await getPublicPolicies()
        setPolicies(data)
      } catch (err) {
        toast.error('Failed to load policies')
      } finally {
        setLoading(false)
      }
    }
    loadPolicies()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const policyItems = policies ? Object.entries(policies) : []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Rental Policies</h1>
        <p className="text-slate-600 mt-1">Rules and requirements that apply to vehicle rentals</p>
      </div>
      <div className="max-w-3xl space-y-6">
        {policyItems.length === 0 ? (
          <p className="text-slate-500">No policies available at the moment.</p>
        ) : (
          policyItems.map(([key, value]) => (
            <div key={key} className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <p className="text-slate-600">{String(value)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CustomerPoliciesPage
