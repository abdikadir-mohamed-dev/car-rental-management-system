import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Vite doesn't serve Leaflet's default marker images from the path it
// expects by default -- point it at the bundled assets explicitly.
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

/*
 * Lightweight OpenStreetMap/Leaflet map for showing pickup/drop-off
 * locations or a route between them. No API key required.
 *
 * markers: [{ position: [lat, lng], label: string }]
 * When exactly two markers are given, a line is drawn between them
 * to represent the route.
 */
function LocationMap({ markers, height = '240px', className = '' }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !markers || markers.length === 0) return

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
    })
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    markers.forEach(({ position, label }) => {
      L.marker(position, { icon: defaultIcon }).addTo(map).bindPopup(label || '')
    })

    if (markers.length === 2) {
      L.polyline(
        markers.map((m) => m.position),
        { color: '#2563eb', weight: 3, dashArray: '6 6' }
      ).addTo(map)
    }

    if (markers.length === 1) {
      map.setView(markers[0].position, 13)
    } else {
      const bounds = L.latLngBounds(markers.map((m) => m.position))
      map.fitBounds(bounds, { padding: [30, 30] })
    }

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [markers])

  if (!markers || markers.length === 0) return null

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={`w-full rounded-lg overflow-hidden border border-slate-200 ${className}`}
    />
  )
}

export default LocationMap
