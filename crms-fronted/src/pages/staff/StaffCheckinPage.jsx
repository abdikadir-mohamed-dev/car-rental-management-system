import CheckinManagement from '../../components/staff/CheckinManagement'

function StaffCheckinPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Check-in</h1>
      </div>
      <CheckinManagement />
    </div>
  )
}

export default StaffCheckinPage
