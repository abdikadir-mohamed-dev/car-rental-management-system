const mockDashboard = {
  stats: {
    todayPickups: 12,
    todayReturns: 8,
    pendingTasks: 5,
    activeRentals: 24,
  },
  todaySchedule: [
    { time: '09:00 AM', customer: 'John Doe', vehicle: 'Toyota Camry', action: 'Check-out', status: 'pending' },
    { time: '10:30 AM', customer: 'Jane Smith', vehicle: 'Honda CR-V', action: 'Check-in', status: 'in_progress' },
    { time: '11:00 AM', customer: 'Alice Mwangi', vehicle: 'Toyota RAV4', action: 'Check-out', status: 'pending' },
    { time: '02:00 PM', customer: 'Brian Otieno', vehicle: 'Mazda CX-5', action: 'Check-in', status: 'pending' },
  ],
  vehicleStatus: {
    available: 18,
    rented: 24,
    maintenance: 3,
  },
  recentBookings: [
    { _id: 'BKG-1024', user: { name: 'Alice Mwangi' }, vehicle: { name: 'Toyota RAV4' }, pickupDate: 'Aug 20', dropoffDate: 'Aug 25', status: 'confirmed' },
    { _id: 'BKG-1023', user: { name: 'Brian Otieno' }, vehicle: { name: 'Mazda CX-5' }, pickupDate: 'Aug 21', dropoffDate: 'Aug 28', status: 'pending' },
    { _id: 'BKG-1022', user: { name: 'Grace Njeri' }, vehicle: { name: 'Nissan X-Trail' }, pickupDate: 'Aug 19', dropoffDate: 'Aug 22', status: 'active' },
  ],
}

const mockBookings = [
  { _id: 'BKG-1024', vehicle: { name: 'Toyota RAV4' }, user: { name: 'Alice Mwangi' }, pickupDate: '2026-08-20', dropoffDate: '2026-08-25', status: 'confirmed', pickupLocation: 'Nairobi CBD', dropoffLocation: 'Nairobi CBD' },
  { _id: 'BKG-1023', vehicle: { name: 'Mazda CX-5' }, user: { name: 'Brian Otieno' }, pickupDate: '2026-08-21', dropoffDate: '2026-08-28', status: 'pending', pickupLocation: 'Westlands', dropoffLocation: 'Westlands' },
  { _id: 'BKG-1022', vehicle: { name: 'Nissan X-Trail' }, user: { name: 'Grace Njeri' }, pickupDate: '2026-08-19', dropoffDate: '2026-08-22', status: 'active', pickupLocation: 'Kilimani', dropoffLocation: 'Kilimani' },
  { _id: 'BKG-1021', vehicle: { name: 'Subaru Forester' }, user: { name: 'David Kipchoge' }, pickupDate: '2026-08-22', dropoffDate: '2026-08-25', status: 'pending', pickupLocation: 'Kileleshwa', dropoffLocation: 'Kileleshwa' },
  { _id: 'BKG-1020', vehicle: { name: 'Volkswagen Golf' }, user: { name: 'Mary Wanjiku' }, pickupDate: '2026-08-18', dropoffDate: '2026-08-20', status: 'completed', pickupLocation: 'Lavington', dropoffLocation: 'Lavington' },
]

const mockTrips = [
  { _id: 'TRP-201', customer: { name: 'John Doe' }, vehicle: { name: 'Toyota Camry' }, pickupLocation: 'Nairobi CBD', dropoffLocation: 'JKIA', pickupTime: '08:00 AM', status: 'assigned' },
  { _id: 'TRP-202', customer: { name: 'Jane Smith' }, vehicle: { name: 'Honda CR-V' }, pickupLocation: 'Westlands', dropoffLocation: 'Nairobi CBD', pickupTime: '10:30 AM', status: 'in_progress' },
  { _id: 'TRP-203', customer: { name: 'Alice Mwangi' }, vehicle: { name: 'Toyota RAV4' }, pickupLocation: 'Kilimani', dropoffLocation: 'JKIA', pickupTime: '09:00 AM', status: 'completed' },
  { _id: 'TRP-204', customer: { name: 'Brian Otieno' }, vehicle: { name: 'Mazda CX-5' }, pickupLocation: 'Kileleshwa', dropoffLocation: 'Westlands', pickupTime: '11:00 AM', status: 'assigned' },
]

const mockVehiclesForInspection = [
  { id: 1, name: 'Toyota Camry', plate: 'ABC 123', status: 'pending', condition: '', mileage: '', fuelLevel: '', notes: '', type: 'check-out' },
  { id: 2, name: 'Honda CR-V', plate: 'XYZ 789', status: 'pending', condition: '', mileage: '', fuelLevel: '', notes: '', type: 'check-out' },
  { id: 3, name: 'Toyota RAV4', plate: 'DEF 456', status: 'pending', condition: '', mileage: '', fuelLevel: '', notes: '', type: 'check-in' },
  { id: 4, name: 'Mazda CX-5', plate: 'GHI 789', status: 'pending', condition: '', mileage: '', fuelLevel: '', notes: '', type: 'check-in' },
]

const mockInspectionHistory = [
  { id: 101, vehicle: 'Toyota Camry', plate: 'ABC 123', type: 'Check-in', date: '2026-08-18', inspector: 'Staff A', status: 'passed', notes: 'Minor scratch on rear bumper' },
  { id: 102, vehicle: 'Honda CR-V', plate: 'XYZ 789', type: 'Check-out', date: '2026-08-17', inspector: 'Staff B', status: 'passed', notes: 'Good condition' },
  { id: 103, vehicle: 'Toyota RAV4', plate: 'DEF 456', type: 'Check-in', date: '2026-08-16', inspector: 'Staff A', status: 'failed', notes: 'Flat tire, dent on left door' },
  { id: 104, vehicle: 'Mazda CX-5', plate: 'GHI 789', type: 'Check-out', date: '2026-08-15', inspector: 'Staff C', status: 'passed', notes: 'Clean, full tank' },
]

export const getMockDashboard = () => mockDashboard
export const getMockBookings = () => ({ data: { bookings: mockBookings } })
export const getMockTrips = () => ({ data: { trips: mockTrips } })
export const getMockVehiclesForInspection = () => ({ data: mockVehiclesForInspection })
export const getMockInspectionHistory = () => mockInspectionHistory
