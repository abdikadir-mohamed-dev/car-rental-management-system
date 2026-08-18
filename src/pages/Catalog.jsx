import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Search, SlidersHorizontal } from 'lucide-react'

import { api } from '@/lib/api'
import { todayISO, addDaysISO } from '@/lib/format'
import VehicleCard from '@/components/VehicleCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

const CATEGORIES = ['economy', 'compact', 'suv', 'luxury', 'van', 'pickup']

const SORTS = [
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'year_desc', label: 'Newest model first' },
]

function sortVehicles(list, sort) {
  const copy = [...list]
  switch (sort) {
    case 'price_desc':
      return copy.sort((a, b) => b.daily_rate - a.daily_rate)
    case 'name_asc':
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    case 'year_desc':
      return copy.sort((a, b) => b.year - a.year)
    case 'price_asc':
    default:
      return copy.sort((a, b) => a.daily_rate - b.daily_rate)
  }
}

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const [vehicles, setVehicles] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  const [q, setQ] = useState(params.get('q') ?? '')
  const [category, setCategory] = useState(params.get('category') ?? '')
  const [location, setLocation] = useState(params.get('location') ?? '')
  const [start, setStart] = useState(params.get('start') ?? '')
  const [end, setEnd] = useState(params.get('end') ?? '')
  const [maxPrice, setMaxPrice] = useState(params.get('max_price') ?? '')
  const [sort, setSort] = useState(params.get('sort') ?? 'price_asc')

  const load = useCallback(() => {
    setLoading(true)
    const sp = new URLSearchParams()
    if (q) sp.set('q', q)
    if (category) sp.set('category', category)
    if (location) sp.set('location', location)
    if (start && end) {
      sp.set('start', start)
      sp.set('end', end)
    }
    if (maxPrice) sp.set('max_price', maxPrice)
    if (sort) sp.set('sort', sort)
    api(`/api/vehicles/?${sp.toString()}`)
      .then((d) => setVehicles(d.vehicles))
      .finally(() => setLoading(false))
  }, [q, category, location, start, end, maxPrice, sort])

  useEffect(load, [load])
  useEffect(() => {
    api('/api/vehicles/locations').then((d) => setLocations(d.locations)).catch(() => {})
  }, [])

  // Client-side sort as a safety net in case the backend ignores/only
  // partially supports the `sort` param.
  const sorted = useMemo(() => sortVehicles(vehicles, sort), [vehicles, sort])

  const clear = () => {
    setQ(''); setCategory(''); setLocation(''); setStart(''); setEnd(''); setMaxPrice(''); setSort('price_asc')
    setParams({})
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Browse the fleet</h1>
      <p className="mt-1 text-sm text-slate-500">
        Set your dates to see only vehicles that are free for the entire window.
      </p>

      <div className="mt-6 grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Label className="text-xs">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder="Make, model, category…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div>
          <Label className="text-xs">Category</Label>
          <Select value={category || 'any'} onValueChange={(v) => setCategory(v === 'any' ? '' : v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Location</Label>
          <Select value={location || 'any'} onValueChange={(v) => setLocation(v === 'any' ? '' : v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {locations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Max daily rate (KES)</Label>
          <Input type="number" min={0} placeholder="e.g. 10000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Sort by</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SORTS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button variant="outline" className="w-full" onClick={clear}>
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>
        <div className="lg:col-span-2">
          <Label className="text-xs">Pickup</Label>
          <Input type="date" min={todayISO()} value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div className="lg:col-span-2">
          <Label className="text-xs">Return</Label>
          <Input type="date" min={start || todayISO()} value={end} onChange={(e) => setEnd(e.target.value || addDaysISO(start, 1))} />
        </div>
        <div className="flex items-center text-sm text-slate-500 lg:col-span-2">
          {start && end ? `Showing cars free ${start} → ${end}` : 'Pick dates to filter by availability'}
        </div>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium text-slate-700">No vehicles match your search</p>
          <p className="mt-1 text-sm text-slate-500">Try widening the dates or clearing filters.</p>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-slate-500">{sorted.length} vehicle{sorted.length === 1 ? '' : 's'} found</p>
          <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
        </>
      )}
    </div>
  )
}
