import { Link } from 'react-router-dom'
import { Car, Users, Gauge, Fuel, Star } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'

function VehicleCard({ vehicle }) {
  return (
    <Link to={`/vehicles/${vehicle._id}`} className="card overflow-hidden hover:shadow-md transition-shadow group">
      <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        {vehicle.image ? (
          <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
        ) : (
          <Car className="w-16 h-16 text-slate-400" />
        )}
      </div>
      <div className="p-5 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary transition-colors">
              {vehicle.name}
            </h3>
            <span className="badge bg-primary-light text-primary capitalize text-xs">{vehicle.type}</span>
          </div>
          <p className="text-sm text-slate-500">{vehicle.brand} {vehicle.model} ({vehicle.year})</p>
        </div>
        
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-amber-400 fill-current" />
          <span className="text-sm font-medium text-slate-700">4.8</span>
          <span className="text-sm text-slate-500">(124 reviews)</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {vehicle.seats} seats
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            {vehicle.transmission}
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            {vehicle.fuelType}
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <span className="text-xl font-bold text-primary">{formatCurrency(vehicle.pricePerDay)}</span>
            <span className="text-sm text-slate-500">/day</span>
          </div>
          <span className="text-primary font-medium text-sm group-hover:underline">View Details</span>
        </div>
      </div>
    </Link>
  )
}

export default VehicleCard
