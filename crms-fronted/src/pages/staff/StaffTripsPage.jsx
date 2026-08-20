import { useState } from 'react'
import TripManagement from '../../components/staff/TripManagement'

function StaffTripsPage() {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Trips</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        {['all', 'assigned', 'in_progress', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            {tab === 'all' ? 'All' : tab.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </button>
        ))}
      </div>
      <TripManagement />
    </div>
  )
}

export default StaffTripsPage
