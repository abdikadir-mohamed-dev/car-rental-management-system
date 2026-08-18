import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { format, parseISO, differenceInCalendarDays } from 'date-fns'
import { CheckCircle2, Fuel, MapPin, Settings2, Users } from 'lucide-react'
import { toast } from 'sonner'

import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { kes } from '@/lib/format'
import StatusBadge from '@/components/StatusBadge'
import { VehicleImage } from '@/components/VehicleCard'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function VehicleDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(null)
  const [range, setRange] = useState(undefined)
  const [booking, setBooking] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loadError, setLoadError] = useState(null)

  const load = () => {
    setLoadError(null)
    api(`/api/vehicles/${id}`)
      .then((d) => setVehicle(d.vehicle))
      .catch((err) => {
        setLoadError(err instanceof Error ? err.message : 'Failed to load vehicle details')
        setVehicle(null)
      })
  }
  useEffect(load, [id])

  const disabledDays = useMemo(() => {
    const ranges = (vehicle?.booked_ranges ?? []).map((r) => ({
      from: parseISO(r.start),
      // booked end is exclusive (return day) — last blocked day is the day before
      to: new Date(parseISO(r.end).getTime() - 86400000),
    }))
    return [{ before: new Date() }, ...ranges]
  }, [vehicle])

  const nights = range?.from && range?.to ? differenceInCalendarDays(range.to, range.from) : 0
  const total = vehicle && nights > 0 ? nights * vehicle.daily_rate : 0

  const book = async () => {
    if (!user) {
      toast.info('Log in or create an account to book.')
      navigate('/login', { state: { from: `/vehicles/${id}` } })
      return
    }
    if (!range?.from || !range?.to) {
      toast.error('Pick a pickup and return date first.')
      return
    }
    setSubmitting(true)
    try {
      const { booking } = await api('/api/bookings/', {
        method: 'POST',
        body: {
          vehicle_id: vehicle.id,
          start_date: format(range.from, 'yyyy-MM-dd'),
          end_date: format(range.to, 'yyyy-MM-dd'),
        },
      })
      setBooking(booking)
      toast.success(`Booking ${booking.ref} confirmed!`)
      load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-5xl p-8 text-center">
        <p className="text-lg font-medium text-slate-700">{loadError}</p>
        <Button className="mt-4" onClick={load}>Try Again</Button>
      </div>
    )
  }

  if (!vehicle) return <div className="mx-auto max-w-5xl p-8"><Skeleton className="h-96 rounded-xl" /></div>

  // Confirmation / digital rental agreement view
  if (booking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Card className="border-emerald-200" id="agreement">
          <CardHeader className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
            <CardTitle className="text-2xl">Booking confirmed</CardTitle>
            <p className="text-sm text-slate-500">Rental agreement · {booking.ref}</p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4">
              <div><p className="text-slate-500">Vehicle</p><p className="font-medium">{vehicle.name} ({vehicle.plate})</p></div>
              <div><p className="text-slate-500">Pickup location</p><p className="font-medium">{vehicle.location}</p></div>
              <div><p className="text-slate-500">Pickup</p><p className="font-medium">{format(parseISO(booking.start_date), 'EEE, dd MMM yyyy')} · 09:00</p></div>
              <div><p className="text-slate-500">Return</p><p className="font-medium">{format(parseISO(booking.end_date), 'EEE, dd MMM yyyy')} · 09:00</p></div>
              <div><p className="text-slate-500">Duration</p><p className="font-medium">{booking.days} day(s)</p></div>
              <div><p className="text-slate-500">Rate</p><p className="font-medium">{kes(booking.daily_rate)} / day</p></div>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <p className="font-medium text-slate-700">Total due at pickup</p>
              <p className="text-xl font-bold text-emerald-700">{kes(booking.total_price)}</p>
            </div>
            <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              Bring a valid driving licence and national ID at pickup. Free cancellation is available
              within the policy window shown on your bookings page.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => window.print()}>Print agreement</Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('/bookings')}>
                View my bookings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const bookable = vehicle.status === 'available'

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="relative overflow-hidden rounded-2xl">
            <VehicleImage vehicle={vehicle} className="h-80 w-full bg-gradient-to-br from-slate-200 to-slate-300" />
            <div className="absolute right-4 top-4"><StatusBadge status={vehicle.current_status} /></div>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-slate-900">{vehicle.name}</h1>
          <p className="mt-1 capitalize text-slate-500">{vehicle.category} · {vehicle.year} · {vehicle.plate}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-emerald-600" /> {vehicle.seats} seats</span>
            <span className="flex items-center gap-1.5 capitalize"><Settings2 className="h-4 w-4 text-emerald-600" /> {vehicle.transmission}</span>
            <span className="flex items-center gap-1.5 capitalize"><Fuel className="h-4 w-4 text-emerald-600" /> {vehicle.fuel_type}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-emerald-600" /> {vehicle.location}</span>
          </div>

          <p className="mt-5 leading-relaxed text-slate-600">{vehicle.description}</p>

          {vehicle.features.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {vehicle.features.map((f) => (
                <span key={f} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{f}</span>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-baseline justify-between">
                <span>Book this car</span>
                <span className="text-lg text-emerald-700">{kes(vehicle.daily_rate)}<span className="text-xs font-normal text-slate-500">/day</span></span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!bookable ? (
                <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                  This vehicle is under maintenance and cannot be booked right now.
                </p>
              ) : (
                <>
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Select pickup → return dates. Greyed-out dates are already booked.
                  </p>
                  <div className="flex justify-center rounded-xl border p-2">
                    <Calendar
                      mode="range"
                      selected={range}
                      onSelect={setRange}
                      disabled={disabledDays}
                      numberOfMonths={1}
                    />
                  </div>
                  <div className="mt-4 space-y-1.5 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>{kes(vehicle.daily_rate)} × {nights || 0} day(s)</span>
                      <span>{kes(total)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold text-slate-900">
                      <span>Total</span><span>{kes(total)}</span>
                    </div>
                  </div>
                  <Button
                    className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={submitting || nights <= 0}
                    onClick={book}
                  >
                    {submitting ? 'Reserving…' : user ? 'Reserve now' : 'Log in to reserve'}
                  </Button>
                  <p className="mt-2 text-center text-xs text-slate-400">
                    Availability is re-checked when you reserve — no double bookings.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
