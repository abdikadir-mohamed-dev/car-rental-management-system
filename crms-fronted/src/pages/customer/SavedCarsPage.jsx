import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, Users, Gauge, Fuel } from 'lucide-react'
import { mockVehicles } from '../../data/mockData'

function SavedCarsPage() {
  const [savedIds, setSavedIds] = useState([1, 3])
  const savedVehicles = mockVehicles.filter(v => savedIds.includes(v.id))

  const toggleSave = (id) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id])
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Saved Cars</h1>
      <p className="text-slate-600 mb-6">Your favorite vehicles</p>

      {savedVehicles.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No saved cars yet</h3>
          <p className="text-slate-600 mb-4">Start browsing and save your favorite vehicles.</p>
          <Link to="/customer/browse" className="btn-primary">Browse Cars</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <button
                  onClick={() => toggleSave(vehicle.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white"
                >
                  <Heart className={`w-5 h-5 ${savedIds.includes(vehicle.id) ? 'text-red-500 fill-current' : 'text-slate-400'}`} />
                </button>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {vehicle.name}
                    </h3>
                    <span className="bg-blue-100 text-blue-700 capitalize text-xs px-2 py-1 rounded-full font-medium">{vehicle.category}</span>
                  </div>
                  <p className="text-sm text-slate-500">{vehicle.brand}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-sm font-medium text-slate-700">{vehicle.rating}</span>
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
                    <span className="text-xl font-bold text-blue-600">KES {vehicle.pricePerDay}</span>
                    <span className="text-sm text-slate-500">/day</span>
                  </div>
                  <Link to={`/customer/vehicles/${vehicle.id}`} className="text-blue-600 font-medium text-sm hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedCarsPage
