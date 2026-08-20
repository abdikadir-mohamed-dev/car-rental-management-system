import React from 'react'
import {
  LayoutGrid, ClipboardList, Calendar, LogOut, LogIn,
  Car, Users, Wrench, BarChart2, Bell, User, Power,
  ShipWheel, ChevronDown, DollarSign, MapPin, Clock,
  Phone, CheckCircle2, XCircle, ChevronRight
} from 'lucide-react'
import { toast } from 'react-hot-toast'

const assignments = [
  {
    id: 'ASG-1042',
    customer: 'John Doe',
    phone: '+254 712 345 678',
    vehicle: 'Toyota RAV4',
    plate: 'KDA 221B',
    pickup: 'Nairobi CBD',
    dropoff: 'Westlands Office',
    date: 'Aug 21, 2026',
    time: '09:30 AM',
    fare: 'KSH 32',
    status: 'Assigned',
    notes: 'Customer prefers air conditioning on.',
  },
  {
    id: 'ASG-1041',
    customer: 'Mary Wanjiku',
    phone: '+254 722 456 789',
    vehicle: 'Honda Accord',
    plate: 'KCE 552M',
    pickup: 'JKIA Terminal 1',
    dropoff: 'Karen Branch',
    date: 'Aug 21, 2026',
    time: '02:00 PM',
    fare: 'KSH 28',
    status: 'Upcoming',
    notes: 'Flight arrival time may shift by 30 mins.',
  },
  {
    id: 'ASG-1038',
    customer: 'Peter Mwangi',
    phone: '+254 733 567 890',
    vehicle: 'BMW 3 Series',
    plate: 'KDB 774K',
    pickup: 'Westlands Office',
    dropoff: 'Two Rivers Mall',
    date: 'Aug 20, 2026',
    time: '05:00 PM',
    fare: 'KSH 35',
    status: 'Completed',
    notes: 'Client requested no music during trip.',
  },
  {
    id: 'ASG-1035',
    customer: 'Amina Yusuf',
    phone: '+254 744 678 901',
    vehicle: 'Mazda Demio',
    plate: 'KCF 108T',
    pickup: 'Karen Branch',
    dropoff: 'Nairobi CBD',
    date: 'Aug 19, 2026',
    time: '11:00 AM',
    fare: 'KSH 24',
    status: 'Completed',
    notes: 'Luggage space required.',
  },
  {
    id: 'ASG-1032',
    customer: 'Kevin Njoroge',
    phone: '+254 755 789 012',
    vehicle: 'Toyota Prado',
    plate: 'KDA 221B',
    pickup: 'Kilimani',
    dropoff: 'Sarit Centre',
    date: 'Aug 18, 2026',
    time: '04:15 PM',
    fare: 'KSH 40',
    status: 'Cancelled',
    notes: 'Cancelled by customer 2 hours before pickup.',
  },
];

const statusStyle = {
  Assigned: 'bg-emerald-100 text-emerald-700',
  Upcoming: 'bg-amber-100 text-amber-700',
  Completed: 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-rose-100 text-rose-700',
};

export default function DriverAssignmentsPage() {
  const [active, setActive] = React.useState('Assignments');
  const [filter, setFilter] = React.useState('All');

  const filtered = filter === 'All' ? assignments : assignments.filter((a) => a.status === filter);

  const handleAction = (assignment, action) => {
    toast.success(`Assignment ${assignment.id} ${action}`)
  };

  const handleCall = (phone) => {
    toast.success(`Calling ${phone}`)
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Assignments</h1>
          <p className="text-sm text-slate-500">{filtered.length} assignment{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          {['All', 'Assigned', 'Upcoming', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((assignment) => (
          <div key={assignment.id} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  assignment.status === 'Assigned' ? 'bg-emerald-100 text-emerald-600' :
                  assignment.status === 'Upcoming' ? 'bg-amber-100 text-amber-600' :
                  assignment.status === 'Completed' ? 'bg-blue-100 text-blue-600' :
                  'bg-rose-100 text-rose-600'
                }`}>
                  <ClipboardList size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800">{assignment.customer}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle[assignment.status]}`}>
                      {assignment.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">Assignment ID: {assignment.id}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-400 text-xs">Pickup</p>
                        <p className="text-slate-700 font-medium">{assignment.pickup}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-400 text-xs">Drop-off</p>
                        <p className="text-slate-700 font-medium">{assignment.dropoff}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Car size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-400 text-xs">Vehicle</p>
                        <p className="text-slate-700 font-medium">{assignment.vehicle} ({assignment.plate})</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-400 text-xs">Date & Time</p>
                        <p className="text-slate-700 font-medium">{assignment.date} at {assignment.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <DollarSign size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-400 text-xs">Fare</p>
                        <p className="text-slate-700 font-medium">{assignment.fare}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-400 text-xs">Customer Phone</p>
                        <p className="text-slate-700 font-medium">{assignment.phone}</p>
                      </div>
                    </div>
                  </div>
                  {assignment.notes && (
                    <div className="mt-3 bg-slate-50 rounded-lg p-3 text-sm text-slate-600">
                      <span className="font-medium">Notes:</span> {assignment.notes}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                {assignment.status === 'Assigned' && (
                  <>
                    <button
                      onClick={() => handleCall(assignment.phone)}
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                    >
                      <Phone size={14} />
                      Call
                    </button>
                    <button
                      onClick={() => handleAction(assignment, 'accepted')}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                    >
                      <CheckCircle2 size={14} />
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(assignment, 'rejected')}
                      className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                    >
                      <XCircle size={14} />
                      Decline
                    </button>
                  </>
                )}
                {assignment.status === 'Upcoming' && (
                  <>
                    <button
                      onClick={() => handleCall(assignment.phone)}
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                    >
                      <Phone size={14} />
                      Call
                    </button>
                    <button
                      onClick={() => handleAction(assignment, 'started')}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                    >
                      <ChevronRight size={14} />
                      Start Trip
                    </button>
                  </>
                )}
                {assignment.status === 'Completed' && (
                  <button
                    onClick={() => handleAction(assignment, 'viewed')}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center text-slate-400 text-sm">
            No assignments match your filter.
          </div>
        )}
      </div>
    </div>
  );
}
