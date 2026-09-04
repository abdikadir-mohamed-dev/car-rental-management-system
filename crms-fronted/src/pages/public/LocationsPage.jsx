import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { getVehicles } from "../../services/vehicleService";
import { mapVehicle } from "../../utils/apiMappers";
import LocationMap from "../../components/common/LocationMap";
import { geocodeLocation } from "../../utils/geocode";

const fallbackLocations = [
  "Nairobi CBD",
  "Westlands",
  "Kilimani",
  "Karen",
  "Industrial Area",
  "Jomo Kenyatta Airport",
  "Nairobi West",
];

function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await getVehicles();
        const vehicles = (data || []).map(mapVehicle);
        const locationCounts = vehicles.reduce((counts, vehicle) => {
          if (vehicle.location) {
            counts[vehicle.location] = (counts[vehicle.location] || 0) + 1;
          }
          return counts;
        }, {});
        const fetchedLocations = Object.entries(locationCounts).map(
          ([name, count]) => ({
            name,
            count,
          }),
        );
        setLocations(
          fetchedLocations.length > 0 ? fetchedLocations : fallbackLocations,
        );
      } catch {
        setLocations(fallbackLocations);
      } finally {
        setLoading(false);
      }
    };
    loadLocations();
  }, []);

  return (
    <div>
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Our Locations</h1>
          <p className="text-xl text-blue-100">
            Find us at convenient locations near you
          </p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <LocationMap
                  height="360px"
                  markers={locations.map((location) => {
                    const name =
                      typeof location === "string" ? location : location.name;
                    return { position: geocodeLocation(name), label: name };
                  })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {locations.map((location) => {
                const name =
                  typeof location === "string" ? location : location.name;
                const count =
                  typeof location === "string" ? null : location.count;
                return (
                  <div key={name} className="card p-6">
                    <MapPin className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {name}
                    </h3>
                    {count !== null && (
                      <p className="text-slate-600 text-sm">
                        {count} vehicles available
                      </p>
                    )}
                    <p className="text-slate-600 text-sm">
                      Mon - Sun: 8:00 AM - 8:00 PM
                    </p>
                  </div>
                );
              })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default LocationsPage;
