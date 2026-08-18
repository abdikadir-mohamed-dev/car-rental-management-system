import { Link } from 'react-router'
import { Fuel, MapPin, Settings2, Users } from 'lucide-react'

import { kes } from '@/lib/format'
import StatusBadge from '@/components/StatusBadge'
import { Card } from '@/components/ui/card'

export function VehicleImage({ vehicle, className }) {
  return (
    <div className={className ?? 'relative h-44 w-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300'}>
      {vehicle.image_url ? (
        <img
          src={vehicle.image_url}
          alt={vehicle.name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      ) : null}
    </div>
  )
}

export default function VehicleCard({ vehicle }) {
  const bookable = vehicle.current_status !== 'maintenance' && vehicle.current_status !== 'retired'
  return (
    <Link to={`/vehicles/${vehicle.id}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative">
          <VehicleImage vehicle={vehicle} />
          <div className="absolute right-3 top-3">
            <StatusBadge status={vehicle.current_status} />
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700">
                {vehicle.name}
              </h3>
              <p className="text-xs capitalize text-slate-500">
                {vehicle.category} · {vehicle.year}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-emerald-700">{kes(vehicle.daily_rate)}</p>
              <p className="text-xs text-slate-500">per day</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {vehicle.seats}</span>
            <span className="flex items-center gap-1 capitalize"><Settings2 className="h-3.5 w-3.5" /> {vehicle.transmission}</span>
            <span className="flex items-center gap-1 capitalize"><Fuel className="h-3.5 w-3.5" /> {vehicle.fuel_type}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {vehicle.location}</span>
          </div>
          {!bookable && (
            <p className="mt-3 rounded-md bg-rose-50 px-2 py-1.5 text-xs text-rose-600">
              {vehicle.current_status === 'retired'
                ? 'No longer in the active fleet'
                : 'Under maintenance — not bookable right now'}
            </p>
          )}
        </div>
      </Card>
    </Link>
  )
}
