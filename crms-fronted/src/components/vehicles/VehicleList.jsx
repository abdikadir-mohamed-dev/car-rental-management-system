import Loader from '../common/Loader'

function VehicleList({ vehicles, loading }) {
  if (loading) {
    return <Loader />
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">No vehicles found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <div key={vehicle._id} className="vehicle-card">
          {vehicle.image ? (
            <img src={vehicle.image} alt={vehicle.name} className="w-full h-48 object-cover rounded-lg" />
          ) : (
            <div className="w-full h-48 bg-slate-200 rounded-lg flex items-center justify-center">
              <span className="text-slate-400">No Image</span>
            </div>
          )}
          <h3 className="text-lg font-semibold mt-2">{vehicle.name}</h3>
          <p className="text-slate-600">{vehicle.type} - {vehicle.brand}</p>
          <p className="text-primary font-bold mt-2">${vehicle.pricePerDay}/day</p>
        </div>
      ))}
    </div>
  )
}

export default VehicleList
