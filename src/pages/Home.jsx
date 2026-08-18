import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  ArrowRight, CalendarCheck, Car, ClipboardCheck, Mail, MapPin, Phone,
  ShieldCheck, Star, Wallet,
} from 'lucide-react'

import { api } from '@/lib/api'
import { todayISO, addDaysISO } from '@/lib/format'
import VehicleCard from '@/components/VehicleCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const CATEGORIES = ['economy', 'compact', 'suv', 'luxury', 'van', 'pickup']

const HOW_IT_WORKS = [
  { step: '1', title: 'Search & compare', text: 'Pick your dates and browse a live, filterable fleet — no calling around.' },
  { step: '2', title: 'Book & pay', text: 'Reserve your car and confirm with secure online payment in a few taps.' },
  { step: '3', title: 'Drive or hire a driver', text: 'Self-drive, or add a professional driver to your booking at checkout.' },
  { step: '4', title: 'Pick up & go', text: 'Staff verify your details and hand over the car — mileage & condition logged digitally.' },
]

const TESTIMONIALS = [
  { name: 'Amina W.', role: 'Frequent renter, Nairobi', quote: 'Booking took two minutes and the car was exactly as described at pickup.' },
  { name: 'Brian K.', role: 'Weekend traveller', quote: 'Loved being able to see real availability instead of calling to check.' },
  { name: 'Grace N.', role: 'Business trip, Mombasa', quote: 'Hired a driver straight from the booking flow — smooth from start to finish.' },
]

export default function Home() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState([])
  const [start, setStart] = useState(todayISO())
  const [end, setEnd] = useState(addDaysISO(todayISO(), 3))
  const [category, setCategory] = useState('')
  const [contactSent, setContactSent] = useState(false)

  useEffect(() => {
    api('/api/vehicles/')
      .then((d) => setFeatured(d.vehicles.filter((v) => v.current_status === 'available').slice(0, 6)))
      .catch(() => {})
  }, [])

  const search = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (start) params.set('start', start)
    if (end) params.set('end', end)
    if (category) params.set('category', category)
    navigate(`/catalog?${params.toString()}`)
  }

  const submitContact = (e) => {
    e.preventDefault()
    // MVP: no backend contact endpoint yet — acknowledge locally.
    setContactSent(true)
  }

  return (
    <div>
      {/* Hero + main booking/search section */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Nairobi · Westlands · Mombasa · Nakuru
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            Rent a car without the paperwork
          </h1>
          <p className="mt-4 max-w-xl text-slate-300">
            Browse the live fleet, pick your dates, and book in minutes. Real-time availability
            means the car you book is the car you get — no double bookings, no phone calls.
          </p>

          <form
            onSubmit={search}
            className="mt-8 flex max-w-3xl flex-col gap-3 rounded-2xl bg-white p-4 text-slate-900 shadow-xl sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <label className="text-xs font-medium text-slate-500">Pickup date</label>
              <Input type="date" min={todayISO()} value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-slate-500">Return date</label>
              <Input type="date" min={start} value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-slate-500">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Any category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Find a car <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/catalog">
              <Button variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
                Browse the full fleet
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Create a free account</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services / benefits */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-slate-900">Why rent with Car Rental Management System</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            { icon: CalendarCheck, title: 'Live availability', text: 'Every booking updates the fleet calendar instantly, so double-booking is impossible.' },
            { icon: ShieldCheck, title: 'Transparent handover', text: 'Mileage, fuel and condition are logged digitally at pickup and return.' },
            { icon: Wallet, title: 'Clear pricing', text: 'Daily rates upfront, total computed before you confirm. No surprises at the desk.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border bg-white p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900">How it works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="relative rounded-2xl border border-dashed p-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                  {s.step}
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / popular vehicles */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Popular vehicles available now</h2>
          <Link to="/catalog" className="text-sm font-medium text-emerald-700 hover:underline">
            View full fleet →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.length === 0 ? (
            <p className="col-span-full text-sm text-slate-500">Loading available vehicles…</p>
          ) : (
            featured.map((v) => <VehicleCard key={v.id} vehicle={v} />)
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900">What renters say</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border bg-white p-6">
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-3 text-sm text-slate-600">“{t.quote}”</p>
                <p className="mt-4 text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">About Car Rental Management System</h2>
            <p className="mt-4 text-slate-600">
              Car Rental Management System is a role-aware car rental management platform built to replace paper
              forms, spreadsheets and phone bookings with one connected system. Customers book
              online with confidence, staff run pickup and return smoothly, and admins get a
              real-time view of the fleet — all from a single source of truth.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-2"><Car className="h-4 w-4 text-emerald-600" /> Growing multi-branch fleet</span>
              <span className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-emerald-600" /> Digital rental agreements</span>
            </div>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-8">
            <p className="text-4xl font-bold text-emerald-700">0 double bookings</p>
            <p className="mt-1 text-sm text-slate-600">Real-time availability checks prevent conflicts before they happen.</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Get in touch</h2>
              <p className="mt-2 text-sm text-slate-500">
                Questions about a booking, a branch, or a fleet partnership? Send us a message.
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-emerald-600" /> +254 700 000 000</p>
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-600" /> hello@carrental.example</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-600" /> Westlands, Nairobi</p>
              </div>
            </div>
            <form onSubmit={submitContact} className="space-y-3 rounded-2xl border p-6">
              {contactSent ? (
                <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
                  Thanks — your message has been noted. We'll get back to you shortly.
                </p>
              ) : (
                <>
                  <Input required placeholder="Your name" />
                  <Input type="email" required placeholder="you@example.com" />
                  <Textarea required placeholder="How can we help?" rows={4} />
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">Send message</Button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
